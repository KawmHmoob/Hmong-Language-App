import { Link } from 'react-router-dom'
import LegalLayout, { Section } from '../components/common/LegalLayout.jsx'

// TERMS OF SERVICE — covers the Kawm Hmoob mobile app and this website.
// Starting-point template matched to what the product is: a free, early,
// solo-built educational app whose Hmong content is still being reviewed.
// The accuracy and "as is" sections are the load-bearing ones.
//
// ⚠️ NOT LEGAL ADVICE. Review before selling subscriptions. GOVERNING LAW is a
// placeholder — set your actual state. See notes/72.

const CONTACT = 'techkage@proton.me'
const UPDATED = 'November 9, 2026'
const link = 'text-clay-700 underline'

export default function Terms() {
  return (
    <LegalLayout title="Terms of Service" updated={UPDATED}>
      <Section heading="Agreement">
        <p>
          These terms apply to the Kawm Hmoob mobile app and this website
          (together, “Kawm Hmoob”). By using either, you agree to them. If you
          don’t agree, please don’t use Kawm Hmoob. Google Play’s own terms also
          apply to how you download the app.
        </p>
      </Section>

      <Section heading="What Kawm Hmoob is">
        <p>
          An <strong>educational app for learning the Hmong language</strong>, built
          and run by an individual developer. It is <strong>early in development</strong>:
          features will change, and some may not always work as intended.
        </p>
      </Section>

      <Section heading="Content accuracy — please read">
        <p>
          The Hmong content — words, translations, tones, recordings, and example
          sentences — is <strong>still being reviewed with native speakers</strong>,
          and some of it may be incomplete or wrong. Use Kawm Hmoob as a learning aid,
          not an authoritative reference, and check anything important with a fluent
          speaker. Corrections are welcome via the{' '}
          <Link to="/contact" className={link}>contact page</Link>.
        </p>
      </Section>

      <Section heading="Your account">
        <p>
          You’re responsible for keeping your login secure and for activity on your
          account. Usernames are visible to other users (for example, on
          leaderboards), so don’t choose one that is offensive or impersonates
          someone else. You can delete your account at any time — see the{' '}
          <Link to="/privacy#delete-account" className={link}>Privacy Policy</Link>.
        </p>
      </Section>

      <Section heading="Acceptable use">
        <p>You agree not to:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>break the law or infringe anyone’s rights while using Kawm Hmoob;</li>
          <li>disrupt, overload, reverse-engineer, or try to gain unauthorized access to the app, its servers, or other users’ data;</li>
          <li>manipulate points, streaks, or leaderboards through bugs or automation;</li>
          <li>use someone else’s account without permission.</li>
        </ul>
      </Section>

      <Section heading="Our content">
        <p>
          The app’s design, code, lessons, recordings, and other original materials
          belong to Kawm Hmoob. You may use them for your own personal learning.
          Please don’t copy, resell, or redistribute them without permission. The
          Hmong language itself is shared cultural heritage, and we present it with
          that respect.
        </p>
      </Section>

      <Section heading="Price and payment">
        <p>
          Kawm Hmoob is currently <strong>free</strong>. Paid features or
          subscriptions may be added later. If they are:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>the price and any free-trial terms will be shown before you’re asked to pay;</li>
          <li>payment is processed and billed by <strong>Google Play</strong> under its terms;</li>
          <li>subscriptions renew automatically until cancelled, and you can cancel any time in the Google Play Store’s subscription settings;</li>
          <li>refunds are handled under Google Play’s refund policy.</li>
        </ul>
      </Section>

      <Section heading="“As is” — no warranty">
        <p>
          Kawm Hmoob is provided <strong>“as is” and “as available,”</strong> without
          warranties of any kind, express or implied. We don’t guarantee that it will
          be accurate, uninterrupted, or error-free, or that progress will never be
          lost.
        </p>
      </Section>

      <Section heading="Limitation of liability">
        <p>
          To the fullest extent the law allows, Kawm Hmoob and its developer are not
          liable for indirect, incidental, or consequential damages arising from your
          use of the app or website. Our total liability to you is limited to the
          amount you paid us, if any, in the 12 months before the claim.
        </p>
      </Section>

      <Section heading="Ending your use">
        <p>
          You can stop using Kawm Hmoob and delete your account at any time. We may
          suspend or close accounts that break these terms.
        </p>
      </Section>

      <Section heading="Changes to these terms">
        <p>
          We may update these terms as the app changes and will change the date at
          the top when we do. Continuing to use Kawm Hmoob after an update means you
          accept it.
        </p>
      </Section>

      <Section heading="Governing law">
        <p>
          {/* ⚠️ Replace with your actual state before relying on this. */}
          These terms are governed by the laws of the developer’s home state in the
          United States, without regard to conflict-of-law rules.
        </p>
      </Section>

      <Section heading="Contact">
        <p>
          Questions about these terms? Email{' '}
          <a href={`mailto:${CONTACT}`} className={link}>{CONTACT}</a>.
        </p>
      </Section>
    </LegalLayout>
  )
}
