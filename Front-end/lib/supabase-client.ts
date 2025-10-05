'use client';

import { createClient } from '@supabase/supabase-js';
import { createClient as createAuthKitClient } from '@workos-inc/authkit-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const workosClientId = process.env.NEXT_PUBLIC_WORKOS_CLIENT_ID || process.env.WORKOS_CLIENT_ID!;

// Initialize AuthKit client (it's a Promise, so we await it when needed)
let authkitClientPromise: ReturnType<typeof createAuthKitClient> | null = null;

function getAuthKitClient() {
  if (!authkitClientPromise) {
    authkitClientPromise = createAuthKitClient(workosClientId, {
      // apiHostname is optional, only needed if using a custom domain
      // apiHostname: process.env.NEXT_PUBLIC_WORKOS_AUTH_DOMAIN,
    });
  }
  return authkitClientPromise;
}

// Create Supabase client with WorkOS AuthKit integration (client-side)
// This follows the pattern from WorkOS documentation
export const supabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    accessToken: async () => {
      const authkit = await getAuthKitClient();
      return authkit.getAccessToken();
    },
  },
);

// Alternative: Create a new client instance with fresh token
export async function createSupabaseClientWithAuth() {
  const authkit = await getAuthKitClient();
  const accessToken = await authkit.getAccessToken();

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      persistSession: false,
    },
  });
}
