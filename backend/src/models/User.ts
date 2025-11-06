import { supabaseAdmin } from '../config/database';
import { User } from '../types';
import { ApiError } from '../middleware/errorHandler';
import logger from '../utils/logger';

export class UserModel {
  /**
   * Find user by ID (UUID from Supabase Auth)
   */
  static async findById(id: string): Promise<User | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      // PGRST116 = no rows returned (user doesn't exist)
      if (error && error.code !== 'PGRST116') {
        logger.error(`Error fetching user ${id}:`, error);
        throw new ApiError(`Error fetching user: ${error.message}`, 500);
      }

      return data;
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      logger.error('Database error in findById:', err);
      throw new ApiError('Database connection failed', 503);
    }
  }

  /**
   * Find user by email
   * OPTIMIZED: Now uses indexed email column in profiles table (O(1))
   */
  static async findByEmail(email: string): Promise<User | null> {
    try {
      // Use indexed email column in profiles for O(1) lookup
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .ilike('email', email) // Case-insensitive match using index
        .limit(1)
        .single();

      // PGRST116 = no rows returned (user doesn't exist)
      if (error && error.code !== 'PGRST116') {
        logger.error(`Error fetching user by email ${email}:`, error);
        throw new ApiError(`Error fetching user: ${error.message}`, 500);
      }

      return data;
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      logger.error('Database error in findByEmail:', err);
      throw new ApiError('Database connection failed', 503);
    }
  }

  /**
   * Create or upsert user profile
   * Uses upsert to handle race conditions when user is created from multiple sources
   */
  static async create(userData: Partial<User>): Promise<User> {
    try {
      // Ensure required fields are present
      if (!userData.id || !userData.email) {
        throw new ApiError('User ID and email are required', 400);
      }

      const { data, error } = await supabaseAdmin
        .from('profiles')
        .upsert({
          ...userData,
          created_at: userData.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (error) {
        logger.error('Error creating user:', error);
        throw new ApiError(`Error creating user: ${error.message}`, 500);
      }

      logger.info(`User created/updated: ${data.email} (${data.id})`);
      return data;
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      logger.error('Database error in create:', err);
      throw new ApiError('Database connection failed', 503);
    }
  }

  /**
   * Update user profile
   */
  static async update(id: string, userData: Partial<User>): Promise<User> {
    try {
      // Remove fields that shouldn't be updated
      const { id: _, created_at, ...updateData } = userData;

      const { data, error } = await supabaseAdmin
        .from('profiles')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new ApiError('User not found', 404);
        }
        logger.error(`Error updating user ${id}:`, error);
        throw new ApiError(`Error updating user: ${error.message}`, 500);
      }

      logger.info(`User updated: ${data.email} (${data.id})`);
      return data;
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      logger.error('Database error in update:', err);
      throw new ApiError('Database connection failed', 503);
    }
  }

  /**
   * Delete user (cascade deletes handled by foreign keys)
   */
  static async delete(id: string): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) {
        if (error.code === 'PGRST116') {
          throw new ApiError('User not found', 404);
        }
        logger.error(`Error deleting user ${id}:`, error);
        throw new ApiError(`Error deleting user: ${error.message}`, 500);
      }

      logger.info(`User deleted: ${id}`);
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      logger.error('Database error in delete:', err);
      throw new ApiError('Database connection failed', 503);
    }
  }

  /**
   * Find all users in an organization
   */
  static async findByOrganization(organizationId: string): Promise<User[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error(`Error fetching users for org ${organizationId}:`, error);
        throw new ApiError(`Error fetching users: ${error.message}`, 500);
      }

      return data || [];
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      logger.error('Database error in findByOrganization:', err);
      throw new ApiError('Database connection failed', 503);
    }
  }

  /**
   * Check if user exists
   */
  static async exists(id: string): Promise<boolean> {
    try {
      const { count, error } = await supabaseAdmin
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('id', id);

      if (error) {
        logger.error(`Error checking user existence ${id}:`, error);
        return false;
      }

      return (count ?? 0) > 0;
    } catch (err) {
      logger.error('Database error in exists:', err);
      return false;
    }
  }

  /**
   * Get user with organization details
   */
  static async findByIdWithOrg(id: string): Promise<User | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select(`
          *,
          organizations!organization_id (
            id,
            name,
            subscription_plan
          )
        `)
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') {
        logger.error(`Error fetching user with org ${id}:`, error);
        throw new ApiError(`Error fetching user: ${error.message}`, 500);
      }

      return data;
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      logger.error('Database error in findByIdWithOrg:', err);
      throw new ApiError('Database connection failed', 503);
    }
  }

  /**
   * Update user's last activity
   */
  static async updateLastActivity(id: string): Promise<void> {
    try {
      await supabaseAdmin
        .from('profiles')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', id);

      // Don't throw error for activity updates
    } catch (err) {
      logger.debug('Failed to update last activity:', err);
    }
  }
}