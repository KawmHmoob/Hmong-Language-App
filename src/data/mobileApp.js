// The mobile app's public status — ONE place to flip when it ships.
//
// Every "get the app" surface (AppPromo banner, /app page) reads from here, so
// shipping is a data edit, not a hunt through components. While a store URL is
// null, the UI says "coming soon" instead of rendering a dead download button.
// See notes/71.

export const MOBILE_APP = {
  // Paste the real listing URLs here once the builds are live.
  ios: null, // e.g. 'https://apps.apple.com/app/idXXXXXXXXX'
  android: 'https://play.google.com/store/apps/details?id=com.kawmhmoob.app',

  // Interim CTA while unshipped: an email signup for launch news.
  notifyEmail: 'techkage@proton.me',
}

export const isShipped = Boolean(MOBILE_APP.ios || MOBILE_APP.android)

// Human-readable store list, derived from which URLs exist — so copy never
// claims a platform that isn't live. "Google Play" today; "the App Store and
// Google Play" the moment an iOS URL is added.
export const storeNames = [
  MOBILE_APP.ios && 'the App Store',
  MOBILE_APP.android && 'Google Play',
].filter(Boolean).join(' and ')
