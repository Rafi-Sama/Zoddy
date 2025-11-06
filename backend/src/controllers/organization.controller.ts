import { Request, Response } from 'express';
import { supabase } from '../middleware/auth';
import { ResponseHandler } from '../utils/response';
import { ApiError } from '../middleware/errorHandler';
import { HTTP_STATUS } from '../utils/constants';
import logger from '../utils/logger';
import { mapSupabaseError } from '../utils/supabase-helpers';

export class OrganizationController {
  /**
   * Get all organizations the user belongs to
   * OPTIMIZED: Uses RPC function for efficient query
   */
  static async getUserOrganizations(req: Request, res: Response) {
    const userId = req.userId;

    if (!userId) {
      throw new ApiError('User not authenticated', HTTP_STATUS.UNAUTHORIZED);
    }

    try {
      // OPTIMIZATION: Use RPC function for optimized query
      const { data, error } = await supabase.rpc('get_user_organizations', {
        p_user_id: userId
      });

      if (error) {
        logger.error('User organizations fetch error:', error);
        throw new ApiError(
          mapSupabaseError(error),
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      }

      const organizations = data?.map((org: any) => ({
        id: org.org_id,
        name: org.org_name,
        slug: org.org_slug,
        role: org.role,
        isOwner: org.is_owner,
        subscriptionPlan: org.subscription_plan,
        settings: org.settings || {},
        createdAt: org.created_at
      })) || [];

      return ResponseHandler.success(res, { organizations });
    } catch (error) {
      logger.error('Get user organizations error:', error);
      throw error;
    }
  }

  /**
   * Switch user's active organization
   * OPTIMIZED: Uses RPC function with verification
   */
  static async switchOrganization(req: Request, res: Response) {
    const userId = req.userId;
    const { organizationId } = req.body;

    if (!userId) {
      throw new ApiError('User not authenticated', HTTP_STATUS.UNAUTHORIZED);
    }

    if (!organizationId) {
      throw new ApiError('Organization ID is required', HTTP_STATUS.BAD_REQUEST);
    }

    try {
      // OPTIMIZATION: Use RPC function for atomic verification + update
      const { error } = await supabase.rpc('switch_user_organization', {
        p_user_id: userId,
        p_organization_id: organizationId
      });

      if (error) {
        logger.error('Organization switch error:', error);

        // Handle specific error cases
        if (error.message?.includes('not a member')) {
          throw new ApiError('You are not a member of this organization', HTTP_STATUS.FORBIDDEN);
        }

        throw new ApiError(
          mapSupabaseError(error),
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      }

      return ResponseHandler.success(
        res,
        { organizationId },
        'Organization switched successfully'
      );
    } catch (error) {
      logger.error('Switch organization error:', error);
      throw error;
    }
  }

  /**
   * Get current organization details
   * OPTIMIZED: Uses RPC function for single query
   */
  static async getCurrentOrganization(req: Request, res: Response) {
    const userId = req.userId;

    if (!userId) {
      throw new ApiError('User not authenticated', HTTP_STATUS.UNAUTHORIZED);
    }

    try {
      // OPTIMIZATION: Use RPC function for single optimized query
      const { data, error } = await supabase.rpc('get_current_organization_details', {
        p_user_id: userId
      });

      if (error || !data || data.length === 0) {
        logger.error('Organization fetch error:', error);
        throw new ApiError('No active organization', HTTP_STATUS.NOT_FOUND);
      }

      const orgData = data[0];

      return ResponseHandler.success(res, {
        organization: {
          id: orgData.org_id,
          name: orgData.org_name,
          slug: orgData.org_slug,
          ownerId: orgData.owner_id,
          subscriptionPlan: orgData.subscription_plan,
          subscriptionStatus: orgData.subscription_status,
          settings: orgData.settings,
          createdAt: orgData.created_at
        },
        userRole: orgData.user_role,
        permissions: orgData.permissions
      });
    } catch (error) {
      logger.error('Get current organization error:', error);
      throw error;
    }
  }

  /**
   * Create a new organization
   * OPTIMIZED: Uses RPC function for atomic transaction
   */
  static async createOrganization(req: Request, res: Response) {
    const userId = req.userId;
    const { name } = req.body;

    if (!userId) {
      throw new ApiError('User not authenticated', HTTP_STATUS.UNAUTHORIZED);
    }

    if (!name) {
      throw new ApiError('Organization name is required', HTTP_STATUS.BAD_REQUEST);
    }

    try {
      // Generate slug
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        + '-' + Math.random().toString(36).substr(2, 6);

      // OPTIMIZATION: Use RPC function for atomic transaction
      const { data, error } = await supabase.rpc('create_organization_with_membership', {
        p_user_id: userId,
        p_org_name: name,
        p_org_slug: slug,
        p_settings: {}
      });

      if (error || !data || data.length === 0) {
        logger.error('Organization creation error:', error);
        throw new ApiError(
          mapSupabaseError(error),
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      }

      const orgData = data[0];

      return ResponseHandler.success(
        res,
        {
          organization: {
            id: orgData.organization_id,
            name: orgData.org_name,
            slug: orgData.org_slug
          }
        },
        'Organization created successfully',
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      logger.error('Create organization error:', error);
      throw error;
    }
  }

  /**
   * Update organization settings
   */
  static async updateOrganization(req: Request, res: Response) {
    const userId = req.userId;
    const { organizationId } = req.params;
    const updates = req.body;

    if (!userId) {
      throw new ApiError('User not authenticated', HTTP_STATUS.UNAUTHORIZED);
    }

    try {
      // Verify user has admin/owner role
      const { data: membership } = await supabase
        .from('team_members')
        .select('role')
        .eq('user_id', userId)
        .eq('organization_id', organizationId)
        .single();

      if (!membership || !['owner', 'admin'].includes(membership.role)) {
        throw new ApiError('Insufficient permissions', HTTP_STATUS.FORBIDDEN);
      }

      // Update organization
      const allowedFields = ['name', 'settings'];
      const filteredUpdates: any = {};

      for (const key of allowedFields) {
        if (updates[key] !== undefined) {
          filteredUpdates[key] = updates[key];
        }
      }

      const { data: organization, error } = await supabase
        .from('organizations')
        .update(filteredUpdates)
        .eq('id', organizationId)
        .select()
        .single();

      if (error) {
        logger.error('Organization update error:', error);
        throw new ApiError('Failed to update organization', HTTP_STATUS.INTERNAL_SERVER_ERROR);
      }

      return ResponseHandler.success(res, { organization }, 'Organization updated successfully');
    } catch (error) {
      logger.error('Update organization error:', error);
      throw error;
    }
  }

  /**
   * Update organization branding (logo, slogan, colors)
   * OPTIMIZED: Uses RPC function for atomic update
   */
  static async updateOrganizationBranding(req: Request, res: Response) {
    const userId = req.userId;
    const { organizationId } = req.params;
    const { businessLogo, businessSlogan, brandColors } = req.body;

    if (!userId) {
      throw new ApiError('User not authenticated', HTTP_STATUS.UNAUTHORIZED);
    }

    try {
      // Use RPC function for atomic update with permission check
      const { data: settings, error } = await supabase.rpc('update_organization_branding', {
        p_user_id: userId,
        p_organization_id: organizationId,
        p_business_logo: businessLogo || null,
        p_business_slogan: businessSlogan || null,
        p_brand_colors: brandColors || null
      });

      if (error) {
        logger.error('Organization branding update error:', error);

        // Handle specific error cases
        if (error.message?.includes('permission')) {
          throw new ApiError('Insufficient permissions to update organization branding', HTTP_STATUS.FORBIDDEN);
        }

        throw new ApiError(
          mapSupabaseError(error),
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      }

      return ResponseHandler.success(
        res,
        { settings },
        'Organization branding updated successfully'
      );
    } catch (error) {
      logger.error('Update organization branding error:', error);
      throw error;
    }
  }
}
