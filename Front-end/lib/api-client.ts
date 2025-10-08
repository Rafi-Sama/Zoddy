import { createSupabaseClientWithToken } from './supabase'

interface ApiError {
  message: string
  statusCode?: number
  details?: unknown
}

interface ApiResponse<T> {
  data?: T
  error?: ApiError
}

class ApiClient {
  private static instance: ApiClient
  private retryCount = 3
  private retryDelay = 1000

  private constructor() {}

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient()
    }
    return ApiClient.instance
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    retries = this.retryCount
  ): Promise<T> {
    try {
      return await operation()
    } catch (error) {
      if (retries > 0) {
        await this.delay(this.retryDelay)
        return this.executeWithRetry(operation, retries - 1)
      }
      throw error
    }
  }

  async fetchWithAuth<T>(
    table: string,
    accessToken: string,
    options?: {
      select?: string
      filter?: Record<string, unknown>
      orderBy?: { column: string; ascending?: boolean }
      limit?: number
    }
  ): Promise<ApiResponse<T>> {
    try {
      const supabase = createSupabaseClientWithToken(accessToken)

      let query = supabase.from(table).select(options?.select || '*')

      // Apply filters
      if (options?.filter) {
        Object.entries(options.filter).forEach(([key, value]) => {
          query = query.eq(key, value)
        })
      }

      // Apply ordering
      if (options?.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending ?? true
        })
      }

      // Apply limit
      if (options?.limit) {
        query = query.limit(options.limit)
      }

      const { data, error } = await query

      if (error) {
        return {
          error: {
            message: error.message,
            statusCode: 'code' in error && typeof error.code === 'string' ? parseInt(error.code) : 500,
            details: 'details' in error ? error.details : undefined
          }
        }
      }

      return { data: data as T }
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
          statusCode: 500
        }
      }
    }
  }

  async insertWithAuth<T>(
    table: string,
    accessToken: string,
    insertData: Partial<T>
  ): Promise<ApiResponse<T>> {
    try {
      const supabase = createSupabaseClientWithToken(accessToken)

      const result = await this.executeWithRetry(async () =>
        await supabase.from(table).insert(insertData).select().single()
      )

      if (result.error) {
        return {
          error: {
            message: result.error.message,
            statusCode: 'code' in result.error && typeof result.error.code === 'string' ? parseInt(result.error.code) : 500,
            details: 'details' in result.error ? result.error.details : undefined
          }
        }
      }

      return { data: result.data as T }
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : 'Failed to insert data',
          statusCode: 500
        }
      }
    }
  }

  async updateWithAuth<T>(
    table: string,
    accessToken: string,
    id: string | number,
    updateData: Partial<T>
  ): Promise<ApiResponse<T>> {
    try {
      const supabase = createSupabaseClientWithToken(accessToken)

      const result = await this.executeWithRetry(async () =>
        await supabase.from(table).update(updateData).eq('id', id).select().single()
      )

      if (result.error) {
        return {
          error: {
            message: result.error.message,
            statusCode: 'code' in result.error && typeof result.error.code === 'string' ? parseInt(result.error.code) : 500,
            details: 'details' in result.error ? result.error.details : undefined
          }
        }
      }

      return { data: result.data as T }
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : 'Failed to update data',
          statusCode: 500
        }
      }
    }
  }

  async deleteWithAuth(
    table: string,
    accessToken: string,
    id: string | number
  ): Promise<ApiResponse<void>> {
    try {
      const supabase = createSupabaseClientWithToken(accessToken)

      const result = await this.executeWithRetry(async () =>
        await supabase.from(table).delete().eq('id', id)
      )

      if (result.error) {
        return {
          error: {
            message: result.error.message,
            statusCode: 'code' in result.error && typeof result.error.code === 'string' ? parseInt(result.error.code) : 500,
            details: 'details' in result.error ? result.error.details : undefined
          }
        }
      }

      return { data: undefined }
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : 'Failed to delete data',
          statusCode: 500
        }
      }
    }
  }
}

export const apiClient = ApiClient.getInstance()
export type { ApiResponse, ApiError }