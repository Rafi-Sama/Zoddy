"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { BillingSection } from "@/components/account/billing-section";
import { SocialPlatformsSection } from "@/components/settings/social-platforms-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Building2,
  Bell,
  Truck,
  Download,
  Upload,
  CreditCard,
  MessageSquare,
  Globe,
  Shield,
  Save,
  ChevronRight,
  Package,
  Smartphone,
  FileText,
  Zap,
  AlertCircle,
  Palette,
  DollarSign,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useData, useMutation } from "@/hooks/use-database-optimized";
import { useOrganization } from "@/contexts/organization-context";
import type { Organization, PaymentMethodSettings } from "@/types/database";

// Navigation items for sidebar
const navigationItems = [
  {
    id: "business",
    label: "Business",
    icon: Building2,
    description: "Company information & Branding",
  },
  {
    id: "billing",
    label: "Billing",
    icon: CreditCard,
    description: "Subscription & invoices",
  },
  {
    id: "preferences",
    label: "Preferences",
    icon: Palette,
    description: "Display & regional",
  },
  {
    id: "payments",
    label: "Payments",
    icon: DollarSign,
    description: "Payment methods",
  },
  {
    id: "delivery",
    label: "Delivery",
    icon: Truck,
    description: "Shipping settings",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    description: "Alert preferences",
  },
  {
    id: "social",
    label: "Social Platforms",
    icon: Smartphone,
    description: "Connect social accounts",
  },
];

interface OrganizationSettings {
  // Business Branding
  businessName?: string;
  businessLogo?: string;
  businessSlogan?: string;

  // Business Info
  businessEmail?: string;
  businessPhone?: string;
  businessAddress?: string;
  businessType?: string;
  website?: string;

  // Preferences
  currency?: string;
  timezone?: string;
  language?: string;
  dateFormat?: string;
  theme?: string;
  compactView?: boolean;
  showStockAlerts?: boolean;
  autoBackup?: boolean;

  // Payment Settings
  paymentMethods?: PaymentMethodSettings;
  defaultPaymentMethod?: string;

  // Delivery Settings
  defaultDeliveryFee?: string;
  freeDeliveryThreshold?: string;
  estimatedDeliveryDays?: string;

  // Notifications
  notifications?: {
    newOrders?: boolean;
    paymentReceived?: boolean;
    lowStock?: boolean;
    customerMessages?: boolean;
  };
}

