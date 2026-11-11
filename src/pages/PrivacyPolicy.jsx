import LegalLayout, { Section } from '../components/common/LegalLayout.jsx'

// PRIVACY POLICY — covers the Kawm Hmoob MOBILE APP and this showcase website.
// Written to match what the code actually does (checked against KawmHmoob-rn,
// Nov 2026), not generic boilerplate:
//   - Accounts + progress: Supabase (profiles, progress tables).
//   - Optional onboarding: age range (incl. "Under 18"), gender, dialect,
//     relationship to Hmong, ethnicity (special category), region.
//   - Microphone: Android permission is DECLARED by the expo-audio plugin, but
//     no app code records today. Say so plainly; update this if that changes.
//   - Purchases: RevenueCat SDK is wired with a TEST key only — nothing is sold
//     yet. Worded as "if paid features are offered".
//   - Website: no accounts, no analytics; localStorage holds the theme only.
//
// Google Play needs two URLs from this page: the policy itself (/privacy) and
// the account-deletion instructions (/privacy#delete-account). Don't rename
// that id. See notes/72.
//
// ⚠️ NOT LEGAL ADVICE. Have a qualified person review it, especially before
// selling subscriptions or collecting voice recordings.

const CONTACT = 'techkage@proton.me'
const UPDATED = 'November 9, 2026'

const mail = (subject) => `mailto:${CONTACT}?subject=${encodeURIComponent(subject)}`
const link = 'text-clay-700 underline'

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy" updated={UPDATED}>
      <Section heading="The short version">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>We collect what the app needs to work: an account and your learning progress.</li>
          <li>A few profile questions are asked at sign-up. <strong>All of them are optional.</strong></li>
          <li>The app does <strong>not</strong> record your voice today.</li>
          <li>We don’t sell your data, and we don’t use advertising or tracking tools.</li>
          <li>You can delete your account and its data at any time — <a href="#delete-account" className={link}>here’s how</a>.</li>
        </ul>
      </Section>

      <Section heading="Who we are">
        <p>
          Kawm Hmoob (“we”, “us”) is a Hmong language-learning app for Android,
          plus this website, made by an individual developer. This policy covers
          both. For anything in it, email{' '}
          <a href={`mailto:${CONTACT}`} className={link}>{CONTACT}</a>.
        </p>
      </Section>

      <Section heading="What the app collects">
        <p><strong>Account information.</strong> If you create an account: your email address, a username, and a display name. Sign-in is handled by Supabase, our database and authentication provider.</p>
        <p><strong>Learning progress.</strong> Lessons completed, quiz results, words studied, streaks, and points, so your progress is saved and restored when you sign in. If you use the app without an account, this stays on your device only.</p>
        <p>
          <strong>Optional profile questions.</strong> At sign-up we ask your age range, gender,
          preferred dialect, your relationship to the Hmong language, ethnicity, and the region
          your family is from. <strong>Every question can be skipped or answered “prefer not to
          say”</strong>, and you can change your answers later.
        </p>
        <p><strong>Purchases.</strong> The app is free today. If paid features are offered later, payments will be processed by <strong>Google Play</strong> — we never see your card details — and your subscription status will be managed by <strong>RevenueCat</strong>, which receives a purchase record and an app user identifier, not your payment information.</p>
      </Section>

      <Section heading="Microphone">
        <p>
          On Android, the app’s audio component declares the microphone permission,
          so it may be listed on the Play Store. <strong>The app does not currently
          record your voice</strong>, and it won’t ask for microphone access to play
          lessons. If a recording feature is added, you will be asked for permission
          first and told exactly how recordings are used. Any future community voice
          dataset would be a separate, explicit opt-in.
        </p>
      </Section>

      <Section heading="Sensitive information (ethnicity)">
        <p>
          Many privacy laws, including the EU’s GDPR, treat ethnicity as a{' '}
          <strong>special category</strong> of personal data. We ask only because it
          helps us understand who the app serves and make future Hmong language
          resources more representative. It is <strong>always optional</strong>,
          never required to use the app, and never shown to other users.
        </p>
      </Section>

      <Section heading="How we use it">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>To run the app, keep you signed in, and save your progress.</li>
          <li>If you appear on a leaderboard, to show your username and points there — never your email.</li>
          <li>To personalize learning, such as your preferred dialect.</li>
          <li>To understand, in aggregate, who uses the app so it can improve.</li>
        </ul>
        <p>We do <strong>not</strong> sell your personal information or share it for advertising.</p>
      </Section>

      <Section heading="Who processes your data">
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Supabase</strong> — account and progress storage.</li>
          <li><strong>Google Play</strong> — app distribution and, if offered, payments.</li>
          <li><strong>RevenueCat</strong> — subscription status, if paid features are offered.</li>
          <li><strong>Vercel</strong> — hosts this website.</li>
        </ul>
        <p>
          These providers may store data on servers in the United States or other
          countries. Access to account data is restricted so that, in normal
          operation, you can only read and change your own.
        </p>
      </Section>

      <Section heading="This website">
        <p>
          This site has no accounts and no analytics. It stores one thing in your
          browser: your light/dark theme choice. Like any website, its host
          (Vercel) processes standard request information, such as IP address and
          browser type, to deliver and secure the site.
        </p>
      </Section>

      <Section id="delete-account" heading="Deleting your account">
        <p>
          You can ask us to delete your Kawm Hmoob account and all data tied to it
          — profile, profile answers, and progress — at any time:
        </p>
        <ol className="list-decimal pl-5 space-y-1.5">
          <li>
            Email{' '}
            <a href={mail('Delete my Kawm Hmoob account')} className={link}>{CONTACT}</a>{' '}
            from the address you signed up with, with the subject “Delete my Kawm Hmoob account”.
          </li>
          <li>Include your username if you remember it.</li>
          <li>We’ll confirm, then delete your account and its data within 30 days.</li>
        </ol>
        <p>
          Records we’re legally required to keep (for example, purchase records
          held by Google Play) are kept by those providers under their own policies.
        </p>
      </Section>

      <Section heading="Your other rights">
        <p>
          You can also ask for a copy of your data or have it corrected. Depending
          on where you live, laws such as the GDPR or CCPA may give you further
          rights, and we’ll honor them. Email{' '}
          <a href={`mailto:${CONTACT}`} className={link}>{CONTACT}</a>.
        </p>
      </Section>

      <Section heading="Children">
        <p>
          Kawm Hmoob is made for a general audience and is not directed at
          children under 13. We don’t knowingly collect personal information from
          children under 13 (or the minimum age in your country). If you believe a
          child has given us information, contact us and we’ll delete it.
        </p>
      </Section>

      <Section heading="Changes to this policy">
        <p>
          We’ll update this policy as the app changes — for example, if recording
          or paid features are added — and change the date at the top. Significant
          changes will also be announced in the app.
        </p>
      </Section>
    </LegalLayout>
  )
}
