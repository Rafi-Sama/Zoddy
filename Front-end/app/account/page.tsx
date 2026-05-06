"use client";

import { useState, useEffect, Suspense, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  User as UserIcon,
  Mail,
  Camera,
  Shield,
  Bell,
  Key,
  Smartphone,
  LogOut,
  Save,
  Edit2,
  ChevronRight,
  Palette,
  FileText,
  HelpCircle,
  MessageSquare,
  Star,
  Zap,
  Activity as ActivityIcon,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useData, useMutation } from "@/hooks/use-database-optimized";
import { User, UserPreferences as DBUserPreferences } from "@/types/database";
import { useOrganization } from "@/contexts/organization-context";
import { createClient } from "@/lib/supabase/client";

// Navigation items for sidebar
const navigationItems = [
  {
    id: "profile",
    label: "Profile",
    icon: UserIcon,
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    id: "security",
    label: "Security",
    icon: Shield,
  },
  {
    id: "preferences",
    label: "Preferences",
    icon: Palette,
  },
  {
    id: "activity",
    label: "Activity",
    icon: ActivityIcon,
  },
  {
    id: "help",
    label: "Help",
    icon: HelpCircle,
  },
];

// Define user preferences interface
interface UserPreferences {
  notifications?: {
    emailAlerts?: boolean;
    pushNotifications?: boolean;
    smsAlerts?: boolean;
    weeklyReport?: boolean;
    monthlyReport?: boolean;
    productUpdates?: boolean;
    marketingEmails?: boolean;
  };
  security?: {
    twoFactor?: boolean;
    sessionTimeout?: string;
    loginAlerts?: boolean;
  };
  display?: {
    language?: string;
    timezone?: string;
    dateFormat?: string;
    currency?: string;
  };
  bio?: string;
  company?: string;
  website?: string;
  location?: string;
}

function AccountContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user: orgUser } = useOrganization();
  const supabase = createClient(); // Only needed for signOut action
  const [activeSection, setActiveSection] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // OPTIMIZED: Use organization context instead of direct auth.getSession() call
  const userId = orgUser?.id || null;
  const { isLoading: orgLoading } = useOrganization();

  // Redirect to auth if no user (but wait for loading to finish)
  useEffect(() => {
    if (!orgLoading && !orgUser) {
      router.push("/auth");
    }
  }, [orgUser, orgLoading, router]);

  useEffect(() => {
    const section = searchParams.get("section");
    if (section && navigationItems.some((item) => item.id === section)) {
      setActiveSection(section);
    }
  }, [searchParams]);

  // Fetch user profile data from database
  const { data: userData, loading: userLoading, refetch: refetchUser } = useData<User>({
    table: "profiles",
    filter: userId ? { id: userId } : undefined,
    single: true,
  });

  // Initialize mutation hooks
  const { update: updateUser } = useMutation<User>("profiles");

  // Form state - initialized from database
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    company: "",
    role: "",
    website: "",
    location: "",
    timezone: "",
    language: "",
    avatar: "",
  });

  // Update profile state when userData loads
  useEffect(() => {
    if (userData) {
      const prefs = (userData.preferences as UserPreferences) || {};
      setProfile({
        firstName: userData.first_name || "",
        lastName: userData.last_name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        bio: (prefs as UserPreferences).bio || "",
        company: (prefs as UserPreferences).company || "",
        role: userData.role || "member",
        website: (prefs as UserPreferences).website || "",
        location: (prefs as UserPreferences).location || "",
        timezone: prefs.display?.timezone || "UTC",
        language: prefs.display?.language || "en",
        avatar: userData.profile_picture_url || "",
      });

      // Set notifications from preferences
      if (prefs.notifications) {
        setNotifications({
          emailAlerts: prefs.notifications.emailAlerts ?? true,
          pushNotifications: prefs.notifications.pushNotifications ?? true,
          smsAlerts: prefs.notifications.smsAlerts ?? false,
          weeklyReport: prefs.notifications.weeklyReport ?? true,
          monthlyReport: prefs.notifications.monthlyReport ?? true,
          productUpdates: prefs.notifications.productUpdates ?? false,
          marketingEmails: prefs.notifications.marketingEmails ?? false,
        });
      }

      // Set security from preferences
      if (prefs.security) {
        setSecurity({
          twoFactor: prefs.security.twoFactor ?? false,
          sessionTimeout: prefs.security.sessionTimeout ?? "30",
          loginAlerts: prefs.security.loginAlerts ?? true,
        });
      }

      // Set display preferences
      if (prefs.display) {
        setDisplayPrefs({
          language: prefs.display.language ?? "en",
          timezone: prefs.display.timezone ?? "UTC",
          dateFormat: prefs.display.dateFormat ?? "mm-dd-yyyy",
          currency: prefs.display.currency ?? "usd",
        });
      }
    }
  }, [userData]);

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: true,
    smsAlerts: false,
    weeklyReport: true,
    monthlyReport: true,
    productUpdates: false,
    marketingEmails: false,
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: "30",
    loginAlerts: true,
  });

  const [displayPrefs, setDisplayPrefs] = useState({
    language: "en",
    timezone: "UTC",
    dateFormat: "mm-dd-yyyy",
    currency: "usd",
  });

  const handleSaveProfile = useCallback(async () => {
    if (!userId || !userData) return;

    setIsSaving(true);
    try {
      // Prepare updated preferences object
      const currentPrefs = (userData.preferences as UserPreferences) || {};
      const updatedPreferences: UserPreferences = {
        ...currentPrefs,
        notifications,
        security,
        display: displayPrefs,
        bio: profile.bio,
        company: profile.company,
        website: profile.website,
        location: profile.location,
      };

      // Update user profile in database
      await updateUser(userId, {
        first_name: profile.firstName,
        last_name: profile.lastName,
        phone: profile.phone,
        profile_picture_url: profile.avatar,
        preferences: updatedPreferences as DBUserPreferences,
      });

      await refetchUser();
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  }, [userId, userData, profile, notifications, security, displayPrefs, updateUser, refetchUser]);

  const handleQuickSave = useCallback(
    async (field: string) => {
      if (!userId || !userData) return;

      try {
        const currentPrefs = (userData.preferences as UserPreferences) || {};
        const updatedPreferences: UserPreferences = {
          ...currentPrefs,
          notifications,
          security,
          display: displayPrefs,
        };

        await updateUser(userId, {
          preferences: updatedPreferences as DBUserPreferences,
        });

        toast.success(`${field} updated successfully`);
      } catch (error) {
        console.error("Error saving preference:", error);
        toast.error(`Failed to update ${field}`);
      }
    },
    [userId, userData, notifications, security, displayPrefs, updateUser]
  );

  const handleSignOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      router.push("/auth");
      toast.success("Signed out successfully");
    } catch {
      toast.error("Failed to sign out");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const renderContent = useMemo(() => {
    const ContentRenderer = () => {
      // Show loading state
      if (orgLoading || userLoading || !userData) {
        return (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        );
      }

      switch (activeSection) {
        case "profile":
          return (
            <div className="space-y-4">
              {/* Compact Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Profile Settings</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your personal and business information
                  </p>
                </div>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    isEditing ? handleSaveProfile() : setIsEditing(true)
                  }
                  disabled={isSaving}
                >
                  {isEditing ? (
                    <>
                      {isSaving ? (
                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Save className="mr-1.5 h-3.5 w-3.5" />
                      )}
                      {isSaving ? "Saving..." : "Save"}
                    </>
                  ) : (
                    <>
                      <Edit2 className="mr-1.5 h-3.5 w-3.5" />
                      Edit
                    </>
                  )}
                </Button>
              </div>

              {/* Avatar and Basic Info Card */}
              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={profile.avatar} />
                        <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-white">
                          {profile.firstName[0]}
                          {profile.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-2 border-background"
                      >
                        <Camera className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {profile.firstName} {profile.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {profile.role} at {profile.company}
                      </p>
                      <div className="flex gap-2 mt-1">
                        {userData.email_verified && (
                          <Badge variant="secondary" className="text-xs h-5">
                            <Mail className="mr-1 h-2.5 w-2.5" />
                            Verified
                          </Badge>
                        )}
                        {security.twoFactor && (
                          <Badge variant="secondary" className="text-xs h-5">
                            <Shield className="mr-1 h-2.5 w-2.5" />
                            2FA
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* All Information in One Card */}
              <Card>
                <CardHeader className="pb-3 pt-4">
                  <CardTitle className="text-sm">Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Personal Info Grid */}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="firstName" className="text-xs">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        value={profile.firstName}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            firstName: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="lastName" className="text-xs">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        value={profile.lastName}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            lastName: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Business Info Grid */}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="location" className="text-xs">
                        Location
                      </Label>
                      <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="company" className="text-xs">
                        Company
                      </Label>
                      <Input
                        id="company"
                        value={profile.company}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            company: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="role" className="text-xs">
                        Role
                      </Label>
                      <Input
                        id="role"
                        value={profile.role}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            role: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="website" className="text-xs">
                        Website
                      </Label>
                      <Input
                        id="website"
                        value={profile.website}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            website: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="bio" className="text-xs">
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) =>
                        setProfile((prev) => ({ ...prev, bio: e.target.value }))
                      }
                      disabled={!isEditing}
                      rows={2}
                      className="text-sm resize-none"
                    />
                  </div>
                </CardContent>
              </Card>

              {isEditing && (
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save All Changes"}
                  </Button>
                </div>
              )}
            </div>
          );

        case "notifications":
          return (
            <div className="space-y-4">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">
                  Notification Preferences
                </h2>
                <p className="text-sm text-muted-foreground">
                  Control how you receive updates
                </p>
              </div>

              <Card>
                <CardContent className="pt-4 space-y-3">
                  {[
                    {
                      key: "emailAlerts",
                      label: "Email Notifications",
                      icon: Mail,
                    },
                    {
                      key: "pushNotifications",
                      label: "Push Notifications",
                      icon: Bell,
                    },
                    {
                      key: "smsAlerts",
                      label: "SMS Alerts",
                      icon: MessageSquare,
                    },
                    {
                      key: "weeklyReport",
                      label: "Weekly Reports",
                      icon: FileText,
                    },
                    {
                      key: "monthlyReport",
                      label: "Monthly Reports",
                      icon: FileText,
                    },
                    {
                      key: "productUpdates",
                      label: "Product Updates",
                      icon: Zap,
                    },
                    {
                      key: "marketingEmails",
                      label: "Marketing Emails",
                      icon: Star,
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between py-1.5"
                    >
                      <div className="flex items-center gap-2.5">
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                        <Label className="text-sm font-normal cursor-pointer">
                          {item.label}
                        </Label>
                      </div>
                      <Switch
                        checked={
                          notifications[item.key as keyof typeof notifications]
                        }
                        onCheckedChange={(checked) => {
                          setNotifications((prev) => ({
                            ...prev,
                            [item.key]: checked,
                          }));
                          handleQuickSave(item.label);
                        }}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          );

        case "security":
          return (
            <div className="space-y-4">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Security Settings</h2>
                <p className="text-sm text-muted-foreground">
                  Protect your account
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                <Card>
                  <CardHeader className="pb-3 pt-4">
                    <CardTitle className="text-sm">Authentication</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-normal">
                        Two-Factor Auth
                      </Label>
                      <Switch
                        checked={security.twoFactor}
                        onCheckedChange={(checked) => {
                          setSecurity((prev) => ({
                            ...prev,
                            twoFactor: checked,
                          }));
                          handleQuickSave("2FA");
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-normal">
                        Login Alerts
                      </Label>
                      <Switch
                        checked={security.loginAlerts}
                        onCheckedChange={(checked) => {
                          setSecurity((prev) => ({
                            ...prev,
                            loginAlerts: checked,
                          }));
                          handleQuickSave("Login Alerts");
                        }}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Session Timeout</Label>
                      <Select
                        value={security.sessionTimeout}
                        onValueChange={(value) => {
                          setSecurity((prev) => ({
                            ...prev,
                            sessionTimeout: value,
                          }));
                          handleQuickSave("Session Timeout");
                        }}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3 pt-4">
                    <CardTitle className="text-sm">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start h-8"
                    >
                      <Key className="mr-2 h-3.5 w-3.5" />
                      Change Password
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start h-8"
                    >
                      <Smartphone className="mr-2 h-3.5 w-3.5" />
                      Manage Devices
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start h-8"
                    >
                      <ActivityIcon className="mr-2 h-3.5 w-3.5" />
                      View Security Log
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          );

        case "preferences":
          return (
            <div className="space-y-4">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Preferences</h2>
                <p className="text-sm text-muted-foreground">
                  Customize your experience
                </p>
              </div>

              <Card>
                <CardHeader className="pb-3 pt-4">
                  <CardTitle className="text-sm">Display Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Language</Label>
                      <Select
                        value={displayPrefs.language}
                        onValueChange={(value) => {
                          setDisplayPrefs((prev) => ({ ...prev, language: value }));
                          handleQuickSave("Language");
                        }}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="bn">Bengali</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Timezone</Label>
                      <Select
                        value={displayPrefs.timezone}
                        onValueChange={(value) => {
                          setDisplayPrefs((prev) => ({ ...prev, timezone: value }));
                          handleQuickSave("Timezone");
                        }}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="Asia/Dhaka">Asia/Dhaka</SelectItem>
                          <SelectItem value="PST">PST</SelectItem>
                          <SelectItem value="EST">EST</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Date Format</Label>
                      <Select
                        value={displayPrefs.dateFormat}
                        onValueChange={(value) => {
                          setDisplayPrefs((prev) => ({ ...prev, dateFormat: value }));
                          handleQuickSave("Date Format");
                        }}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                          <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                          <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Currency</Label>
                      <Select
                        value={displayPrefs.currency}
                        onValueChange={(value) => {
                          setDisplayPrefs((prev) => ({ ...prev, currency: value }));
                          handleQuickSave("Currency");
                        }}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bdt">BDT (৳)</SelectItem>
                          <SelectItem value="usd">USD ($)</SelectItem>
                          <SelectItem value="eur">EUR (€)</SelectItem>
                          <SelectItem value="gbp">GBP (£)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );

        case "activity":
          return (
            <div className="space-y-4">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Account Activity</h2>
                <p className="text-sm text-muted-foreground">
                  Monitor access and sessions
                </p>
              </div>

              <Card>
                <CardHeader className="pb-3 pt-4">
                  <CardTitle className="text-sm">Current Session</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-3.5 w-3.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Current Browser</p>
                        <p className="text-xs text-muted-foreground">
                          {userData.email}
                        </p>
                      </div>
                    </div>
                    <Badge className="text-xs h-5">Active</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Session details are managed by Supabase Auth. For security,
                    you can sign out to revoke this session.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3 pt-4">
                  <CardTitle className="text-sm">Account Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 py-1.5">
                    <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm">Account Created</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(userData.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 py-1.5">
                    <ActivityIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm">Last Updated</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(userData.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200 dark:border-orange-900/50">
                <CardContent className="pt-4 pb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-orange-600 hover:text-orange-700 dark:text-orange-400 h-8"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-3.5 w-3.5" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </div>
          );

        case "help":
          return (
            <div className="space-y-4">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Help & Support</h2>
                <p className="text-sm text-muted-foreground">
                  Get help and find answers
                </p>
              </div>

              <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {[
                  { title: "Docs", icon: FileText, color: "text-blue-600" },
                  {
                    title: "Support",
                    icon: MessageSquare,
                    color: "text-green-600",
                  },
                  { title: "FAQs", icon: HelpCircle, color: "text-purple-600" },
                  { title: "Updates", icon: Zap, color: "text-orange-600" },
                ].map((item, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer hover:shadow-md transition-all"
                  >
                    <CardContent className="pt-4 pb-4 text-center">
                      <item.icon
                        className={`h-8 w-8 mb-2 mx-auto ${item.color}`}
                      />
                      <p className="text-sm font-medium">{item.title}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-sm font-medium">
                        All systems operational
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      99.99% Uptime
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          );

        default:
          return null;
      }
    };
    return ContentRenderer;
  }, [
    activeSection,
    isEditing,
    isSaving,
    profile,
    notifications,
    security,
    displayPrefs,
    userData,
    userLoading,
    orgLoading,
    handleSaveProfile,
    handleQuickSave,
    handleSignOut,
  ]);

  return (
    <MainLayout breadcrumbs={[{ label: "Account Settings" }]}>
      <div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-7rem)] gap-6 w-full">
        {/* Fixed Sidebar - Better width for readability - Hidden on mobile, shows as tabs */}
        <aside className="lg:w-64 lg:shrink-0 w-full">
          <Card className="lg:h-full">
            <CardHeader className="pb-3 pt-4">
              <CardTitle className="text-base">Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <nav className="flex lg:flex-col overflow-x-auto lg:space-y-1 gap-2 lg:gap-0 pb-2 lg:pb-0">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                      "flex items-center gap-2 lg:gap-3 px-3 py-2.5 text-sm rounded-md transition-colors whitespace-nowrap lg:w-full",
                      activeSection === item.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="text-left font-medium hidden sm:inline">
                      {item.label}
                    </span>
                    {activeSection === item.id && (
                      <ChevronRight className="h-3.5 w-3.5 ml-auto hidden lg:inline" />
                    )}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </aside>

        {/* Full Width Content Area */}
        <main className="flex-1 lg:overflow-y-auto w-full">
          <div className="w-full">{renderContent()}</div>
        </main>
      </div>
    </MainLayout>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccountContent />
    </Suspense>
  );
}
