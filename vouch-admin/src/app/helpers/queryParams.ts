const urlParams = new URLSearchParams(window.location.search);
export const APP_NAME = urlParams.get('appName') || 'Vouch';
