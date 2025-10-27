import { supabaseAdmin } from '../config/database';
import { Product, StockMovement, PaginationQuery } from '../types';
import { ApiError } from '../middleware/errorHandler';
import logger from '../utils/logger';

export class ProductModel {
  static async findAll(
    userId: string,
    organizationId: string | undefined,
    query: PaginationQuery
  ): Promise<{ data: Product[]; total: number }> {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc', search } = query;
    const offset = (page - 1) * limit;

    let dbQuery = supabaseAdmin
      .from('products')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    if (organizationId) {
      dbQuery = dbQuery.eq('organization_id', organizationId);
    }

    if (search) {
      // Sanitize search to prevent injection - escape special characters
      const sanitizedSearch = search.replace(/[%_]/g, '\\$&');
      dbQuery = dbQuery.or(`name.ilike.%${sanitizedSearch}%,sku.ilike.%${sanitizedSearch}%,category.ilike.%${sanitizedSearch}%`);
    }

    const { data, error, count } = await dbQuery
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new ApiError(`Error fetching products: ${error.message}`, 500);
    }

    return { data: data || [], total: count || 0 };
  }

  static async findById(id: string, userId: string): Promise<Product | null> {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new ApiError(`Error fetching product: ${error.message}`, 500);
    }

    return data;
  }

  static async findBySKU(sku: string, userId: string): Promise<Product | null> {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('sku', sku)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new ApiError(`Error fetching product: ${error.message}`, 500);
    }

    return data;
  }

  static async create(productData: Partial<Product>): Promise<Product> {
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert({
        ...productData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new ApiError(`Error creating product: ${error.message}`, 500);
    }

    return data;
  }

  static async update(id: string, userId: string, productData: Partial<Product>): Promise<Product> {
    // First check if product exists and belongs to user
    const existing = await this.findById(id, userId);
    if (!existing) {
      throw new ApiError('Product not found or access denied', 404);
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .update({ ...productData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new ApiError(`Error updating product: ${error.message}`, 500);
    }

    if (!data) {
      throw new ApiError('Product update failed', 500);
    }

    return data;
  }

  static async delete(id: string, userId: string): Promise<void> {
    // First check if product exists and belongs to user
    const existing = await this.findById(id, userId);
    if (!existing) {
      throw new ApiError('Product not found or access denied', 404);
    }

    // Check if product has stock movements - prevent deletion if it does
    const { data: movements } = await supabaseAdmin
      .from('stock_movements')
      .select('id')
      .eq('product_id', id)
      .limit(1);

    if (movements && movements.length > 0) {
      throw new ApiError('Cannot delete product with stock movement history. Set status to inactive instead.', 400);
    }

    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new ApiError(`Error deleting product: ${error.message}`, 500);
    }
  }

  static async updateStock(
    productId: string,
    quantity: number,
    type: 'in' | 'out' | 'adjustment',
    userId: string,
    organizationId?: string,
    reason?: string
  ): Promise<Product> {
    /*
     * WARNING: This method has a potential race condition for concurrent stock updates.
     * For production use, consider using database-level atomic operations or row-level locking.
     * Example: UPDATE products SET current_stock = current_stock + $1 WHERE id = $2
     *
     * Current implementation uses optimistic locking via versioning or
     * should be called within a transaction for critical operations.
     */

    // Validate quantity is a valid number
    if (typeof quantity !== 'number' || isNaN(quantity)) {
      throw new ApiError('Quantity must be a valid number', 400);
    }

    // Validate quantity based on type
    if (type === 'adjustment') {
      // For adjustment, allow 0 or positive values only
      if (quantity < 0) {
        throw new ApiError('Adjustment quantity must be zero or positive', 400);
      }
    } else {
      // For in/out, quantity must be positive
      if (quantity <= 0) {
        throw new ApiError('Quantity must be positive for stock in/out operations', 400);
      }
    }

    // Get current product with SELECT FOR UPDATE semantics would be ideal here
    const product = await this.findById(productId, userId);
    if (!product) {
      throw new ApiError('Product not found', 404);
    }

    // Check if product is active
    if (product.status !== 'active') {
      throw new ApiError('Cannot update stock for inactive products', 400);
    }

    // Calculate new stock
    let newStock: number;
    if (type === 'out') {
      newStock = product.current_stock - quantity;
    } else if (type === 'in') {
      newStock = product.current_stock + quantity;
    } else {
      // adjustment sets absolute value
      newStock = quantity;
    }

    // Validate new stock level BEFORE update
    if (newStock < 0) {
      throw new ApiError(`Insufficient stock. Available: ${product.current_stock}, Requested: ${quantity}`, 400);
    }

    // Ensure newStock is an integer
    newStock = Math.floor(newStock);

    // Update product stock - this should ideally use WHERE current_stock = product.current_stock
    // to detect if stock was modified by another request
    const { data: updatedProduct, error: updateError } = await supabaseAdmin
      .from('products')
      .update({
        current_stock: newStock,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId)
      .eq('user_id', userId)
      .eq('current_stock', product.current_stock) // Optimistic locking
      .select()
      .single();

    if (updateError) {
      if (updateError.code === 'PGRST116') {
        // No rows updated - stock was modified by another request
        throw new ApiError('Stock was modified by another operation. Please retry.', 409);
      }
      throw new ApiError(`Error updating product stock: ${updateError.message}`, 500);
    }

    if (!updatedProduct) {
      throw new ApiError('Stock update failed - concurrent modification detected', 409);
    }

    // Record stock movement
    const { error: movementError } = await supabaseAdmin.from('stock_movements').insert({
      product_id: productId,
      user_id: userId,
      organization_id: organizationId,
      type,
      quantity: Math.floor(type === 'adjustment' ? newStock : quantity),
      reason: reason || null,
      created_at: new Date().toISOString(),
    });

    if (movementError) {
      logger.error('Failed to record stock movement:', movementError);
      // Don't fail the operation, just log the error
    }

    return updatedProduct;
  }

  static async getLowStockProducts(
    userId: string,
    organizationId: string | undefined
  ): Promise<Product[]> {
    let query = supabaseAdmin
      .from('products')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active');

    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }

    const { data, error } = await query;

    if (error) {
      throw new ApiError(`Error fetching low stock products: ${error.message}`, 500);
    }

    // Filter products where current_stock <= reorder_level
    return (data || []).filter(p => p.current_stock <= p.reorder_level);
  }

  static async getStockMovements(
    productId: string,
    userId: string
  ): Promise<StockMovement[]> {
    const { data, error } = await supabaseAdmin
      .from('stock_movements')
      .select('*')
      .eq('product_id', productId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      throw new ApiError(`Error fetching stock movements: ${error.message}`, 500);
    }

    return data || [];
  }
}
