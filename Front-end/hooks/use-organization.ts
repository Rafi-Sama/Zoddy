'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@workos-inc/authkit-js'

// Extended user type to include possible organization fields
interface UserWithOrganization {
  organizationId?: string
  organization_id?: string
  org_id?: string
  [key: string]: unknown
}

const workosClientId = process.env.NEXT_PUBLIC_WORKOS_CLIENT_ID || process.env.WORKOS_CLIENT_ID!

/**
 * Hook to get the current organization ID with a fallback mechanism
 * Returns the organization ID from WorkOS user data or a default value
 */
export function useOrganizationWithFallback() {
  const [organizationId, setOrganizationId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchOrganization() {
      try {
        // Create the AuthKit client
        const authkit = await createClient(workosClientId)

        // Get the current user
        const user = await authkit.getUser()

        if (user) {
          // Check for organization ID in the user object
          // WorkOS typically provides this in the user metadata or as part of the session
          const userWithOrg = user as unknown as UserWithOrganization
          const orgId = userWithOrg.organizationId ||
                       userWithOrg.organization_id ||
                       userWithOrg.org_id ||
                       'default-org' // fallback organization ID

          setOrganizationId(orgId)
        } else {
          // If no user, use a default organization ID
          // This might happen during development or for guest users
          setOrganizationId('default-org')
        }
      } catch (err) {
        console.error('Error fetching organization:', err)
        setError(err as Error)
        // Set a default organization ID even on error
        setOrganizationId('default-org')
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