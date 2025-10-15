interface AnalyticsOptions {
  enabled?: boolean;
  scriptUrl?: string;
  websiteId?: string;
}

export function injectUmamiAnalytics(options: AnalyticsOptions = {}) {
  if (typeof document === "undefined") {
    return;
  }

  const scriptUrl = options.scriptUrl ?? import.meta.env.VITE_UMAMI_SCRIPT_URL;
  const websiteId = options.websiteId ?? import.meta.env.VITE_UMAMI_WEBSITE_ID;
  const defaultEnabled =
    import.meta.env.MODE === "production" &&
    import.meta.env.VITE_ENABLE_ANALYTICS !== "false";

  const isEnabled = options.enabled ?? defaultEnabled;

  if (!isEnabled || !scriptUrl || !websiteId) {
    return;
  }

  const existing = document.querySelector(
    'script[data-analytics="umami"]'
  );

  if (existing) {
    return;
  }

  const script = document.createElement("script");
  script.defer = true;
  script.src = scriptUrl;
  script.dataset.websiteId = websiteId;
  script.dataset.analytics = "umami";

  document.head.appendChild(script);
}
