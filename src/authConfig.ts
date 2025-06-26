import { Configuration, PopupRequest } from '@azure/msal-browser';

// MSAL configuration
export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.REACT_APP_CLIENT_ID || '',
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_TENANT_ID || ''}`,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  }
};

// Add scopes here for token to be used at Microsoft Graph API endpoints
export const loginRequest: PopupRequest = {
  scopes: [
    'User.Read',
    'Calendars.ReadWrite',
    'Mail.Send',
    'User.ReadBasic.All'
  ]
};

// Add the endpoints here for Microsoft Graph API services you'd like to use
export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
  graphMailEndpoint: 'https://graph.microsoft.com/v1.0/me/messages',
  graphCalendarEndpoint: 'https://graph.microsoft.com/v1.0/me/calendar/events'
}; 