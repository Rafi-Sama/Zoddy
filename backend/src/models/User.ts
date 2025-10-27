import { supabaseAdmin } from '../config/database';
import { User } from '../types';
import { ApiError } from '../middleware/errorHandler';

export class UserModel {
  static async findById(id: string): Promise<User | null> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new ApiError(`Error fetching user: ${error.message}`, 500);
    }

    return data;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new ApiError(`Error fetching user: ${error.message}`, 500);
    }

    return data;
  }

  static async create(userData: Partial<User>): Promise<User> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert(userData)
      .select()
      .single();

    if (error) {
      throw new ApiError(`Error creating user: ${error.message}`, 500);
    }

    return data;
  }

  static async update(id: string, userData: Partial<User>): Promise<User> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ ...userData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new ApiError(`Error updating user: ${error.message}`, 500);
    }

    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      throw new ApiError(`Error deleting user: ${error.message}`, 500);
    }
  }

  static async findByOrganization(organizationId: string): Promise<User[]> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('organization_id', organizationId);

    if (error) {
      throw new ApiError(`Error fetching users: ${error.message}`, 500);
    }

    return data || [];
  }
}
