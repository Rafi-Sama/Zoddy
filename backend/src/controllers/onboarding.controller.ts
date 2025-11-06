import { Request, Response } from 'express';
import { supabase } from '../middleware/auth';
import { ResponseHandler } from '../utils/response';
import { ApiError } from '../middleware/errorHandler';
import { HTTP_STATUS } from '../utils/constants';
import logger from '../utils/logger';
import { mapSupabaseError } from '../utils/supabase-helpers';

export class OnboardingController {
  /**
   * Complete onboarding - Create organization and user profile
   * OPTIMIZED: Uses RPC function for transactional consistency
   */
  static async completeOnboarding(req: Request, res: Response) {
    const {
      businessName,
      phone,
      integrations,
      teamMembers,
      firstName,
      lastName
    } = req.body;

    const userId = req.userId;

    if (!userId) {
      throw new ApiError('User not authenticated', HTTP_STATUS.UNAUTHORIZED);
    }

    if (!businessName || !phone || !firstName || !lastName) {
      throw new ApiError('Required fields missing: businessName, phone, firstName, lastName', HTTP_STATUS.BAD_REQUEST);
    }

    try {
      // Generate slug from business name
      const slug = businessName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        + '-' + Math.random().toString(36).substr(2, 6);

      // OPTIMIZATION: Use RPC function for atomic transaction
      // This creates organization, team_member, and updates profile in one transaction
      const { data, error: orgError } = await supabase.rpc('create_organization_with_membership', {
        p_user_id: userId,
        p_org_name: businessName,
        p_org_slug: slug,
        p_settings: {
          phone,
          integrations: integrations || { delivery: [], messaging: [] }
        }
      });

      if (orgError || !data || data.length === 0) {
        logger.error('Organization creation error:', orgError);
        throw new ApiError(
          mapSupabaseError(orgError),
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      }

      const organization = {
        id: data[0].organization_id,
        name: data[0].org_name,
        slug: data[0].org_slug
      };

      // Update profile with personal info
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          role: 'owner'
        })
        .eq('id', userId);

      if (profileError) {
        logger.error('Profile update error:', profileError);
        logger.warn('Organization was created but profile update failed - this is non-critical');
      }

      // Step 3: Create notifications for team member invitations if any
      if (teamMembers && Array.isArray(teamMembers) && teamMembers.length > 0) {
        const notifications = teamMembers.map((member: { email: string; role: string }) => ({
          user_id: userId,
          organization_id: organization.id,
          title: `Team invitation sent to ${member.email}`,
          description: `Invited ${member.email} as ${member.role}`,
          type: 'team',
          read: false
        }));

        const { error: notificationError } = await supabase
          .from('notifications')
          .insert(notifications);

        if (notificationError) {
          logger.warn('Failed to create notifications:', notificationError);
        }
      }

      return ResponseHandler.success(
        res,
        {
          organization: {
            id: organization.id,
            name: businessName,
            slug: slug
          },
          profile: {
            firstName,
            lastName,
            phone
          },
          onboardingComplete: true
        },
        'Onboarding completed successfully'
      );
    } catch (error) {
      logger.error('Onboarding error:', error);
      throw error;
    }
  }

  /**
   * Check if user has completed onboarding
   */
  static async checkOnboardingStatus(req: Request, res: Response) {
    const userId = req.userId;

    if (!userId) {
      throw new ApiError('User not authenticated', HTTP_STATUS.UNAUTHORIZED);
    }

    try {
      // Check if user has an organization
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('organization_id, first_name, last_name')
        .eq('id', userId)
        .single();

      if (error) {
        logger.error('Profile fetch error:', error);
        throw new ApiError('Failed to fetch profile', HTTP_STATUS.INTERNAL_SERVER_ERROR);
      }

      return ResponseHandler.success(res, {
        hasCompletedOnboarding: !!profile?.organization_id,
        organizationId: profile?.organization_id,
        profile: {
          firstName: profile?.first_name,
          lastName: profile?.last_name
        }
      });
    } catch (error) {
      logger.error('Check onboarding status error:', error);
      throw error;
    }
  }
}
