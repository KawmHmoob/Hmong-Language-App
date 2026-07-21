# New-User Onboarding + Speaker Demographics

## What
After signup, a user lands on `/onboarding` — a one-page set of **optional**
questions: age range, gender, dialect, relationship to Hmong, ethnicity, and
region. Answers personalize the app AND become speaker labels for the voice
corpus (future-implementations/03 §9).

Stored on `profiles` (all nullable). `onboarded_at` is stamped on complete OR
skip, so no one is sent through it twice.

## The dual purpose, stated plainly
This is the demographic-collection-for-corpus-labeling scenario the corpus
strategy has flagged from the start (notes/03 §6). It's legitimate and valuable
— native-only speech corpora lack exactly this metadata — but only lawful if
three things hold, so they're built in, not left to remember.

### 1. Everything is optional
Every field has **"Prefer not to say"**, and the whole page has **"Skip for
now."** Blank is stored as null ("never answered"); the sentinel is stored as
`'prefer_not_to_say'` ("actively declined") — a real distinction for analysis.

This isn't just compliance, it's data quality. The request is "answer
truthfully"; people answer truthfully when it's optional and the purpose is
clear, and lie when a sensitive field is a forced gate. Optional produces
*better* labels.

### 2. `ethnicity` is a special category — it must never be required
Under GDPR Art. 9 (and similar), race/ethnicity is a *special category* of
personal data with higher protection than anything else collected here.
Requiring it to use a language app is a genuine legal problem. So it's optional,
labeled "never shared publicly," and carries no NOT NULL / CHECK anywhere.

### 3. The purpose is disclosed before the questions
The intro says the answers tailor lessons **and** help label an open Hmong voice
dataset. That sentence is the consent hook — collecting demographics *to label
recordings* is a data-collection purpose, and stating it is what separates this
from the §6 liability. **Do not soften it to "just for personalization."**

## The one field worth having beyond what was asked
`hmong_relationship` — native / heritage / some-family / learner. This is the
**highest-value corpus label**: it separates native-adjacent speech from L2
learner speech, which is the exact axis a pronunciation model needs and which
native-only datasets can't provide (notes/03 §3). Worth more than ethnicity for
the actual modeling.

## Wiring
- **Schema:** six nullable columns added in the profiles reconcile block
  (`age_range, gender, ethnicity, hmong_relationship, region, onboarded_at`).
  No CHECK constraints, deliberately — unlike `dialect_preference`, these are
  written post-signup by the app, not by the trigger, so a new option can't
  fail a signup (the notes/68 trap).
- **AuthContext:** `rowToUser` and `updateProfile` extended to carry the fields.
- **Redirect, two paths:**
  - Immediate (email confirmation OFF): `RegisterForm` navigates to
    `/onboarding` on a live-session signup.
  - Deferred (confirmation ON): no session at signup, so `RegisterForm` can't
    navigate. Instead a **gate in `Layout`** sends any authed, un-onboarded user
    to `/onboarding` — which catches them after they confirm and log in.
- The gate waits on `authLoading` (a signed-in user would otherwise flash as
  guest and slip past it) and excludes `/onboarding` itself (no redirect loop).
  This is the first consumer of the `loading` flag notes/67 §4 said nothing read.

## Two things to know
- **"Under 18" is a selectable age.** It's captured, not blocked — but data from
  minors for model training is a heavier consent regime (parental consent under
  COPPA/GDPR). Before the corpus goes live, decide whether under-18 recordings
  are stored at all. Capturing the flag now is what lets you enforce that later.
- **Existing accounts have `onboarded_at = null`**, so on their next login the
  Layout gate routes them through onboarding once. Expected (they never did it),
  and one "Skip" clears it — but don't be surprised testing with your own
  account.

## Files
- `src/pages/Onboarding.jsx` — the page
- `src/components/Layout.jsx` — the onboarding gate
- `src/context/AuthContext.jsx` — fields in rowToUser + updateProfile
- `src/pages/RegisterForm.jsx` — post-signup redirect
- `instructions/supabase-schema.sql` — the six columns
