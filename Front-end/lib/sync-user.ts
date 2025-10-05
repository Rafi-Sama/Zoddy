import { createClient } from '@supabase/supabase-js';
import { User } from '@workos-inc/node';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Syncs a WorkOS user to Supabase database
 * This creates or updates a user record in Supabase based on WorkOS user data
 */
export async function syncWorkOSUserToSupabase(workosUser: User) {
  // Create Supabase client with service role key (bypasses RLS)
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const userData = {
    id: workosUser.id,
    email: workosUser.email,
    first_name: workosUser.firstName,
    last_name: workosUser.lastName,
    email_verified: workosUser.emailVerified,
    profile_picture_url: workosUser.profilePictureUrl,
    updated_at: new Date().toISOString(),
  };

  // First, check if user exists by ID or email
  const { data: existingUsers } = await supabase
    .from('users')
    .select('id')
    .or(`id.eq.${workosUser.id},email.eq.${workosUser.email}`);

  if (existingUsers && existingUsers.length > 0) {
    // User exists - update by ID
    const { data, error } = await supabase
      .from('users')
      .update({
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email_verified: userData.email_verified,
        profile_picture_url: userData.profile_picture_url,
        updated_at: userData.updated_at,
      })
      .eq('id', workosUser.id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating user in Supabase:', error);
      throw error;
    }

    return data;
  } else {
    // User doesn't exist - insert new
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error inserting user in Supabase:', error);
      throw error;
    }

    return data;
  }
}
