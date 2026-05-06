"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  CheckCircle2,
  XCircle,
  Loader2,
  Send,
  Link as LinkIcon,
  Unlink,
  Phone,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

// Platform connection status interface
interface PlatformStatus {
  whatsapp: {
    linked: boolean;
    phone?: string | null;
  };
  facebook: {
    linked: boolean;
    scopedId?: string | null;
  };
  instagram: {
    linked: boolean;
    scopedId?: string | null;
  };
  telegram: {
    linked: boolean;
    userId?: number | null;
    username?: string | null;
  };
  linkedAt?: string | null;
  status?: string | null;
}

export function SocialPlatformsSection() {
  // Backend API URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_AI_BACKEND_URL || 'http://localhost:5000';

  // Supabase client
  const supabase = createClient();

  const [platformStatus, setPlatformStatus] = useState<PlatformStatus | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to get access token
  const getAccessToken = async (): Promise<string | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  };

  // WhatsApp linking state
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [whatsappOTP, setWhatsappOTP] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [verifyingOTP, setVerifyingOTP] = useState(false);

  // Facebook linking state
  const [facebookId, setFacebookId] = useState("");
  const [linkingFacebook, setLinkingFacebook] = useState(false);

  // Instagram linking state
  const [instagramId, setInstagramId] = useState("");
  const [linkingInstagram, setLinkingInstagram] = useState(false);

  // Telegram linking state
  const [telegramUserId, setTelegramUserId] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");
  const [linkingTelegram, setLinkingTelegram] = useState(false);

  // Fetch platform status
  useEffect(() => {
    fetchPlatformStatus();
  }, []);

  const fetchPlatformStatus = async () => {
    try {
      setLoading(true);
      const token = await getAccessToken();

      if (!token) {
        toast.error("Not authenticated. Please sign in.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/social/status`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch platform status");
      }

      const data = await response.json();
      setPlatformStatus(data.data);
    } catch (error) {
      console.error("Error fetching platform status:", error);
      toast.error("Failed to load platform status");
    } finally {
      setLoading(false);
    }
  };

  // WhatsApp OTP request
  const handleRequestOTP = async () => {
    if (!whatsappPhone) {
      toast.error("Please enter your phone number");
      return;
    }

    setSendingOTP(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        toast.error("Not authenticated. Please sign in.");
        setSendingOTP(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/social/whatsapp/request-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ phone: whatsappPhone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      setOtpSent(true);
      toast.success("OTP sent to your WhatsApp! Check your messages.");
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send OTP");
    } finally {
      setSendingOTP(false);
    }
  };

  // WhatsApp OTP verification
  const handleVerifyOTP = async () => {
    if (!whatsappOTP) {
      toast.error("Please enter the OTP");
      return;
    }

    setVerifyingOTP(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        toast.error("Not authenticated. Please sign in.");
        setVerifyingOTP(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/social/whatsapp/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          phone: whatsappPhone,
          otp: whatsappOTP,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify OTP");
      }

      toast.success("WhatsApp linked successfully!");
      setWhatsappPhone("");
      setWhatsappOTP("");
      setOtpSent(false);
      await fetchPlatformStatus();
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error(error instanceof Error ? error.message :"Invalid OTP. Please try again.");
    } finally {
      setVerifyingOTP(false);
    }
  };

  // Facebook linking
  const handleLinkFacebook = async () => {
    if (!facebookId) {
      toast.error("Please enter your Facebook Page-Scoped ID");
      return;
    }

    setLinkingFacebook(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        toast.error("Not authenticated. Please sign in.");
        setLinkingFacebook(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/social/facebook/link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ pageScopedId: facebookId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to link Facebook");
      }

      toast.success("Facebook linked successfully!");
      setFacebookId("");
      await fetchPlatformStatus();
    } catch (error) {
      console.error("Error linking Facebook:", error);
      toast.error(error instanceof Error ? error.message :"Failed to link Facebook");
    } finally {
      setLinkingFacebook(false);
    }
  };

  // Instagram linking
  const handleLinkInstagram = async () => {
    if (!instagramId) {
      toast.error("Please enter your Instagram Scoped ID");
      return;
    }

    setLinkingInstagram(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        toast.error("Not authenticated. Please sign in.");
        setLinkingInstagram(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/social/instagram/link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ scopedId: instagramId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to link Instagram");
      }

      toast.success("Instagram linked successfully!");
      setInstagramId("");
      await fetchPlatformStatus();
    } catch (error) {
      console.error("Error linking Instagram:", error);
      toast.error(error instanceof Error ? error.message :"Failed to link Instagram");
    } finally {
      setLinkingInstagram(false);
    }
  };

  // Telegram linking
  const handleLinkTelegram = async () => {
    if (!telegramUserId) {
      toast.error("Please enter your Telegram User ID");
      return;
    }

    setLinkingTelegram(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        toast.error("Not authenticated. Please sign in.");
        setLinkingTelegram(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/social/telegram/link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          telegramUserId: telegramUserId,
          username: telegramUsername || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to link Telegram");
      }

      toast.success("Telegram linked successfully!");
      setTelegramUserId("");
      setTelegramUsername("");
      await fetchPlatformStatus();
    } catch (error) {
      console.error("Error linking Telegram:", error);
      toast.error(error instanceof Error ? error.message :"Failed to link Telegram");
    } finally {
      setLinkingTelegram(false);
    }
  };

  // Unlink platform
  const handleUnlink = async (platform: string) => {
    try {
      const token = await getAccessToken();
      if (!token) {
        toast.error("Not authenticated. Please sign in.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/social/${platform}/unlink`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to unlink ${platform}`);
      }

      toast.success(`${platform} unlinked successfully!`);
      await fetchPlatformStatus();
    } catch (error) {
      console.error(`Error unlinking ${platform}:`, error);
      toast.error(error instanceof Error ? error.message :`Failed to unlink ${platform}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Social Platforms</h2>
        <p className="text-sm text-muted-foreground">
          Connect your social media accounts to receive orders automatically
        </p>
      </div>

      {/* WhatsApp */}
      <Card>
        <CardHeader className="pb-3 pt-4">
          <CardTitle className="text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-green-600" />
              WhatsApp Business
            </div>
            {platformStatus?.whatsapp.linked ? (
              <Badge variant="default" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Connected
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1">
                <XCircle className="h-3 w-3" />
                Not Connected
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {platformStatus?.whatsapp.linked ? (
            <div className="space-y-3">
              <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      Linked Phone Number
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                      {platformStatus.whatsapp.phone || "Hidden"}
                    </p>
                  </div>
                  <Phone className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleUnlink("whatsapp")}
              >
                <Unlink className="h-3.5 w-3.5 mr-2" />
                Unlink WhatsApp
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="whatsappPhone" className="text-xs">
                  Phone Number (Bangladesh format)
                </Label>
                <Input
                  id="whatsappPhone"
                  placeholder="01711123456"
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  className="h-8 text-sm"
                  disabled={otpSent}
                />
              </div>

              {otpSent && (
                <div className="space-y-1.5">
                  <Label htmlFor="whatsappOTP" className="text-xs">
                    Enter OTP (sent to WhatsApp)
                  </Label>
                  <Input
                    id="whatsappOTP"
                    placeholder="123456"
                    value={whatsappOTP}
                    onChange={(e) => setWhatsappOTP(e.target.value)}
                    className="h-8 text-sm"
                    maxLength={6}
                  />
                </div>
              )}

              <div className="flex gap-2">
                {!otpSent ? (
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={handleRequestOTP}
                    disabled={sendingOTP || !whatsappPhone}
                  >
                    {sendingOTP ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5 mr-2" />
                        Send OTP
                      </>
                    )}
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setOtpSent(false);
                        setWhatsappOTP("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={handleVerifyOTP}
                      disabled={verifyingOTP || !whatsappOTP}
                    >
                      {verifyingOTP ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <LinkIcon className="h-3.5 w-3.5 mr-2" />
                          Verify & Link
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>

              <div className="p-2 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded text-xs text-blue-900 dark:text-blue-100">
                <AlertCircle className="h-3 w-3 inline mr-1" />
                You&apos;ll receive an OTP on WhatsApp to verify your number
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Facebook Messenger */}
      <Card>
        <CardHeader className="pb-3 pt-4">
          <CardTitle className="text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-600" />
              Facebook Messenger
            </div>
            {platformStatus?.facebook.linked ? (
              <Badge variant="default" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Connected
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1">
                <XCircle className="h-3 w-3" />
                Not Connected
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {platformStatus?.facebook.linked ? (
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Connected to Facebook Page
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  ID: {platformStatus.facebook.scopedId?.substring(0, 20)}...
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleUnlink("facebook")}
              >
                <Unlink className="h-3.5 w-3.5 mr-2" />
                Unlink Facebook
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="facebookId" className="text-xs">
                  Facebook Page-Scoped ID
                </Label>
                <Input
                  id="facebookId"
                  placeholder="Enter your page-scoped ID"
                  value={facebookId}
                  onChange={(e) => setFacebookId(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>

              <Button
                size="sm"
                className="w-full"
                onClick={handleLinkFacebook}
                disabled={linkingFacebook || !facebookId}
              >
                {linkingFacebook ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                    Linking...
                  </>
                ) : (
                  <>
                    <LinkIcon className="h-3.5 w-3.5 mr-2" />
                    Link Facebook
                  </>
                )}
              </Button>

              <div className="p-2 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded text-xs text-blue-900 dark:text-blue-100">
                <AlertCircle className="h-3 w-3 inline mr-1" />
                Message your Zoddy Facebook Page to get your ID
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instagram */}
      <Card>
        <CardHeader className="pb-3 pt-4">
          <CardTitle className="text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-pink-600" />
              Instagram Messaging
            </div>
            {platformStatus?.instagram.linked ? (
              <Badge variant="default" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Connected
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1">
                <XCircle className="h-3 w-3" />
                Not Connected
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {platformStatus?.instagram.linked ? (
            <div className="space-y-3">
              <div className="p-3 bg-pink-50 dark:bg-pink-950 border border-pink-200 dark:border-pink-800 rounded-lg">
                <p className="text-sm font-medium text-pink-900 dark:text-pink-100">
                  Connected to Instagram Account
                </p>
                <p className="text-xs text-pink-700 dark:text-pink-300 mt-1">
                  ID: {platformStatus.instagram.scopedId?.substring(0, 20)}...
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleUnlink("instagram")}
              >
                <Unlink className="h-3.5 w-3.5 mr-2" />
                Unlink Instagram
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="instagramId" className="text-xs">
                  Instagram Scoped ID
                </Label>
                <Input
                  id="instagramId"
                  placeholder="Enter your Instagram scoped ID"
                  value={instagramId}
                  onChange={(e) => setInstagramId(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>

              <Button
                size="sm"
                className="w-full"
                onClick={handleLinkInstagram}
                disabled={linkingInstagram || !instagramId}
              >
                {linkingInstagram ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                    Linking...
                  </>
                ) : (
                  <>
                    <LinkIcon className="h-3.5 w-3.5 mr-2" />
                    Link Instagram
                  </>
                )}
              </Button>

              <div className="p-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded text-xs text-amber-900 dark:text-amber-100">
                <AlertCircle className="h-3 w-3 inline mr-1" />
                Requires Instagram Business Account with 1,000+ followers
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Telegram */}
      <Card>
        <CardHeader className="pb-3 pt-4">
          <CardTitle className="text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-sky-600" />
              Telegram Bot
            </div>
            {platformStatus?.telegram.linked ? (
              <Badge variant="default" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Connected
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1">
                <XCircle className="h-3 w-3" />
                Not Connected
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {platformStatus?.telegram.linked ? (
            <div className="space-y-3">
              <div className="p-3 bg-sky-50 dark:bg-sky-950 border border-sky-200 dark:border-sky-800 rounded-lg">
                <p className="text-sm font-medium text-sky-900 dark:text-sky-100">
                  Connected to Telegram
                </p>
                <p className="text-xs text-sky-700 dark:text-sky-300 mt-1">
                  {platformStatus.telegram.username
                    ? `@${platformStatus.telegram.username}`
                    : `User ID: ${platformStatus.telegram.userId}`}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleUnlink("telegram")}
              >
                <Unlink className="h-3.5 w-3.5 mr-2" />
                Unlink Telegram
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="telegramUserId" className="text-xs">
                  Telegram User ID
                </Label>
                <Input
                  id="telegramUserId"
                  placeholder="Your Telegram user ID"
                  value={telegramUserId}
                  onChange={(e) => setTelegramUserId(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="telegramUsername" className="text-xs">
                  Username (optional)
                </Label>
                <Input
                  id="telegramUsername"
                  placeholder="@username"
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>

              <Button
                size="sm"
                className="w-full"
                onClick={handleLinkTelegram}
                disabled={linkingTelegram || !telegramUserId}
              >
                {linkingTelegram ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                    Linking...
                  </>
                ) : (
                  <>
                    <LinkIcon className="h-3.5 w-3.5 mr-2" />
                    Link Telegram
                  </>
                )}
              </Button>

              <div className="p-2 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded text-xs text-blue-900 dark:text-blue-100">
                <AlertCircle className="h-3 w-3 inline mr-1" />
                Message @ZoddyBot on Telegram to get your User ID
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
