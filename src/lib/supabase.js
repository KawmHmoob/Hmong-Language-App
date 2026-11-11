// Supabase client for the showcase site. Two jobs: password reset (notes/73)
// and the admin sign-in (notes/74). The site has no public accounts. It talks
// to the SAME Supabase project as the mobile app (that's where the users are).
//
// Loaded lazily: only the /reset-password and /admin pages import this file (via
// React.lazy in App.jsx), so supabase-js never ships in the landing page bundle.

import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// The reset email's link lands on /reset-password/update with the result in
// the URL fragment: either a session (#access_token=…&type=recovery) or an
// error (#error_code=otp_expired&…). supabase-js reads that fragment and then
// ERASES it from the address bar. So we snapshot it first — this line runs at
// import, before createClient below — to still be able to explain a bad link.
export const initialUrlHash = typeof window === 'undefined' ? '' : window.location.hash

export const supabase =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: {
          // IMPLICIT, not PKCE. With PKCE the link only works in the same browser
          // that requested it (the secret "code verifier" lives in that browser's
          // storage). People request on a laptop and tap the email on a phone all
          // the time. Implicit puts the token in the # fragment — which is never
          // sent to any server — so the link works on any device.
          flowType: 'implicit',
          detectSessionInUrl: true,
          // Sessions live in MEMORY only — nothing lingers in localStorage. A
          // recovery session only needs to last until the password is set; an
          // admin session ends when the tab is closed or reloaded (deliberate:
          // sign in each visit).
          persistSession: false,
          // Access tokens expire after ~1 hour. Refreshing keeps a long admin
          // visit working; harmless for the short-lived reset flow.
          autoRefreshToken: true,
        },
      })
    : null

// Where the email link should send people. Built from the current origin so it
// works on localhost, Vercel previews, and kawmhmoob.com alike — each origin
// must ALSO be on Supabase's Redirect URLs allowlist (notes/73).
export const RESET_REDIRECT_PATH = '/reset-password/update'
