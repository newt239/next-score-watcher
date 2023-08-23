import ReactGA from "react-ga4";

const GA_ID = import.meta.env.VITE_APP_GA_ID;

export const isGA4Enabled = () => {
  return !!GA_ID;
};

export const initializeGA4 = () => {
  if (GA_ID) {
    ReactGA.initialize(GA_ID);
  }
};

export const recordPageView = (path: string) => {
  if (GA_ID) {
    ReactGA.send({
      hitType: "pageview",
      page: path,
    });
  }
};

export const recordEvent = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: "engagement";
  label?: string;
  value?: number;
}) => {
  if (GA_ID) {
    ReactGA.event({
      action,
      category,
      label,
      value,
    });
  }
};
