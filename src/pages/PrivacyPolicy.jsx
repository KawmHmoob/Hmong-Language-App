import LegalLayout, { Section } from '../components/common/LegalLayout.jsx'

// PRIVACY POLICY — a starting-point document that reflects what the app
// ACTUALLY does today, not generic boilerplate. Two facts drive it:
//   1. Voice recordings are processed IN THE BROWSER and are NOT uploaded or
//      stored anywhere (notes/61). That's a genuine, statable privacy strength.
//   2. Optional demographics (incl. ethnicity, a special category) are
//      collected in onboarding for personalization + a future opt-in dataset
//      (notes/69, notes/03 §6).
//
// ⚠️ NOT LEGAL ADVICE. Have a qualified person review before the voice corpus
// goes live or the app charges money.

const CONTACT = 'techkage@proton.me'
const UPDATED = 'July 21, 2026'

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy" updated={UPDATED}>
      <Section heading="The short version">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Your voice recordings are analyzed <strong>on your device</strong> and are <strong>not uploaded or stored</strong> by us today.</li>
          <li>We collect the minimum to run the app: an account, your learning progress, and a few <strong>optional</strong> questions you can always skip.</li>
          <li>We don’t sell your data.</li>
          <li>You can see, correct, or delete your data by contacting us.</li>
        </ul>
      </Section>

      <Section heading="Who we are">
        <p>
          Kawm Hmoob (“we”, “us”) is a Hmong language-learning app run by an
          individual developer. For anything in this policy, contact{' '}
          <a href={`mailto:${CONTACT}`} className="text-clay-700 underline">{CONTACT}</a>.
        </p>
      </Section>

      <Section heading="What we collect">
        <p><strong>Account information.</strong> When you create an account, we store your email, a username, and a display name. Authentication is handled by Supabase.</p>
        <p><strong>Learning progress.</strong> Lessons completed, quiz scores, words studied, streaks, and points — so your progress is saved and syncs across devices. If you use the app as a guest, this is kept only in your browser’s local storage on that device.</p>
        <p>
          <strong>Optional profile details.</strong> During onboarding we ask about your age range, gender, dialect, relationship to the Hmong language, ethnicity, and region.{' '}
          <strong>Every one of these is optional</strong> — you can answer “prefer not to say” or skip them entirely, and change them later in Settings.
        </p>
        <p><strong>Basic technical data.</strong> Standard information your browser sends (such as device and browser type) and data our hosting provider processes to deliver and secure the app.</p>
      </Section>

      <Section heading="Your voice recordings">
        <p>
          When you use the Speak feature, your microphone recording is analyzed{' '}
          <strong>entirely within your browser</strong> to compare your pitch to a
          native speaker’s. <strong>The recording is not sent to our servers and
          is not stored.</strong> It exists only in your device’s memory during
          practice and is discarded when you record again or leave the page.
        </p>
        <p>
          We are building toward an <strong>opt-in</strong> community voice dataset
          to improve Hmong pronunciation tools, which are badly under-resourced.
          <strong> If that launches, it will be a separate, explicit choice</strong>
          {' '}— nothing is collected for it without asking you first, and you would
          be told exactly what is stored and why before any recording is saved.
        </p>
      </Section>

      <Section heading="Sensitive information (ethnicity)">
        <p>
          Ethnicity is treated by many privacy laws (including the EU’s GDPR) as a{' '}
          <strong>special category</strong> of personal data with extra protection.
          We ask for it only because it helps make a future Hmong voice dataset
          representative — and it is <strong>always optional</strong>, never
          required to use the app, and never shown publicly. If you’d rather not
          share it, choose “prefer not to say.”
        </p>
      </Section>

      <Section heading="How we use your information">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>To run the app and save your progress.</li>
          <li>To personalize your learning (e.g. your chosen dialect).</li>
          <li>To understand, in aggregate, how the app is used so it can improve.</li>
          <li>With your separate opt-in, to help build an open Hmong pronunciation dataset.</li>
        </ul>
        <p>We do <strong>not</strong> sell your personal information.</p>
      </Section>

      <Section heading="Where your data is stored">
        <p>
          Account and progress data are stored using <strong>Supabase</strong>, our
          database and authentication provider, which may process data on servers
          located in the United States or elsewhere. Access is restricted so that,
          in normal operation, you can only read and change your own data.
        </p>
      </Section>

      <Section heading="Cookies and local storage">
        <p>
          We use your browser’s local storage to keep you signed in and to hold
          guest progress and preferences. We don’t use third-party advertising or
          tracking cookies.
        </p>
      </Section>

      <Section heading="Your rights and choices">
        <p>
          You can <strong>access, correct, or delete</strong> your account and its
          data at any time — update it in Settings, or email us to request a copy
          or deletion. Depending on where you live, you may have additional rights
          under laws such as the GDPR or the CCPA; we’ll honor those requests.
        </p>
        <p>To make a request, email <a href={`mailto:${CONTACT}`} className="text-clay-700 underline">{CONTACT}</a>.</p>
      </Section>

      <Section heading="Children">
        <p>
          Kawm Hmoob is intended for a general audience. We don’t knowingly collect
          personal information from children under 13 (or the minimum age in your
          country) without appropriate consent. If you believe a child has provided
          us information, contact us and we’ll remove it.
        </p>
      </Section>

      <Section heading="Changes to this policy">
        <p>
          As the app grows — especially when the voice dataset or paid features
          launch — this policy will be updated, and the “last updated” date above
          will change. Significant changes will be highlighted in the app.
        </p>
      </Section>

      <Section heading="Contact">
        <p>
          Questions about privacy? Email{' '}
          <a href={`mailto:${CONTACT}`} className="text-clay-700 underline">{CONTACT}</a>.
        </p>
      </Section>
    </LegalLayout>
  )
}
