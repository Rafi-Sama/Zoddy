'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Building2, Loader2, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useOrganization } from '@/contexts/organization-context'

export default function NewOrganizationPage() {
  const router = useRouter()
  const { refreshOrganization } = useOrganization()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name) {
      toast.error('Organization name is required')
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()

      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error('User not authenticated')
      }

      // Generate a unique slug
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        + '-' + Math.random().toString(36).substr(2, 6)

      // Start a transaction by creating the organization first
      const { data: organization, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: formData.name,
          slug: slug,
          owner_id: user.id,
          subscription_plan: 'free',
          subscription_status: 'active',
          settings: {
            businessLogo: '',
            businessSlogan: 'Business Tracker'
          }
        })
        .select()
        .single()

      if (orgError) {
        console.error('Organization creation error:', orgError);
        // Check for specific error types
        if (orgError.code === '42501') {
          throw new Error('Permission denied. Please ensure you are logged in and have the necessary permissions.')
        }
        throw new Error(orgError.message || 'Failed to create organization')
      }

      // Add the user as an owner in team_members
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          organization_id: organization.id,
          user_id: user.id,
          role: 'owner',
          status: 'active'
        })

      if (memberError) {
        console.error('Team member creation error:', memberError);
        // Try to clean up the organization if member creation fails
        await supabase.from('organizations').delete().eq('id', organization.id)

        if (memberError.code === '42501') {
          throw new Error('Permission denied when adding you as organization owner.')
        }
        throw new Error(memberError.message || 'Failed to add user to organization')
      }

      // Update the user's profile with the new organization ID
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          organization_id: organization.id,
          updated_at: new Date().toISOString()
        })

      if (profileError) {
        console.error('Profile update error:', profileError);
        // Don't fail the whole operation if profile update fails
        // The user can still access the organization via team_members
      }

      // Clear the organization cache to force a refresh
      sessionStorage.removeItem(`org_${user.id}`)

      // Refresh the organization context
      await refreshOrganization()

      toast.success('Organization created successfully')
      router.push('/dashboard')
    } catch (error) {
      console.error('Error creating organization:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create organization. Please try again.'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="inline-flex p-3 bg-primary/10 rounded-full mb-4 mx-auto">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Create New Organization</CardTitle>
            <CardDescription>
              Set up a new business or company workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Organization Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Acme Corporation"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Choose a name for your new business or company workspace
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Building2 className="h-4 w-4 mr-2" />
                    Create Organization
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
