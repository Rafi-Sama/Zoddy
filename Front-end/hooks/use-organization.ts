'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

/**
 * Hook to get the current organization ID with a fallback mechanism
 * Returns the organization ID from Supabase user metadata or a default value
 */
export function useOrganizationWithFallback() {
  const [organizationId, setOrganizationId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchOrganization() {
      try {
        // Create the Supabase client
        const supabase = createClient()

        // Get the current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError) {
          throw userError
        }

        if (user) {
          // Try to get organization from user profile in database
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('organization_id')
            .eq('id', user.id)
            .single()

          if (profileError && profileError.code !== 'PGRST116') {
            console.warn('Error fetching user profile:', profileError)
          }

          // Check for organization ID in the profile or metadata
          const orgId = profile?.organization_id ||
                       user.user_metadata?.organization_id ||
                       user.user_metadata?.org_id

          // Only use fallback in development mode
          if (!orgId && process.env.NODE_ENV === 'development') {
            console.warn('No organization ID found, using development fallback')
            setOrganizationId('default-org')
          } else if (orgId) {
            setOrganizationId(orgId)
          } else {
            throw new Error('No organization ID found for user')
          }
        } else {
          // If no user is logged in
          if (process.env.NODE_ENV === 'development') {
            console.warn('No user found, using development fallback')
            setOrganizationId('default-org')
          } else {
            throw new Error('User not authenticated')
          }
        }
      } catch (err) {
        console.error('Error fetching organization:', err)
        setError(err as Error)
        // Only set default organization ID in development
        if (process.env.NODE_ENV === 'development') {
          setOrganizationId('default-org')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrganization()
  }, [])

  return {
    organizationId,
    isLoading,
    error
  }
}

/**
 * Hook to get the current organization ID
 * Throws if no organization is found
 */
export function useOrganization() {
  const { organizationId, isLoading, error } = useOrganizationWithFallback()

  if (!isLoading && !organizationId) {
    throw new Error('No organization found')
  }

  return {
    organizationId,
    isLoading,
    error
  }
}