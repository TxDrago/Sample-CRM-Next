// src/Config/msalConfig.jsx

import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = () => {
  if (typeof window === "undefined") return null;

  const redirectUri =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/sidebar"
      : `https://${window.location.hostname}/sidebar`;

  return {
    auth: {
      clientId: "f6e72c07-d272-4f8f-bea6-447352900ffc",
      authority: "https://login.microsoftonline.com/d890b36f-e465-4f18-895f-27f05789df8f",
      redirectUri,
    },
    cache: {
      cacheLocation: "sessionStorage",
      storeAuthStateInCookie: true,
    },
  };
};

export const loginRequest = {
  scopes: [
    "User.Read",
    "User.ReadBasic.All",
    "User.Read.All",
    "Directory.Read.All",
  ],
};

export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
  graphManagerEndpoint: "https://graph.microsoft.com/v1.0/me/manager",
};

let msalInstance = null;

export const getMsalInstance = () => {
  if (typeof window === "undefined") return null;

  if (!msalInstance) {
    const config = msalConfig();
    if (!config) return null; // handle SSR

    msalInstance = new PublicClientApplication(config);
  }

  return msalInstance;
};