function SettingsContent() {
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState("business");
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const { organizationId, isLoading: orgLoading } = useOrganization();

  // Fetch organization data
  const { data: organization, loading: orgDataLoading, error: orgError, refetch } = useData<Organization>({
    table: "organizations",
    filter: { id: organizationId },
    single: true,
  });

  // Use mutation hook for optimized cache management
  const { update: updateOrganization } = useMutation<Organization>('organizations');

  const [settings, setSettings] = useState<OrganizationSettings>({
    businessName: "",
    businessLogo: "",
    businessSlogan: "Business Tracker",
    businessEmail: "",
    businessPhone: "",
    businessAddress: "",
    businessType: "fashion",
    website: "",
    currency: "bdt",
    timezone: "dhaka",
    language: "en",
    dateFormat: "dd-mm-yyyy",
    theme: "system",
    compactView: true,
    showStockAlerts: true,
    autoBackup: false,
    paymentMethods: {
      cash: true,
      bkash: false,
      nagad: false,
      rocket: false,
      bank: false,
      card: false,
      upay: false,
      cellfin: false,
    },
    defaultPaymentMethod: "cash",
    defaultDeliveryFee: "60",
    freeDeliveryThreshold: "1000",
    estimatedDeliveryDays: "1-3 business days",
    notifications: {
      newOrders: true,
      paymentReceived: true,
      lowStock: true,
      customerMessages: true,
    },
  });

  const loading = orgLoading || orgDataLoading;

  useEffect(() => {
    const section = searchParams.get("section");
    if (section && navigationItems.some((item) => item.id === section)) {
      setActiveSection(section);
    }
  }, [searchParams]);

  // Load organization settings
  useEffect(() => {
    if (organization) {
      const orgSettings = organization.settings as Record<string, unknown> || {};
      setSettings({
        businessName: organization.name || "",
        businessLogo: (orgSettings.businessLogo as string) || "",
        businessSlogan: (orgSettings.businessSlogan as string) || "Business Tracker",
        businessEmail: (orgSettings.businessEmail as string) || "",
        businessPhone: (orgSettings.businessPhone as string) || "",
        businessAddress: (orgSettings.businessAddress as string) || "",
        businessType: (orgSettings.businessType as string) || "fashion",
        website: (orgSettings.website as string) || "",
        currency: (orgSettings.currency as string) || "bdt",
        timezone: (orgSettings.timezone as string) || "dhaka",
        language: (orgSettings.language as string) || "en",
        dateFormat: (orgSettings.dateFormat as string) || "dd-mm-yyyy",
        theme: (orgSettings.theme as string) || "system",
        compactView: (orgSettings.compactView as boolean) ?? true,
        showStockAlerts: (orgSettings.showStockAlerts as boolean) ?? true,
        autoBackup: (orgSettings.autoBackup as boolean) ?? false,
        paymentMethods: (orgSettings.paymentMethods as PaymentMethodSettings) || {
          cash: true,
          bkash: false,
          nagad: false,
          rocket: false,
          bank: false,
          card: false,
          upay: false,
          cellfin: false,
        },
        defaultPaymentMethod: (orgSettings.defaultPaymentMethod as string) || "cash",
        defaultDeliveryFee: (orgSettings.defaultDeliveryFee as string) || "60",
        freeDeliveryThreshold: (orgSettings.freeDeliveryThreshold as string) || "1000",
        estimatedDeliveryDays: (orgSettings.estimatedDeliveryDays as string) || "1-3 business days",
        notifications: (orgSettings.notifications as OrganizationSettings['notifications']) || {
          newOrders: true,
          paymentReceived: true,
          lowStock: true,
          customerMessages: true,
        },
      });
    }
  }, [organization]);

  const handleSaveChanges = async () => {
    if (!organizationId) return;

    setIsSaving(true);
    try {
      const { businessName, businessLogo, businessSlogan, ...restSettings } = settings;

      // Prepare settings object with all settings
      const dbSettings: OrganizationSettings = {
        businessLogo: businessLogo || "",
        businessSlogan: businessSlogan || "Business Tracker",
        businessType: restSettings.businessType || "fashion",
        businessEmail: restSettings.businessEmail || "",
        businessPhone: restSettings.businessPhone || "",
        businessAddress: restSettings.businessAddress || "",
        website: restSettings.website || "",
        currency: restSettings.currency || "bdt",
        timezone: restSettings.timezone || "dhaka",
        language: restSettings.language || "en",
        dateFormat: restSettings.dateFormat || "dd-mm-yyyy",
        theme: restSettings.theme || "system",
        compactView: restSettings.compactView ?? true,
        showStockAlerts: restSettings.showStockAlerts ?? true,
        autoBackup: restSettings.autoBackup ?? false,
        paymentMethods: restSettings.paymentMethods || {},
        defaultPaymentMethod: restSettings.defaultPaymentMethod || "cash",
        defaultDeliveryFee: restSettings.defaultDeliveryFee || "60",
        freeDeliveryThreshold: restSettings.freeDeliveryThreshold || "1000",
        estimatedDeliveryDays: restSettings.estimatedDeliveryDays || "1-3 business days",
        notifications: restSettings.notifications || {},
      };

      // Update organization using mutation hook for proper cache management
      const updated = await updateOrganization(organizationId!, {
        name: businessName || organization?.name || "",
        settings: dbSettings as Record<string, string | number | boolean | null>,
        updated_at: new Date().toISOString(),
      });

      if (!updated) {
        throw new Error('Failed to update organization settings');
      }

      setHasChanges(false);
      await refetch();

      toast.success("Settings saved successfully");

      // Data is automatically updated via cache invalidation, no reload needed
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuickSave = async (
    setting: string,
    value: string | boolean | number
  ) => {
    setHasChanges(true);
    const displayValue =
      typeof value === "boolean" ? (value ? "enabled" : "disabled") : value;
    toast.success(
      `${setting} ${typeof value === "boolean" ? "" : "set to"} ${displayValue}`
    );
  };

  const updateSetting = (key: keyof OrganizationSettings, value: string | boolean | Record<string, unknown>) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const updateNestedSetting = (parent: keyof OrganizationSettings, key: string, value: string | boolean | number) => {
    setSettings((prev) => ({
      ...prev,
      [parent]: { ...(prev[parent] as Record<string, unknown>), [key]: value },
    }));
    setHasChanges(true);
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    setIsUploadingLogo(true);
    try {
      // Convert to base64 for now - in production, you'd upload to storage
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updateSetting('businessLogo', base64String);
        toast.success('Logo uploaded successfully');
        setIsUploadingLogo(false);
      };
      reader.onerror = () => {
        toast.error('Failed to read image file');
        setIsUploadingLogo(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Failed to upload logo:', error);
      toast.error('Failed to upload logo');
      setIsUploadingLogo(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (orgError) {
      return (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p>Failed to load settings. Please try again.</p>
            </div>
          </CardContent>
        </Card>
      );
    }

    switch (activeSection) {
      case "billing":
        return <BillingSection />;

      case "business":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">Business Branding</h2>
                <p className="text-sm text-muted-foreground">
                  Customize your business appearance
                </p>
              </div>
            </div>

            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <input
                      type="file"
                      id="logo-upload"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center overflow-hidden">
                      {settings.businessLogo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={settings.businessLogo}
                          alt="Business Logo"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Building2 className="h-10 w-10 text-white" />
                      )}
                    </div>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full border-2 border-background"
                      onClick={() => document.getElementById('logo-upload')?.click()}
                      disabled={isUploadingLogo}
                    >
                      {isUploadingLogo ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Upload className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{settings.businessName || "Your Business"}</h3>
                    <p className="text-sm text-muted-foreground">
                      {settings.businessSlogan || "Add your business slogan"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Upload a logo to represent your business
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3 pt-4">
                <CardTitle className="text-sm">Branding Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="businessName">
                      Business Name
                    </Label>
                    <Input
                      id="businessName"
                      value={settings.businessName}
                      onChange={(e) => updateSetting("businessName", e.target.value)}
                      placeholder="Enter your business name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="businessSlogan">
                      Business Slogan
                    </Label>
                    <Input
                      id="businessSlogan"
                      value={settings.businessSlogan}
                      onChange={(e) => updateSetting("businessSlogan", e.target.value)}
                      placeholder="Your catchy business slogan"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="businessType">
                      Business Type
                    </Label>
                    <Select
                      value={settings.businessType}
                      onValueChange={(value) => updateSetting("businessType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fashion">Fashion & Clothing</SelectItem>
                        <SelectItem value="food">Food & Beverages</SelectItem>
                        <SelectItem value="crafts">Handicrafts</SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "preferences":
        return (
          <div className="space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Preferences</h2>
              <p className="text-sm text-muted-foreground">
                Customize your application experience
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-3 pt-4">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Regional Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Currency</Label>
                    <Select
                      value={settings.currency}
                      onValueChange={(value) => {
                        updateSetting("currency", value);
                        handleQuickSave("Currency", value);
                      }}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bdt">BDT (৳) - Taka</SelectItem>
                        <SelectItem value="usd">USD ($) - Dollar</SelectItem>
                        <SelectItem value="eur">EUR (€) - Euro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Date Format</Label>
                    <Select
                      value={settings.dateFormat}
                      onValueChange={(value) => {
                        updateSetting("dateFormat", value);
                        handleQuickSave("Date Format", value);
                      }}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Timezone</Label>
                    <Select
                      value={settings.timezone}
                      onValueChange={(value) => {
                        updateSetting("timezone", value);
                        handleQuickSave("Timezone", value);
                      }}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dhaka">Asia/Dhaka (GMT+6)</SelectItem>
                        <SelectItem value="kolkata">Asia/Kolkata (GMT+5:30)</SelectItem>
                        <SelectItem value="dubai">Asia/Dubai (GMT+4)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Language</Label>
                    <Select
                      value={settings.language}
                      onValueChange={(value) => {
                        updateSetting("language", value);
                        handleQuickSave("Language", value);
                      }}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3 pt-4">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Display Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Theme</Label>
                    <Select
                      value={settings.theme}
                      onValueChange={(value) => {
                        updateSetting("theme", value);
                        handleQuickSave("Theme", value);
                      }}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <Label className="text-sm font-normal">Compact View</Label>
                    <Switch
                      checked={settings.compactView}
                      onCheckedChange={(checked) => {
                        updateSetting("compactView", checked);
                        handleQuickSave("Compact View", checked);
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <Label className="text-sm font-normal">Stock Alerts</Label>
                    <Switch
                      checked={settings.showStockAlerts}
                      onCheckedChange={(checked) => {
                        updateSetting("showStockAlerts", checked);
                        handleQuickSave("Stock Alerts", checked);
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <Label className="text-sm font-normal">Auto Backup</Label>
                    <Switch
                      checked={settings.autoBackup}
                      onCheckedChange={(checked) => {
                        updateSetting("autoBackup", checked);
                        handleQuickSave("Auto Backup", checked);
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "payments":
        return (
          <div className="space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Payment Methods</h2>
              <p className="text-sm text-muted-foreground">
                Configure accepted payment methods
              </p>
            </div>

            <Card>
              <CardContent className="pt-4 space-y-3">
                {[
                  { key: "cash", label: "Cash", desc: "Cash on delivery", icon: DollarSign },
                  { key: "bkash", label: "bKash", desc: "Mobile banking", icon: Smartphone },
                  { key: "nagad", label: "Nagad", desc: "Mobile banking", icon: Smartphone },
                  { key: "rocket", label: "Rocket", desc: "Mobile banking", icon: Smartphone },
                  { key: "bank", label: "Bank Transfer", desc: "Direct transfer", icon: Building2 },
                  { key: "card", label: "Credit/Debit Card", desc: "Card payments", icon: CreditCard },
                  { key: "upay", label: "Upay", desc: "Mobile banking", icon: Smartphone },
                  { key: "cellfin", label: "Cellfin", desc: "Mobile banking", icon: Smartphone },
                ].map((method) => (
                  <div
                    key={method.key}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <method.icon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label className="text-sm cursor-pointer">{method.label}</Label>
                        <p className="text-xs text-muted-foreground">{method.desc}</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.paymentMethods?.[method.key as keyof PaymentMethodSettings] || false}
                      onCheckedChange={(checked) => {
                        updateNestedSetting("paymentMethods", method.key, checked);
                        handleQuickSave(method.label, checked ? "enabled" : "disabled");
                      }}
                    />
                  </div>
                ))}

                <Separator />

                <div className="space-y-1.5">
                  <Label className="text-xs">Default Payment Method</Label>
                  <Select
                    value={settings.defaultPaymentMethod}
                    onValueChange={(value) => {
                      updateSetting("defaultPaymentMethod", value);
                      handleQuickSave("Default payment", value);
                    }}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="bkash">bKash</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "delivery":
        return (
          <div className="space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Delivery Settings</h2>
              <p className="text-sm text-muted-foreground">
                Configure shipping options and fees
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-3 pt-4">
                  <CardTitle className="text-sm">General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Default Delivery Fee (৳)</Label>
                    <Input
                      value={settings.defaultDeliveryFee}
                      onChange={(e) => updateSetting("defaultDeliveryFee", e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Free Delivery Threshold (৳)</Label>
                    <Input
                      value={settings.freeDeliveryThreshold}
                      onChange={(e) => updateSetting("freeDeliveryThreshold", e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Estimated Delivery Time</Label>
                    <Input
                      value={settings.estimatedDeliveryDays}
                      onChange={(e) => updateSetting("estimatedDeliveryDays", e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3 pt-4">
                  <CardTitle className="text-sm">Delivery Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Delivery settings apply to all orders by default.
                  </p>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">
                      <span className="font-medium">Default Fee:</span> ৳{settings.defaultDeliveryFee}
                    </p>
                    <p className="text-sm mt-1">
                      <span className="font-medium">Free Delivery:</span> Orders above ৳{settings.freeDeliveryThreshold}
                    </p>
                    <p className="text-sm mt-1">
                      <span className="font-medium">Delivery Time:</span> {settings.estimatedDeliveryDays}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Notification Preferences</h2>
              <p className="text-sm text-muted-foreground">
                Control how you receive updates
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-3 pt-4">
                  <CardTitle className="text-sm">Business Alerts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { key: "newOrders", label: "New Orders", icon: Package },
                    { key: "paymentReceived", label: "Payment Received", icon: DollarSign },
                    { key: "lowStock", label: "Low Stock Alerts", icon: AlertCircle },
                    { key: "customerMessages", label: "Customer Messages", icon: MessageSquare },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2.5">
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                        <Label className="text-sm font-normal cursor-pointer">
                          {item.label}
                        </Label>
                      </div>
                      <Switch
                        checked={settings.notifications?.[item.key as keyof typeof settings.notifications]}
                        onCheckedChange={(checked) => {
                          updateNestedSetting("notifications", item.key, checked);
                          handleQuickSave(item.label, checked);
                        }}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3 pt-4">
                  <CardTitle className="text-sm">Reports & Updates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { key: "weeklyReports", label: "Weekly Reports", icon: FileText },
                    { key: "marketingReminders", label: "Marketing Tips", icon: Zap },
                    { key: "systemUpdates", label: "System Updates", icon: Download },
                    { key: "securityAlerts", label: "Security Alerts", icon: Shield },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2.5">
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                        <Label className="text-sm font-normal cursor-pointer">
                          {item.label}
                        </Label>
                      </div>
                      <Switch
                        checked={settings.notifications?.[item.key as keyof typeof settings.notifications]}
                        onCheckedChange={(checked) => {
                          updateNestedSetting("notifications", item.key, checked);
                          handleQuickSave(item.label, checked);
                        }}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "social":
        return <SocialPlatformsSection />;

      default:
        return null;
    }
  };

  return (
    <MainLayout breadcrumbs={[{ label: "Settings" }]}>
      <div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-7rem)] gap-6 w-full">
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
                    <div className="text-left">
                      <span className="font-medium hidden sm:block">{item.label}</span>
                      <span className="text-xs hidden lg:block opacity-70">
                        {item.description}
                      </span>
                    </div>
                    {activeSection === item.id && (
                      <ChevronRight className="h-3.5 w-3.5 ml-auto hidden lg:inline" />
                    )}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </aside>

        <main className="flex-1 lg:overflow-y-auto w-full">
          <div className="w-full">
            {renderContent()}

            {hasChanges && (
              <div className="sticky bottom-0 mt-6 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    You have unsaved changes
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setHasChanges(false);
                        refetch();
                      }}
                    >
                      Discard
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveChanges}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-3.5 w-3.5" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </MainLayout>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
