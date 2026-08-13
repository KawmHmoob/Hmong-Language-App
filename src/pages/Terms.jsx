import LegalLayout, { Section } from '../components/common/LegalLayout.jsx'

// TERMS OF SERVICE — starting-point template, matched to what the app is: a
// free, early-beta, solo-built educational tool whose Hmong content is still
// being verified and whose tone scoring is experimental. The accuracy and
// "as-is / beta" disclaimers are the load-bearing parts for THIS app.
//
// ⚠️ NOT LEGAL ADVICE. Review before charging money or relying on the liability
// and governing-law sections. GOVERNING LAW is a placeholder — set it to your
// own state/country.

const CONTACT = 'techkage@proton.me'
const UPDATED = 'July 21, 2026'

export default function Terms() {
  return (
    <LegalLayout title="Terms of Service" updated={UPDATED}>
      <Section heading="Agreement">
        <p>
          By using Kawm Hmoob (“the app”), you agree to these terms. If you don’t
          agree, please don’t use the app. These terms may change as the app
          grows; continued use after a change means you accept the update.
        </p>
      </Section>

      <Section heading="What Kawm Hmoob is">
        <p>
          Kawm Hmoob is an <strong>educational app for learning the Hmong
          language</strong>, built and run by an individual developer. It is in
          <strong> early beta</strong>: features are incomplete, may change, and
          may not always work as intended.
        </p>
      </Section>

      <Section heading="Content accuracy — please read">
        <p>
          The Hmong language content — words, translations, tones, and example
          sentences — is <strong>still being reviewed by native speakers</strong>,
          and some of it may be incomplete or incorrect. Use the app as a learning
          aid, not an authoritative reference, and verify anything important with a
          fluent speaker.
        </p>
        <p>
          The pronunciation (“Speak”) scoring is <strong>experimental</strong>. The
          pitch comparison is meant as feedback to practice against, not a
          definitive judgment of correctness.
        </p>
      </Section>

      <Section heading="Your account">
        <p>
          You’re responsible for keeping your login secure and for activity under
          your account. Provide accurate information when signing up, and let us
          know if you believe your account has been compromised.
        </p>
      </Section>

      <Section heading="Acceptable use">
        <p>You agree not to:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>break the law or infringe others’ rights while using the app;</li>
          <li>attempt to disrupt, overload, reverse-engineer, or gain unauthorized access to the app or its data;</li>
          <li>upload or submit content that is harmful, hateful, or that you don’t have the right to share;</li>
          <li>use another person’s account without permission.</li>
        </ul>
      </Section>

      <Section heading="Your content and recordings">
        <p>
          Your learning progress and any voice recordings you make stay yours.
          Today, voice recordings are processed on your device and are not stored
          by us (see the{' '}
          <a href="/privacy" className="text-clay-700 underline">Privacy Policy</a>).
          If we later offer a way to donate recordings to an open Hmong voice
          dataset, that will be a separate, clearly-explained opt-in.
        </p>
      </Section>

      <Section heading="Our content">
        <p>
          The app’s design, code, lessons, and original materials belong to Kawm
          Hmoob. You may use the app for your own personal learning. Please don’t
          copy, resell, or redistribute the content without permission. Some
          material (such as the Hmong language itself and community knowledge) is
          shared cultural heritage and is presented with that respect.
        </p>
      </Section>

      <Section heading="Price and payment">
        <p>
          Kawm Hmoob is currently <strong>free</strong>. Paid features or
          subscriptions may be introduced in the future. If they are, the terms,
          price, and any free-trial conditions will be shown clearly before you’re
          asked to pay, and these terms will be updated.
        </p>
      </Section>

      <Section heading="“As is” — no warranty">
        <p>
          The app is provided <strong>“as is” and “as available,”</strong> without
          warranties of any kind, express or implied. We don’t guarantee that it
          will be accurate, uninterrupted, error-free, or that your progress will
          never be lost. This matters especially given the app’s beta status.
        </p>
      </Section>

      <Section heading="Limitation of liability">
        <p>
          To the fullest extent allowed by law, Kawm Hmoob and its developer are
          not liable for any indirect, incidental, or consequential damages arising
          from your use of the app. Because the app is free today, our total
          liability to you is limited accordingly.
        </p>
      </Section>

      <Section heading="Ending your use">
        <p>
          You can stop using the app and delete your account at any time. We may
          suspend or end access for anyone who violates these terms or misuses the
          app.
        </p>
      </Section>

      <Section heading="Governing law">
        <p>
          {/* ⚠️ Set this to your actual jurisdiction before relying on it. */}
          These terms are governed by the laws of the developer’s home
          jurisdiction in the United States, without regard to conflict-of-law
          rules.
        </p>
      </Section>

      <Section heading="Contact">
        <p>
          Questions about these terms? Email{' '}
          <a href={`mailto:${CONTACT}`} className="text-clay-700 underline">{CONTACT}</a>.
        </p>
      </Section>
    </LegalLayout>
  )
}
