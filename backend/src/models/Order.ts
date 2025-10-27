import { supabaseAdmin } from '../config/database';
import { Order, PaginationQuery } from '../types';
import { ApiError } from '../middleware/errorHandler';

export class OrderModel {
  static async findAll(
    userId: string,
    organizationId: string | undefined,
    query: PaginationQuery
  ): Promise<{ data: Order[]; total: number }> {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc', search } = query;
    const offset = (page - 1) * limit;

    let dbQuery = supabaseAdmin
      .from('orders')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    if (organizationId) {
      dbQuery = dbQuery.eq('organization_id', organizationId);
    }

    if (search) {
      // Sanitize search to prevent injection - escape special characters
      const sanitizedSearch = search.replace(/[%_]/g, '\\$&');
      dbQuery = dbQuery.or(`customer_name.ilike.%${sanitizedSearch}%,customer_phone.ilike.%${sanitizedSearch}%,id.ilike.%${sanitizedSearch}%`);
    }

    const { data, error, count } = await dbQuery
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new ApiError(`Error fetching orders: ${error.message}`, 500);
    }

    return { data: data || [], total: count || 0 };
  }

  static async findById(id: string, userId: string): Promise<Order | null> {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new ApiError(`Error fetching order: ${error.message}`, 500);
    }

    return data;
  }

  static async create(orderData: Partial<Order>): Promise<Order> {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert({
        ...orderData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new ApiError(`Error creating order: ${error.message}`, 500);
    }

    return data;
  }

  static async update(id: string, userId: string, orderData: Partial<Order>): Promise<Order> {
    // First check if order exists and belongs to user
    const existing = await this.findById(id, userId);
    if (!existing) {
      throw new ApiError('Order not found or access denied', 404);
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ ...orderData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new ApiError(`Error updating order: ${error.message}`, 500);
    }

    if (!data) {
      throw new ApiError('Order update failed', 500);
    }

    return data;
  }

  static async delete(id: string, userId: string): Promise<void> {
    // First check if order exists and belongs to user
    const existing = await this.findById(id, userId);
    if (!existing) {
      throw new ApiError('Order not found or access denied', 404);
    }

    const { error } = await supabaseAdmin
      .from('orders')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new ApiError(`Error deleting order: ${error.message}`, 500);
    }
  }

  static async getOrderStats(
    userId: string,
    organizationId: string | undefined,
    startDate?: string,
    endDate?: string
  ): Promise<any> {
    let query = supabaseAdmin
      .from('orders')
      .select('total_amount, status, payment_status, created_at')
      .eq('user_id', userId);

    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data, error } = await query;

    if (error) {
      throw new ApiError(`Error fetching order stats: ${error.message}`, 500);
    }

    // Safely compute stats
    const totalOrders = data?.length || 0;
    const totalRevenue = data?.reduce((sum, order) => {
      const amount = typeof order.total_amount === 'string'
        ? parseFloat(order.total_amount)
        : order.total_amount;
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0) || 0;

    const stats = {
      totalOrders,
      totalRevenue: Math.round(totalRevenue * 100) / 100, // Round to 2 decimal places
      pendingOrders: data?.filter(o => o.status === 'pending').length || 0,
      confirmedOrders: data?.filter(o => o.status === 'confirmed').length || 0,
      shippedOrders: data?.filter(o => o.status === 'shipped').length || 0,
      completedOrders: data?.filter(o => o.status === 'delivered').length || 0,
      cancelledOrders: data?.filter(o => o.status === 'cancelled').length || 0,
      pendingPayments: data?.filter(o => o.payment_status === 'pending').length || 0,
      paidOrders: data?.filter(o => o.payment_status === 'paid').length || 0,
    };

    return stats;
  }
}
