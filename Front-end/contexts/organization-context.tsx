'use client'

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

interface Organization {
  id: string
  name: string
  slug: string | null
  owner_id: string | null
  subscription_plan: string
  subscription_status: string
  settings: {
    businessLogo?: string
    businessSlogan?: string
    brandColors?: {
      primary?: string
      secondary?: string
      accent?: string
    }
    [key: string]: string | Record<string, string> | undefined
  }
  created_at: string
  updated_at: string
}

interface OrganizationContextType {
  organizationId: string | null
  organization: Organization | null
  user: User | null
  isLoading: boolean
  error: Error | null
  refreshOrganization: () => Promise<void>
  switchOrganization: (orgId: string) => Promise<boolean>
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined)

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const [organizationId, setOrganizationId] = useState<string | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  const fetchOrganization = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        console.error('Session error:', sessionError)
        setError(sessionError)
        setIsLoading(false)
        return
      }

      if (!session) {
        // No session - user is not logged in yet (expected on login page)
        // Don't set a fallback organization ID
        // User needs to complete onboarding first
        setOrganizationId(null)
        setOrganization(null)
        setUser(null)
        setIsLoading(false)
        return
      }

      setUser(session.user)

      // Check if organization_id is already in the JWT metadata
      const metadataOrgId = session.user.user_metadata?.organization_id ||
                           session.user.user_metadata?.org_id

      if (metadataOrgId) {
        setOrganizationId(metadataOrgId)
        // Cache it
        sessionStorage.setItem(`org_${session.user.id}`, metadataOrgId)

        // Fetch organization details
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', metadataOrgId)
          .single()

        if (!orgError && orgData) {
          setOrganization(orgData)
        }
        setIsLoading(false)
        return
      }

      // Check sessionStorage cache first
      const cachedOrgId = sessionStorage.getItem(`org_${session.user.id}`)
      if (cachedOrgId) {
        setOrganizationId(cachedOrgId)

        // Fetch organization details
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', cachedOrgId)
          .single()

        if (!orgError && orgData) {
          setOrganization(orgData)
        }
        setIsLoading(false)
        return
      }

      // Only query database if not in metadata or cache
      // Use a timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database query timeout')), 5000)
      )

      const queryPromise = supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', session.user.id)
        .maybeSingle() // Use maybeSingle instead of single to avoid 406 errors

      try {
        const result = await Promise.race([
          queryPromise,
          timeoutPromise
        ])
        const { data: userData, error: userError } = result as { data: { organization_id: string } | null; error: { code?: string; message?: string; details?: string; hint?: string } | null }

        if (userError) {
          // PGRST116 = Row not found (expected for new users)
          if (userError.code === 'PGRST116') {
            // User profile doesn't exist yet - onboarding needed
            setOrganizationId(null)
            setIsLoading(false)
            return
          }

          // Log other errors for debugging but don't throw
          console.error('Error fetching user organization:', {
            code: userError.code,
            message: userError.message,
            details: userError.details,
            hint: userError.hint
          })
          setOrganizationId(null)
          setIsLoading(false)
          return
        }

        if (userData?.organization_id) {
          setOrganizationId(userData.organization_id)
          // Cache it
          sessionStorage.setItem(`org_${session.user.id}`, userData.organization_id)

          // Fetch organization details
          const { data: orgData, error: orgError } = await supabase
            .from('organizations')
            .select('*')
            .eq('id', userData.organization_id)
            .single()

          if (!orgError && orgData) {
            setOrganization(orgData)
          }
        } else {
          // User hasn't completed onboarding yet (expected for new users)
          setOrganizationId(null)
          setOrganization(null)
        }
      } catch (timeoutError) {
        console.error('Database query timed out:', timeoutError)
        // Don't set a fallback - user needs to complete onboarding
        setOrganizationId(null)
      }
    } catch (err) {
      console.error('Error in fetchOrganization:', err)
      setError(err as Error)
      // Don't set a fallback - user needs to complete onboarding
      setOrganizationId(null)
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchOrganization()

    // Listen for auth state changes
    // FIXED: Only refetch on SIGNED_IN event to prevent duplicate fetches
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user)
        fetchOrganization()
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setOrganizationId(null)
        setOrganization(null)
        setIsLoading(false)
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        // Just update user, no need to refetch organization
        setUser(session.user)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchOrganization, supabase])

  const refreshOrganization = useCallback(async () => {
    await fetchOrganization()
  }, [fetchOrganization])

  const switchOrganization = useCallback(async (newOrgId: string): Promise<boolean> => {
    try {
      // Get the current session to obtain the access token
      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.access_token) {
        console.error('No active session found')
        return false
      }

      // Call the backend API to switch organization
      const backendUrl = process.env.NEXT_PUBLIC_AI_BACKEND_URL || 'http://localhost:5000'
      const response = await fetch(`${backendUrl}/api/v1/organizations/switch`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ organizationId: newOrgId }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Update local state
        setOrganizationId(newOrgId)

        // Fetch new organization details
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', newOrgId)
          .single()

        if (!orgError && orgData) {
          setOrganization(orgData)
        }

        // Update cache
        if (user) {
          sessionStorage.setItem(`org_${user.id}`, newOrgId)
        }

        return true
      } else {
        console.error('Failed to switch organization:', data.message)
        return false
      }
    } catch (error) {
      console.error('Error switching organization:', error)
      return false
    }
  }, [supabase, user])

  // FIXED: Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      organizationId,
      organization,
      user,
      isLoading,
      error,
      refreshOrganization,
      switchOrganization
    }),
    [organizationId, organization, user, isLoading, error, refreshOrganization, switchOrganization]
  )

  return (
    <OrganizationContext.Provider value={contextValue}>
      {children}
    </OrganizationContext.Provider>
  )
}

export function useOrganization() {
  const context = useContext(OrganizationContext)
  if (!context) {
    throw new Error('useOrganization must be used within OrganizationProvider')
  }
  return context
}