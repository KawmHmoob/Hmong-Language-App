import { useState } from 'react'
import Breadcrumbs from '../components/common/Breadcrumbs.jsx'
import { MailIcon, CheckIcon } from '../components/icons/index.jsx'

// Contact page — just the email, plainly. No form: a form implies a backend
// that receives it, which doesn't exist. A `mailto:` and a copy button send the
// message somewhere real (the user's own mail client) instead of a void.

const EMAIL = 'techkage@proton.me'

export default function Contact() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard blocked (insecure context / permissions) — the mailto link
      // and the visible address still work, so fail quietly.
    }
  }

  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />

      <div className="max-w-xl mx-auto text-center py-8">
        <span className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-clay-600/10 text-clay-700 mb-5">
          <MailIcon size={26} />
        </span>

        <h2 className="font-display text-4xl sm:text-5xl text-stone-900 mb-3">
          Get in touch
        </h2>
        <p className="text-stone-700 leading-relaxed mb-8">
          Questions, bugs, a word that sounds wrong, or just want to say hello —
          I read every message. Kawm Hmoob is built by one person, so a reply may
          take a little while.
        </p>

        <div className="surface p-6 sm:p-8">
          <p className="text-xs uppercase tracking-wider text-stone-600 mb-2">Email</p>
          <a
            href={`mailto:${EMAIL}`}
            className="font-display text-2xl sm:text-3xl text-clay-700 hover:text-clay-800 break-all"
          >
            {EMAIL}
          </a>

          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <a href={`mailto:${EMAIL}`} className="btn-primary gap-2">
              <MailIcon size={16} />
              Send an email
            </a>
            <button onClick={copy} className="btn-secondary gap-2">
              <CheckIcon size={16} />
              {copied ? 'Copied!' : 'Copy address'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
