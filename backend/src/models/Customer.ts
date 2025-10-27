import { supabaseAdmin } from '../config/database';
import { Customer, PaginationQuery } from '../types';
import { ApiError } from '../middleware/errorHandler';

export class CustomerModel {
  static async findAll(
    userId: string,
    organizationId: string | undefined,
    query: PaginationQuery
  ): Promise<{ data: Customer[]; total: number }> {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc', search } = query;
    const offset = (page - 1) * limit;

    let dbQuery = supabaseAdmin
      .from('customers')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    if (organizationId) {
      dbQuery = dbQuery.eq('organization_id', organizationId);
    }

    if (search) {
      // Sanitize search to prevent injection - escape special characters
      const sanitizedSearch = search.replace(/[%_]/g, '\\$&');
      dbQuery = dbQuery.or(`name.ilike.%${sanitizedSearch}%,phone.ilike.%${sanitizedSearch}%,email.ilike.%${sanitizedSearch}%`);
    }

    const { data, error, count } = await dbQuery
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new ApiError(`Error fetching customers: ${error.message}`, 500);
    }

    return { data: data || [], total: count || 0 };
  }

  static async findById(id: string, userId: string): Promise<Customer | null> {
    const { data, error } = await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new ApiError(`Error fetching customer: ${error.message}`, 500);
    }

    return data;
  }

  static async findByPhone(phone: string, userId: string): Promise<Customer | null> {
    const { data, error } = await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('phone', phone)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new ApiError(`Error fetching customer: ${error.message}`, 500);
    }

    return data;
  }

  static async create(customerData: Partial<Customer>): Promise<Customer> {
    const { data, error } = await supabaseAdmin
      .from('customers')
      .insert({
        ...customerData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new ApiError(`Error creating customer: ${error.message}`, 500);
    }

    return data;
  }

  static async update(id: string, userId: string, customerData: Partial<Customer>): Promise<Customer> {
    // First check if customer exists and belongs to user
    const existing = await this.findById(id, userId);
    if (!existing) {
      throw new ApiError('Customer not found or access denied', 404);
    }

    const { data, error } = await supabaseAdmin
      .from('customers')
      .update({ ...customerData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new ApiError(`Error updating customer: ${error.message}`, 500);
    }

    if (!data) {
      throw new ApiError('Customer update failed', 500);
    }

    return data;
  }

  static async delete(id: string, userId: string): Promise<void> {
    // First check if customer exists and belongs to user
    const existing = await this.findById(id, userId);
    if (!existing) {
      throw new ApiError('Customer not found or access denied', 404);
    }

    const { error } = await supabaseAdmin
      .from('customers')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new ApiError(`Error deleting customer: ${error.message}`, 500);
    }
  }

  static async updateOrderStats(customerId: string): Promise<void> {
    // Get customer's orders
    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select('total_amount, created_at')
      .eq('customer_id', customerId)
      .eq('status', 'delivered')
      .order('created_at', { ascending: false });

    if (error) {
      throw new ApiError(`Error fetching customer orders: ${error.message}`, 500);
    }

    const totalOrders = orders?.length || 0;

    // Safely calculate total spent with validation
    const totalSpent = orders?.reduce((sum, order) => {
      const amount = typeof order.total_amount === 'string'
        ? parseFloat(order.total_amount)
        : order.total_amount;
      return sum + (isNaN(amount) || amount == null ? 0 : amount);
    }, 0) || 0;

    // Calculate average with proper rounding and NaN protection
    const averageOrderValue = totalOrders > 0 && totalSpent > 0
      ? Math.round((totalSpent / totalOrders) * 100) / 100
      : 0;

    const lastOrderDate = orders && orders.length > 0 ? orders[0].created_at : null;

    // Update customer stats
    const { error: updateError } = await supabaseAdmin
      .from('customers')
      .update({
        total_orders: totalOrders,
        total_spent: Math.round(totalSpent * 100) / 100,
        average_order_value: averageOrderValue,
        last_order_date: lastOrderDate,
        updated_at: new Date().toISOString(),
      })
      .eq('id', customerId);

    if (updateError) {
      throw new ApiError(`Error updating customer stats: ${updateError.message}`, 500);
    }
  }
}
