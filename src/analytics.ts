import type { CheckoutKey } from "./data";

type ConsentChoice = "granted" | "denied";
type EventParameters = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const CONSENT_KEY = "dwc-books-analytics-consent";
const ga4MeasurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID?.trim() ?? "";
const gtmContainerId = import.meta.env.VITE_GTM_CONTAINER_ID?.trim() ?? "";

const checkoutItems: Record<CheckoutKey, { name: string; price: number }> = {
  single: { name: "Satu Buku", price: 29000 },
  four: { name: "Paket 4 Buku", price: 60000 },
  six: { name: "Koleksi 6 Buku", price: 109000 },
  balik: { name: "Balik Jungkir", price: 29000 },
  wmethod: { name: "W Method", price: 29000 },
  doseen: { name: "Doseen Desoon", price: 29000 },
  miring: { name: "Berpikir Miring", price: 29000 },
  city: { name: "City Branding", price: 29000 },
  monetized: { name: "The Monetized City", price: 29000 },
};

let loaded = false;
let currentConsent: ConsentChoice | null = null;

const validGa4Id = /^G-[A-Z0-9]+$/i.test(ga4MeasurementId);
const validGtmId = /^GTM-[A-Z0-9]+$/i.test(gtmContainerId);

function prepareDataLayer() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || ((...args: unknown[]) => window.dataLayer.push(args));
}

function loadScript(source: string, id: string) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = source;
  document.head.appendChild(script);
}

function prepareGrantedGoogleConsent() {
  prepareDataLayer();
  window.gtag?.("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
  });
  window.gtag?.("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

function loadAnalytics() {
  if (loaded || !analyticsConfigured) return;
  loaded = true;
  prepareGrantedGoogleConsent();

  if (validGtmId) {
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    loadScript(
      `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmContainerId)}`,
      "google-tag-manager",
    );
    return;
  }

  loadScript(
    `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4MeasurementId)}`,
    "google-tag",
  );
  window.gtag?.("js", new Date());
  window.gtag?.("config", ga4MeasurementId, {
    anonymize_ip: true,
    send_page_view: true,
    transport_type: "beacon",
  });
}

function clearGoogleAnalyticsCookies() {
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0]?.trim();
    if (!name || (name !== "_ga" && !name.startsWith("_ga_"))) return;
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    document.cookie = `${name}=; Max-Age=0; path=/; domain=.dadikwahyuchang.id; SameSite=Lax`;
  });
}

export const analyticsConfigured = validGtmId || validGa4Id;

export function getAnalyticsConsent(): ConsentChoice | null {
  try {
    const stored = window.localStorage.getItem(CONSENT_KEY);
    return stored === "granted" || stored === "denied" ? stored : null;
  } catch {
    return currentConsent;
  }
}

export function setAnalyticsConsent(choice: ConsentChoice) {
  currentConsent = choice;
  try {
    window.localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    currentConsent = choice;
  }

  if (choice === "granted") {
    loadAnalytics();
    return;
  }

  window.gtag?.("consent", "update", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  clearGoogleAnalyticsCookies();
}

export function initializeAnalytics() {
  if (analyticsConfigured && getAnalyticsConsent() === "granted") loadAnalytics();
}

export function trackEvent(name: string, parameters: EventParameters = {}) {
  if (!loaded || getAnalyticsConsent() !== "granted") return;
  if (validGtmId) {
    window.dataLayer.push({ event: name, ...parameters });
    return;
  }
  window.gtag?.("event", name, parameters);
}

export function trackBeginCheckout(checkoutKey: CheckoutKey, callback: () => void) {
  const item = checkoutItems[checkoutKey];
  if (!loaded || getAnalyticsConsent() !== "granted") {
    callback();
    return false;
  }

  const parameters = {
    currency: "IDR",
    value: item.price,
    items: [{ item_id: checkoutKey, item_name: item.name, price: item.price, quantity: 1 }],
  };

  if (validGtmId) {
    window.dataLayer.push({
      event: "begin_checkout",
      ...parameters,
      eventCallback: callback,
      eventTimeout: 500,
    });
  } else {
    window.gtag?.("event", "begin_checkout", {
      ...parameters,
      event_callback: callback,
      event_timeout: 500,
    });
  }
  return true;
}
