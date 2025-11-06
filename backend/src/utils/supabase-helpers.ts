import { createClient } from '@supabase/supabase-js';
import logger from './logger';

/**
 * Creates a Supabase client for a specific user
 * This ensures Row Level Security (RLS) is properly applied
 */
export function createUserClient(accessToken: string) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration missing');
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Validates Supabase configuration
 */
export function validateSupabaseConfig(): boolean {
  const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    logger.error(`Missing Supabase configuration: ${missing.join(', ')}`);
    return false;
  }

  // Validate URL format
  const url = process.env.SUPABASE_URL;
  if (url && !url.match(/^https:\/\/[a-zA-Z0-9-]+\.supabase\.co$/)) {
    logger.warn('SUPABASE_URL format seems incorrect');
  }

  return true;
}

/**
 * Common Supabase error codes
 */
export const SUPABASE_ERRORS = {
  NO_ROWS: 'PGRST116',           // No rows returned
  UNIQUE_VIOLATION: '23505',      // Duplicate key value
  FOREIGN_KEY_VIOLATION: '23503', // Foreign key constraint
  CHECK_VIOLATION: '23514',       // Check constraint violation
  NOT_NULL_VIOLATION: '23502',    // Not null constraint
} as const;

/**
 * Maps Supabase error codes to user-friendly messages
 */
export function mapSupabaseError(error: any): string {
  if (!error?.code) return 'Database operation failed';

  switch (error.code) {
    case SUPABASE_ERRORS.NO_ROWS:
      return 'Record not found';
    case SUPABASE_ERRORS.UNIQUE_VIOLATION:
      return 'A record with this value already exists';
    case SUPABASE_ERRORS.FOREIGN_KEY_VIOLATION:
      return 'Related record not found';
    case SUPABASE_ERRORS.CHECK_VIOLATION:
      return 'Invalid value provided';
    case SUPABASE_ERRORS.NOT_NULL_VIOLATION:
      return 'Required field is missing';
    default:
      return error.message || 'Database operation failed';
  }
}