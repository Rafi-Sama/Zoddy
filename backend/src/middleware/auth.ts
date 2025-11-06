import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { User } from '../types';
import logger from '../utils/logger';
import { ApiError } from './errorHandler';

// Ensure Supabase environment variables are configured
if (!process.env.SUPABASE_URL) {
  logger.error('SUPABASE_URL is not configured');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  logger.error('SUPABASE_SERVICE_ROLE_KEY is not configured');
}

// Initialize Supabase client with service role for backend operations
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: User;
      userId?: string;
      organizationId?: string;
    }
  }
}

/**
 * Verify Supabase JWT token and attach user to request
 */
export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new ApiError('Invalid token format', 401);
    }

    // Verify the JWT token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      logger.error('Token verification failed:', error);
      throw new ApiError('Invalid or expired token', 401);
    }

    // Get additional user profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      logger.warn(`Failed to fetch user profile for ${user.id}:`, profileError);
    }

    // Create user object with Supabase auth data and profile
    const userData: User = {
      id: user.id,
      email: user.email || '',
      email_verified: user.email_confirmed_at ? true : false,
      created_at: user.created_at || new Date().toISOString(),
      updated_at: profile?.updated_at || new Date().toISOString(),
      first_name: profile?.first_name || user.user_metadata?.first_name,
      last_name: profile?.last_name || user.user_metadata?.last_name,
      profile_picture_url: profile?.profile_picture_url || user.user_metadata?.avatar_url,
      organization_id: profile?.organization_id || user.user_metadata?.organization_id,
      phone: user.phone || profile?.phone,
      role: profile?.role || user.user_metadata?.role || 'member',
    };

    // If user profile doesn't exist in database, create it
    if (!profile) {
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          first_name: user.user_metadata?.first_name,
          last_name: user.user_metadata?.last_name,
          profile_picture_url: user.user_metadata?.avatar_url,
          phone: user.phone,
          created_at: user.created_at,
          updated_at: new Date().toISOString(),
        });

      if (insertError) {
        logger.warn(`Failed to create user profile for ${user.id}:`, insertError);
      } else {
        logger.info(`User profile created for ${user.email} (${user.id})`);
      }
    }

    // Attach user to request
    req.user = userData;
    req.userId = userData.id;
    req.organizationId = userData.organization_id;

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      logger.error('Authentication error:', error);
      next(new ApiError('Authentication failed', 401));
    }
  }
};

/**
 * Verify Supabase session for auth endpoints
 */
export const verifySupabaseSession = async (
  accessToken: string,
  refreshToken?: string
): Promise<{ user: User }> => {
  try {
    // Set the session if refresh token is provided
    if (refreshToken) {
      const { data: session, error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (sessionError) {
        throw new ApiError('Invalid session tokens', 401);
      }

      if (!session?.user) {
        throw new ApiError('No user found in session', 401);
      }
    }

    // Get user from access token
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      throw new ApiError('Invalid access token', 401);
    }

    // Get or create user profile
    let { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Create profile if it doesn't exist
    if (!profile) {
      const newProfile = {
        id: user.id,
        first_name: user.user_metadata?.first_name,
        last_name: user.user_metadata?.last_name,
        profile_picture_url: user.user_metadata?.avatar_url,
        phone: user.phone,
        created_at: user.created_at,
        updated_at: new Date().toISOString(),
      };

      const { data: insertedProfile, error: insertError } = await supabase
        .from('profiles')
        .insert(newProfile)
        .select()
        .single();

      if (insertError) {
        logger.error('Failed to create user profile:', insertError);
        profile = newProfile; // Use the new profile data even if insert failed
      } else {
        profile = insertedProfile;
        logger.info(`New user profile created: ${user.email} (${user.id})`);
      }
    }

    // Build complete user object
    const userData: User = {
      id: user.id,
      email: user.email || '',
      email_verified: user.email_confirmed_at ? true : false,
      created_at: profile.created_at || user.created_at,
      updated_at: profile.updated_at || new Date().toISOString(),
      first_name: profile.first_name,
      last_name: profile.last_name,
      profile_picture_url: profile.profile_picture_url,
      organization_id: profile.organization_id,
      phone: profile.phone || user.phone,
      role: profile.role || 'member',
    };

    return { user: userData };
  } catch (error) {
    logger.error('Supabase session verification failed:', error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError('Session verification failed', 401);
  }
};

/**
 * Require specific permissions
 */
export const requirePermission = (permission: keyof import('../types').TeamPermissions) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.userId || !req.organizationId) {
        throw new ApiError('Unauthorized', 401);
      }

      // Get team member permissions
      const { data, error } = await supabase
        .from('team_members')
        .select('permissions, role')
        .eq('user_id', req.userId)
        .eq('organization_id', req.organizationId)
        .single();

      if (error || !data) {
        throw new ApiError('Team member not found', 404);
      }

      // Owners and admins have all permissions
      if (data.role === 'owner' || data.role === 'admin') {
        return next();
      }

      // Check if permissions object exists and has the required permission
      if (!data.permissions || typeof data.permissions !== 'object') {
        throw new ApiError('Invalid permissions structure', 500);
      }

      // Check specific permission
      if (data.permissions[permission] !== true) {
        throw new ApiError('Insufficient permissions', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Require specific role
 */
export const requireRole = (...roles: Array<'owner' | 'admin' | 'member'>) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.userId || !req.organizationId) {
        throw new ApiError('Unauthorized', 401);
      }

      // Get team member role
      const { data, error } = await supabase
        .from('team_members')
        .select('role')
        .eq('user_id', req.userId)
        .eq('organization_id', req.organizationId)
        .single();

      if (error || !data) {
        throw new ApiError('Team member not found', 404);
      }

      if (!roles.includes(data.role)) {
        throw new ApiError('Insufficient permissions', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Optional authentication - doesn't fail if no token
 */
export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        try {
          const { data: { user }, error } = await supabase.auth.getUser(token);

          if (user && !error) {
            // Get user profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .single();

            const userData: User = {
              id: user.id,
              email: user.email || '',
              email_verified: user.email_confirmed_at ? true : false,
              created_at: profile?.created_at || user.created_at,
              updated_at: profile?.updated_at || new Date().toISOString(),
              first_name: profile?.first_name,
              last_name: profile?.last_name,
              profile_picture_url: profile?.profile_picture_url,
              organization_id: profile?.organization_id,
              phone: profile?.phone || user.phone,
              role: profile?.role || 'member',
            };

            req.user = userData;
            req.userId = userData.id;
            req.organizationId = userData.organization_id;
          }
        } catch (verifyError) {
          // Invalid token - continue without auth
          logger.debug('Optional auth token verification failed:', verifyError);
        }
      }
    }
    next();
  } catch (error) {
    // Continue without authentication
    logger.debug('Optional auth failed:', error);
    next();
  }
};

// Export the Supabase client for use in other modules
export { supabase };