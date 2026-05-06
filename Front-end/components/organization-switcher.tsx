'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Building2, Plus, Loader2, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { useOrganization } from '@/contexts/organization-context'
import { createClient } from '@/lib/supabase/client'

interface Organization {
  id: string
  name: string
  slug: string
  role: string
  isOwner: boolean
  subscriptionPlan: string
  settings?: {
    businessLogo?: string
    businessSlogan?: string
    [key: string]: unknown
  }
}

export const OrganizationSwitcher = React.memo(function OrganizationSwitcher() {
  const router = useRouter()
  const { organizationId, organization, switchOrganization } = useOrganization()
  const [open, setOpen] = useState(false)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSwitching, setIsSwitching] = useState(false)

  // Use organization data from context for current organization branding
  const businessName = organization?.name || 'Zoddy'
  const businessLogo = organization?.settings?.businessLogo || ''
  const businessSlogan = organization?.settings?.businessSlogan || 'Business Tracker'


  // Fetch user's organizations
  useEffect(() => {
    async function fetchOrganizations() {
      try {
        setIsLoading(true)
        const supabase = createClient()

        // Get current user
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          return
        }

        // Fetch organizations where user is a member
        const { data: memberships, error: memberError } = await supabase
          .from('team_members')
          .select(`
            organization_id,
            role,
            organizations!inner (
              id,
              name,
              slug,
              owner_id,
              subscription_plan,
              settings
            )
          `)
          .eq('user_id', user.id)
          .eq('status', 'active')

        if (memberError) {
          return
        }

        // Transform the data to match our interface
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const orgs = (memberships || []).map((membership: any) => ({
          id: membership.organizations.id,
          name: membership.organizations.name,
          slug: membership.organizations.slug || '',
          role: membership.role,
          isOwner: membership.organizations.owner_id === user.id,
          subscriptionPlan: membership.organizations.subscription_plan,
          settings: membership.organizations.settings || {}
        }))

        setOrganizations(orgs)
      } catch (error) {
        console.error('Error fetching organizations:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (open) {
      fetchOrganizations()
    }
  }, [open])

  // Removed unused variable - current org is determined by organizationId prop

  const handleSwitchOrganization = async (newOrgId: string) => {
    if (newOrgId === organizationId) {
      setOpen(false)
      return
    }

    try {
      setIsSwitching(true)

      // Use the context's switchOrganization method
      const success = await switchOrganization(newOrgId)

      if (success) {
        toast.success('Organization switched successfully')
        setOpen(false)

        // Reload the page to refresh all components with new organization context
        window.location.reload()
      } else {
        throw new Error('Failed to switch organization')
      }
    } catch (error) {
      console.error('Error switching organization:', error)
      toast.error('Failed to switch organization')
    } finally {
      setIsSwitching(false)
    }
  }

  const handleCreateOrganization = () => {
    setOpen(false)
    router.push('/organizations/new')
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          aria-label="Select organization"
          className="w-full justify-between hover:!bg-transparent hover:!text-black px-0 py-0 h-auto cursor-pointer group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 focus:!bg-transparent"
          disabled={isSwitching}
          type="button"
          onContextMenu={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          <div className="flex items-center gap-1.5 md:gap-2 flex-1 min-w-0 group-data-[collapsible=icon]:justify-center">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent text-accent-foreground shrink-0 group-data-[collapsible=icon]:mx-auto">
              {businessLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={businessLogo}
                  alt={businessName}
                  className="h-full w-full object-cover rounded-lg"
                />
              ) : (
                <TrendingUp className="h-3.5 w-3.5" />
              )}
            </div>
            <div className="grid flex-1 text-left text-xs leading-tight min-w-0 group-data-[collapsible=icon]:hidden">
              <span className="truncate font-bold font-display">{businessName}</span>
              <span className="truncate text-[10px] text-muted-foreground">{businessSlogan}</span>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[240px]" align="start" sideOffset={5}>
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          <>
            <DropdownMenuLabel>Your Organizations</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {organizations.length === 0 ? (
              <div className="p-2 text-sm text-muted-foreground text-center">
                No organizations found
              </div>
            ) : (
              organizations.map((org) => {
                const orgLogo = org.settings?.businessLogo || ''
                const orgSlogan = org.settings?.businessSlogan || 'Business Tracker'

                return (
                  <DropdownMenuItem
                    key={org.id}
                    onClick={() => handleSwitchOrganization(org.id)}
                    disabled={isSwitching}
                    className="cursor-pointer py-2"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground overflow-hidden shrink-0">
                        {orgLogo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={orgLogo}
                            alt={org.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Building2 className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="truncate font-medium">{org.name}</span>
                        <span className="text-xs text-muted-foreground truncate">
                          {orgSlogan}
                        </span>
                      </div>
                      <Check
                        className={`h-4 w-4 shrink-0 ${
                          org.id === organizationId ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    </div>
                  </DropdownMenuItem>
                )
              })
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleCreateOrganization} className="cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              Create new organization
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
})
