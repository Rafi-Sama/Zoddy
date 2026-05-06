import { MessageSquare, Phone, Globe, Edit, Sparkles } from "lucide-react";

/**
 * Channel utilities for social platform integrations
 * Maps channel types to their icons and colors for consistent display
 */

export type OrderChannel =
  | "whatsapp"
  | "facebook"
  | "instagram"
  | "phone"
  | "website"
  | "manual"
  | "messenger"
  | "telegram"
  | null
  | undefined;

/**
 * Get icon component for order channel
 */
export function getChannelIcon(channel: OrderChannel) {
  switch (channel) {
    case "whatsapp":
      return <MessageSquare className="h-3 w-3" />;
    case "facebook":
      return <MessageSquare className="h-3 w-3" />;
    case "instagram":
      return <MessageSquare className="h-3 w-3" />;
    case "telegram":
      return <MessageSquare className="h-3 w-3" />;
    case "messenger":
      return <MessageSquare className="h-3 w-3" />;
    case "phone":
      return <Phone className="h-3 w-3" />;
    case "website":
      return <Globe className="h-3 w-3" />;
    case "manual":
      return <Edit className="h-3 w-3" />;
    default:
      return <Edit className="h-3 w-3" />;
  }
}

/**
 * Get color class for channel badge
 */
export function getChannelColor(channel: OrderChannel): string {
  switch (channel) {
    case "whatsapp":
      return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200 border-green-200 dark:border-green-800";
    case "facebook":
      return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200 border-blue-200 dark:border-blue-800";
    case "instagram":
      return "bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-200 border-pink-200 dark:border-pink-800";
    case "telegram":
      return "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200 border-sky-200 dark:border-sky-800";
    case "messenger":
      return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200 border-blue-200 dark:border-blue-800";
    case "phone":
      return "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200 border-purple-200 dark:border-purple-800";
    case "website":
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800";
    case "manual":
      return "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-200 border-gray-200 dark:border-gray-800";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-200 border-gray-200 dark:border-gray-800";
  }
}

/**
 * Get display name for channel
 */
export function getChannelName(channel: OrderChannel): string {
  switch (channel) {
    case "whatsapp":
      return "WhatsApp";
    case "facebook":
      return "Facebook";
    case "instagram":
      return "Instagram";
    case "telegram":
      return "Telegram";
    case "messenger":
      return "Messenger";
    case "phone":
      return "Phone";
    case "website":
      return "Website";
    case "manual":
      return "Manual";
    default:
      return "Manual";
  }
}

/**
 * Check if order was auto-created via AI
 */
export function isAutoCreated(metadata: unknown): boolean {
  if (!metadata) return false;
  if (typeof metadata === 'string') {
    try {
      const parsed = JSON.parse(metadata);
      return parsed?.auto_created === true;
    } catch {
      return false;
    }
  }
  if (typeof metadata === 'object' && metadata !== null) {
    return (metadata as Record<string, unknown>)?.auto_created === true;
  }
  return false;
}

/**
 * Get AI badge component if order was auto-created
 */
export function getAIBadge(metadata: unknown) {
  if (!isAutoCreated(metadata)) return null;

  return (
    <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200 border border-violet-200 dark:border-violet-800">
      <Sparkles className="h-2.5 w-2.5" />
      <span>AI</span>
    </div>
  );
}
