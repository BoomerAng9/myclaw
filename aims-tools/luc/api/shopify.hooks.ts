/**
 * Shopify Integration Hooks for OpenClaw Cron Automation
 * 
 * These functions are called by the OpenClaw cron jobs:
 * - daily-revenue-check: Checks MindEdge dashboard + Shopify admin
 * - weekly-catalog-sync: Compares MindEdge catalog vs Shopify products
 * 
 * They are consumed by the OpenClaw agent via the /incoming/aims-gateway hook.
 */

const MINDEDGE_CATALOG_URL = 'https://catalog.mindedge.com/achievemor';
const MINDEDGE_DASHBOARD_URL = 'http://apps.mindedgeonline.com/#/dashboard';

export interface ShopifyProduct {
  id: string;
  title: string;
  status: string;
  price: string;
  updated_at: string;
}

export interface RevenueSnapshot {
  date: string;
  total_revenue: number;
  active_learners: number;
  new_completions: number;
  alerts: string[];
}

/**
 * Formats a daily revenue summary for Telegram delivery.
 */
export function formatDailyRevenueSummary(snapshot: RevenueSnapshot): string {
  const alertSection = snapshot.alerts.length > 0
    ? `\n⚠️ Alerts:\n${snapshot.alerts.map(a => `  • ${a}`).join('\n')}`
    : '✅ No active alerts.';

  return `📊 **Daily Revenue Summary** — ${snapshot.date}

💰 Revenue: $${snapshot.total_revenue.toFixed(2)}
👥 Active Learners: ${snapshot.active_learners}
🎓 New Completions: ${snapshot.new_completions}

${alertSection}

_Source: MindEdge Partner Dashboard + Shopify Admin_`;
}

/**
 * Formats a weekly catalog diff report for Telegram delivery.
 */
export function formatCatalogSyncReport(diff: {
  new_courses: string[];
  removed_courses: string[];
  price_changes: { title: string; old_price: string; new_price: string }[];
}): string {
  const newSection = diff.new_courses.length > 0
    ? `🆕 New Courses:\n${diff.new_courses.map(c => `  • ${c}`).join('\n')}`
    : '🆕 No new courses detected.';

  const removedSection = diff.removed_courses.length > 0
    ? `🗑️ Removed Courses:\n${diff.removed_courses.map(c => `  • ${c}`).join('\n')}`
    : '🗑️ No removed courses.';

  const priceSection = diff.price_changes.length > 0
    ? `💲 Price Changes:\n${diff.price_changes.map(p => `  • ${p.title}: ${p.old_price} → ${p.new_price}`).join('\n')}`
    : '💲 No price changes.';

  return `📋 **Weekly Catalog Sync Report**

${newSection}

${removedSection}

${priceSection}

_Compared: ${MINDEDGE_CATALOG_URL} vs Shopify Products_`;
}

/**
 * Processes an incoming Shopify webhook event.
 * Called by the OpenClaw hook mapping at /incoming/aims-gateway.
 */
export function processShopifyWebhook(payload: {
  topic: string;
  shop_domain: string;
  body: any;
}): {
  action: string;
  summary: string;
  should_notify: boolean;
} {
  switch (payload.topic) {
    case 'orders/create':
      return {
        action: 'order_created',
        summary: `New order from ${payload.body?.email || 'unknown'} — $${payload.body?.total_price || '0'}`,
        should_notify: true,
      };

    case 'products/update':
      return {
        action: 'product_updated',
        summary: `Product updated: ${payload.body?.title || 'unknown'}`,
        should_notify: false,
      };

    case 'app/uninstalled':
      return {
        action: 'app_uninstalled',
        summary: '⚠️ Shopify app was uninstalled!',
        should_notify: true,
      };

    default:
      return {
        action: 'unknown',
        summary: `Unhandled Shopify event: ${payload.topic}`,
        should_notify: false,
      };
  }
}
