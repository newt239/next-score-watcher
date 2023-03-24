export const GA_ID = import.meta.env.import.meta.VITE_APP_GA_ID || "";

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
// PV 数の計測
export const pageview = (url: string) => {
  if (!GA_ID) return;
  window.gtag("config", GA_ID, {
    page_path: url,
  });
};

export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label: string;
  value?: number;
}): void => {
  if (!GA_ID) return;
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
