# Password Reset on the Showcase Site

## What it is
Two pages that let users of the **mobile app** reset a forgotten password:

| Page | Path | Job |
|---|---|---|
| `ResetPassword.jsx` | `/reset-password` | "Email me a link." Calls `resetPasswordForEmail` |
| `UpdatePassword.jsx` | `/reset-password/update` | The page the email link opens. Calls `updateUser({ password })` |

Linked from the footer ("Reset password"), the FAQ, and the retired-route message in `NotFound`.

## Why it lives on the website
The mobile app (`KawmHmoob-rn`) has **no reset code at all**: no "Forgot password?" button, no `resetPasswordForEmail` call. Supabase's reset email has to link to a web page anyway, and the site already exists, so both steps live here. The app only needs a link to `https://kawmhmoob.com/reset-password` (see "Next" below).

## The flow, end to end
```
/reset-password                         Supabase                       /reset-password/update
───────────────                         ────────                       ──────────────────────
enter email ──resetPasswordForEmail──▶  emails a one-time link
                                        user taps link ──▶ verifies ──▶ redirect with
                                                                        #access_token=…&type=recovery
                                                                        supabase-js reads it → session in memory
                                                                        user types new password
                                                                        updateUser({ password }) ✔
                                                                        signOut (local) → "Open the app"
```
Nothing on step 2 asks for an email. **The recovery session is what identifies the user.** `updateUser` changes the password of whoever that session belongs to, which is why only someone with access to the inbox can do it.

## Decisions worth remembering

### Implicit flow, not PKCE
```js
createClient(url, anonKey, { auth: { flowType: 'implicit', detectSessionInUrl: true, persistSession: false } })
```
With **PKCE**, `resetPasswordForEmail` stores a secret "code verifier" in the *requesting* browser, and the link only works in that browser. Someone who requests on a laptop and taps the email on their phone gets "code verifier should be non-empty". For a mobile app's users that's the common case, not an edge case.

With **implicit**, the link carries the token in the URL **fragment** (`#…`). Browsers never send the fragment to a server, so Vercel never sees the token, and the link works on any device. supabase-js removes the fragment from the address bar after reading it.

`persistSession: false` keeps the recovery session in **memory only**. The site has no accounts, so nothing should stay in localStorage after the reset.

### Snapshot the URL fragment before supabase-js erases it
A dead link (expired or already used) arrives as `#error=access_denied&error_code=otp_expired&error_description=…`. supabase-js consumes and clears the fragment during setup, so `lib/supabase.js` saves it first:
```js
export const initialUrlHash = typeof window === 'undefined' ? '' : window.location.hash  // runs BEFORE createClient
```
`UpdatePassword` reads that snapshot to show "This link has expired" rather than a generic failure.

### Same answer whether or not the account exists
Step 1 always says "**If** an account exists for x, we've sent a link." Saying "no account found" would let anyone check which emails are signed up (account enumeration). Supabase returns success for unknown emails for the same reason.

### Resend cooldown = Supabase's rate limit
Supabase allows **one reset email per address per 60 seconds**. The "Send again" button counts down 60s so people don't run straight into a 429. Any 429 that gets through anyway shows as "Too many requests. Please wait a minute."

**Bug hit while writing it:** the first version used one `status` value (`idle | sending | sent`). Pressing "Send again" set it to `sending`, so the success view, which rendered when `status === 'sent'`, switched back to the email form mid-resend. It now uses two flags, `sending` and `sent`, because a resend happens *while* the sent view is showing.

### Knowing whether the link worked: `getSession()`
`getSession()` waits until supabase-js has finished reading the URL, so when it resolves the answer is final: session → show the form; no session → "invalid link". A `PASSWORD_RECOVERY` listener is a second, redundant way to get the same answer, in case of timing differences.

### After saving: sign out, send to the app
`signOut({ scope: 'local' })` drops only this browser's in-memory session. Other devices aren't signed out. Then:
- **Open the app** → `kawmhmoob://login`, using the app's URL scheme from `app.json`. It only does something on a phone with the app installed. **⚠️ Not tested on a device yet.**
- A Google Play text link for anyone who doesn't have the app on that phone.

### Small details
- The new-password form has a hidden `username` field holding the account's email. Password managers use it to save the new password under the right account. The email also appears in the intro ("For you@x.com") so the person can confirm it's the right account.
- `autoComplete="new-password"` on both fields, so browsers offer to generate a password.
- Minimum length is **8** on the site. If the Supabase project requires more, its error message is shown as-is.
- An expired session at save time (401) goes to the "Send a new link" screen. Fixable errors (too weak, same as the old password) stay on the form with Supabase's message.

### Kept out of the landing page
supabase-js is about 55 kB gzipped. The reset pages are `React.lazy` imports wrapped in `<Suspense>` inside `PageContainer` (`App.jsx`). Vite splits them into their own chunks, verified: the main `index-*.js` has no Supabase code. Landing-page visitors never download it.

## Setup you MUST do (outside the code)
1. **Supabase → Authentication → URL Configuration → Redirect URLs.** Add:
   - `https://kawmhmoob.com/reset-password/update`
   - `http://localhost:5173/reset-password/update` (local testing)
   - optionally your Vercel preview pattern, e.g. `https://*.vercel.app/reset-password/update`

   If `redirectTo` isn't on this list, Supabase **silently ignores it** and sends people to the Site URL. Set **Site URL** to `https://kawmhmoob.com` too.
2. **Vercel → Settings → Environment Variables:** `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` must be set for **Production**. Vite bakes them in **at build time**, so redeploy after adding them. If they're missing, the pages show "Password reset isn't available" rather than failing silently.
3. **Use the same Supabase project as the app.** The users are in the app's project. If the site points at a different project, step 1 still says "we've sent a link" (by design), but no email ever arrives. Compare the URL in Vercel with the app's `EXPO_PUBLIC_SUPABASE_URL` in EAS.
4. **Email sending limits.** Supabase's built-in email sender only allows a handful of emails per hour and is meant for testing. For real users, set up custom SMTP (Authentication → Emails → SMTP Settings) with a provider such as Resend, Postmark, or SES.
5. (Optional) Restyle the **Reset Password** email template. The default `{{ .ConfirmationURL }}` link works as-is.

## Testing it
1. `npm run dev` → `http://localhost:5173/reset-password` → your own email.
2. Open the email (on your phone too, to check cross-device) → the update page should say "For you@…".
3. Set a password → sign in to the app with it.
4. Click the same email link again → should show "This link doesn't work" (used once).
5. Request twice quickly → the button should count down from 60.

## Next: a button in the app
Add a "Forgot password?" link on the app's login screen that opens the site:
```jsx
import * as Linking from 'expo-linking'
<Pressable onPress={() => Linking.openURL('https://kawmhmoob.com/reset-password')}>…</Pressable>
```

## Files
- `src/lib/supabase.js`: client (implicit flow, memory-only session) + `initialUrlHash` snapshot
- `src/pages/ResetPassword.jsx`: step 1
- `src/pages/UpdatePassword.jsx`: step 2
- `src/components/site/AuthCard.jsx`: `AuthCard`, `Field`, `Notice`
- `src/App.jsx`: lazy routes + `Suspense`
- `src/components/site/SiteFooter.jsx`, `src/data/showcase.js` (FAQ), `src/pages/NotFound.jsx`: entry links
- `scripts/theme/contrast.mjs`: error text + placeholder pairs (placeholder moved `stone-500` → `stone-600`; 500 was 4.45:1)
