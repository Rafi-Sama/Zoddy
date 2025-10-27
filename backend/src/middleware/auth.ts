import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { WorkOS } from '@workos-inc/node';
import { JWTPayload, User } from '../types';
import { UserModel } from '../models/User';
import logger from '../utils/logger';
import { ApiError } from './errorHandler';

if (!process.env.WORKOS_API_KEY) {
  logger.error('WORKOS_API_KEY is not configured');
}

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  logger.warn('JWT_SECRET is not configured or too short. Using default (INSECURE!)');
}

const workos = new WorkOS(process.env.WORKOS_API_KEY);
const JWT_SECRET = process.env.JWT_SECRET || 'your-very-long-secret-key-minimum-32-characters-required';

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
 * Verify JWT token and attach user to request
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

    // Verify token with issuer and audience
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'zoddy-api',
      audience: 'zoddy-app',
    }) as JWTPayload;

    // Get user from database
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      throw new ApiError('User not found', 404);
    }

    // Attach user to request
    req.user = user;
    req.userId = user.id;
    req.organizationId = user.organization_id;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new ApiError('Invalid token', 401));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(new ApiError('Token expired', 401));
    }
    next(error);
  }
};

/**
 * Verify WorkOS session and create JWT
 */
export const verifyWorkOSSession = async (code: string): Promise<{ token: string; user: User }> => {
  try {
    if (!process.env.WORKOS_CLIENT_ID) {
      throw new ApiError('WorkOS client ID not configured', 500);
    }

    // Exchange authorization code for user profile
    const { user } = await workos.userManagement.authenticateWithCode({
      code,
      clientId: process.env.WORKOS_CLIENT_ID,
    });

    if (!user) {
      throw new ApiError('Invalid authorization code', 401);
    }

    // Check if user exists in our database
    let dbUser = await UserModel.findById(user.id);

    if (!dbUser) {
      // Create user if doesn't exist
      try {
        dbUser = await UserModel.create({
          id: user.id,
          email: user.email,
          first_name: user.firstName || undefined,
          last_name: user.lastName || undefined,
          email_verified: user.emailVerified,
          profile_picture_url: user.profilePictureUrl || undefined,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        logger.info(`New user created: ${user.email} (${user.id})`);
      } catch (createError) {
        // Handle race condition - user might have been created by another request
        logger.warn('User creation failed, attempting to fetch existing user:', createError);
        dbUser = await UserModel.findById(user.id);

        if (!dbUser) {
          throw new ApiError('Failed to create or retrieve user', 500);
        }
      }
    } else {
      // Update user info if changed
      if (
        dbUser.email !== user.email ||
        dbUser.first_name !== user.firstName ||
        dbUser.last_name !== user.lastName ||
        dbUser.profile_picture_url !== user.profilePictureUrl
      ) {
        try {
          dbUser = await UserModel.update(user.id, {
            email: user.email,
            first_name: user.firstName || undefined,
            last_name: user.lastName || undefined,
            email_verified: user.emailVerified,
            profile_picture_url: user.profilePictureUrl || undefined,
          });
        } catch (updateError) {
          logger.warn('User update failed, using existing data:', updateError);
          // Continue with existing user data if update fails
        }
      }
    }

    // Generate JWT token
    const jwtPayload: JWTPayload = {
      userId: dbUser.id,
      email: dbUser.email,
      organizationId: dbUser.organization_id,
    };

    const token = jwt.sign(jwtPayload, JWT_SECRET, {
      expiresIn: '7d',
      issuer: 'zoddy-api',
      audience: 'zoddy-app',
    });

    return { token, user: dbUser };
  } catch (error) {
    logger.error('WorkOS session verification failed:', error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError('Authentication failed. Please try again.', 401);
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
      const { data, error } = await supabaseAdmin
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
      const { data, error } = await supabaseAdmin
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
          const decoded = jwt.verify(token, JWT_SECRET, {
            issuer: 'zoddy-api',
            audience: 'zoddy-app',
          }) as JWTPayload;
          const user = await UserModel.findById(decoded.userId);

          if (user) {
            req.user = user;
            req.userId = user.id;
            req.organizationId = user.organization_id;
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

// Fix import issue
import { supabaseAdmin } from '../config/database';
