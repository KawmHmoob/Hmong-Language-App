# Recording Manifest — Grammar · Conversational · Numbers & Time

Generated from `src/data/vocabulary.js`. **112 vocabulary clips + 7 greeting
phrases = 119 files.**

## Convention

    public/assets/audio/vocabulary/<categoryId>/<wordId>.mp3

The filename **is the word's id**, which is already globally unique and is saved
user data — so it can never drift the way `single`/`singular` did (notes/42).
Once recorded, the data field is pure interpolation:

    audioFile: 'vocabulary/pronouns/pronouns-i.mp3'

Bare path — `resolveSrc` in `useAudio.js` prepends `/assets/audio/`. Do **not**
lead with a slash and do **not** repeat `assets/audio`.

Record White Hmong (Hmoob Dawb), the dialect the whole dataset currently assumes.

---

## Grammar

### Pronouns — 9 clips

`vocabulary/pronouns/`

| File | Hmong | English |
|---|---|---|
| `pronouns-i.mp3` | kuv | I / me |
| `pronouns-you.mp3` | koj | you (one person) |
| `pronouns-he-she.mp3` | nws | he / she / it |
| `pronouns-we-two.mp3` | wb | we two (you and I) |
| `pronouns-you-two.mp3` | neb | you two |
| `pronouns-they-two.mp3` | nkawd | they two |
| `pronouns-we.mp3` | peb | we (three or more) |
| `pronouns-you-plural.mp3` | nej | you (three or more) |
| `pronouns-they.mp3` | lawv | they |

### High-Frequency Verbs — 20 clips

`vocabulary/verbs/`

| File | Hmong | English |
|---|---|---|
| `verbs-read.mp3` | nyeem | to read |
| `verbs-write.mp3` | sau | to write |
| `verbs-learn.mp3` | kawm | to learn, study, practice |
| `verbs-say.mp3` | hais | to say |
| `verbs-tell.mp3` | qhia | to tell, teach |
| `verbs-ask.mp3` | nug | to ask |
| `verbs-answer.mp3` | teb | to answer |
| `verbs-explain.mp3` | piav | to explain, narrate |
| `verbs-sit.mp3` | zaum | to sit |
| `verbs-stand.mp3` | sawv | to stand, wake up, get up |
| `verbs-open.mp3` | qhib | to open |
| `verbs-close.mp3` | kaw | to close |
| `verbs-flip.mp3` | nthuav | to flip a page, unfold |
| `verbs-go.mp3` | mus | to go |
| `verbs-talk.mp3` | tham | to talk |
| `verbs-let.mp3` | cia | to let, allow |
| `verbs-release.mp3` | tso | to let go, release, leave behind |
| `verbs-see.mp3` | pom | to see |
| `verbs-look.mp3` | ntsia | to look at |
| `verbs-watch.mp3` | saib | to watch |

### Tense Markers — 5 clips

`vocabulary/tense-markers/`

| File | Hmong | English |
|---|---|---|
| `tense-markers-progressive.mp3` | tab tom | currently (-ing) |
| `tense-markers-future.mp3` | yuav | will (future) |
| `tense-markers-past.mp3` | tau | already (past completed) |
| `tense-markers-still.mp3` | tseem | still |
| `tense-markers-completed.mp3` | lawm | completed (sentence-final) |

### Classifiers — 20 clips

`vocabulary/classifiers/`

| File | Hmong | English |
|---|---|---|
| `classifiers-tus.mp3` | tus | (classifier for people, animals & long thin individual things) |
| `classifiers-lub.mp3` | lub | (classifier for round or solid objects & general items) |
| `classifiers-phau.mp3` | phau | (classifier for books & bound documents) |
| `classifiers-zaj.mp3` | zaj | (classifier for songs, stories, speeches & dragon-like figures) |
| `classifiers-txoj.mp3` | txoj | (classifier for long flexible things: roads, rivers, lives, rules) |
| `classifiers-rab.mp3` | rab | (classifier for tools, weapons & long rigid implements) |
| `classifiers-hnab.mp3` | hnab | (classifier for bags & sacks) |
| `classifiers-daim.mp3` | daim | (classifier for flat objects: paper, cloth, mats, maps, land) |
| `classifiers-khob.mp3` | khob | (classifier for cups/glasses of liquid) |
| `classifiers-nplooj.mp3` | nplooj | (classifier for leaves & pages) |
| `classifiers-nkawm.mp3` | nkawm | (classifier for pairs: shoes, chopsticks, married couples) |
| `classifiers-pob.mp3` | pob | (classifier for small round/lumped items: balls, stones, seeds) |
| `classifiers-txhais.mp3` | txhais | (classifier for one of a paired body part: hand, arm, leg, eye) |
| `classifiers-thooj.mp3` | thooj | (classifier for chunks, blocks, slabs & segments) |
| `classifiers-fab.mp3` | fab | (classifier for sides, sections, divisions & directions) |
| `classifiers-leej.mp3` | leej | (classifier for people, formal/respectful) |
| `classifiers-tsob.mp3` | tsob | (classifier for plants, trees & clumps of vegetation) |
| `classifiers-theem.mp3` | theem | (classifier for steps, levels, tiers & floors) |
| `classifiers-yim.mp3` | yim | (classifier for households / families) |
| `classifiers-cov.mp3` | cov | (plural classifier / "the (group of)") |

### Demonstratives — 5 clips

`vocabulary/demonstratives/`

| File | Hmong | English |
|---|---|---|
| `demonstratives-this.mp3` | no | this |
| `demonstratives-that.mp3` | ntawd | that (over there) |
| `demonstratives-that-near-you.mp3` | ko | that (near the listener) |
| `demonstratives-here.mp3` | ntawm no | here |
| `demonstratives-there.mp3` | ntawm ntawd | there |

### Yog — To Be — 4 clips

`vocabulary/yog-to-be/`

| File | Hmong | English |
|---|---|---|
| `yog-to-be-is.mp3` | yog | to be / equals |
| `yog-to-be-is-not.mp3` | tsis yog | is not / no |
| `yog-to-be-question.mp3` | puas yog? | is it? / right? |
| `yog-to-be-located.mp3` | nyob | to be located at |

## Conversational

### Sib — Reciprocals — 6 clips

`vocabulary/reciprocals/`

| File | Hmong | English |
|---|---|---|
| `reciprocals-love.mp3` | sib hlub | to love each other |
| `reciprocals-help.mp3` | sib pab | to help each other |
| `reciprocals-fight.mp3` | sib ntaus | to fight each other |
| `reciprocals-talk.mp3` | sib tham | to talk with each other |
| `reciprocals-see.mp3` | sib pom | to see each other |
| `reciprocals-meet-again.mp3` | sib ntsib dua | to meet again (goodbye) |

### Greetings and Farewells — 7 clips

`vocabulary/greetings/` — **these words have no vocabulary category yet.**
They live inline in `src/data/lessons/greetings-farewells.js` as `examples`
items, so there is no `vocab:` to gate a quiz on and nothing for Words to
drill. Recommend promoting them to a real category before wiring.

| File | Hmong | English |
|---|---|---|
| `greetings-hello.mp3` | Nyob zoo | Hello |
| `greetings-how-are-you.mp3` | Koj puas nyob zoo? | How are you? |
| `greetings-i-am-well.mp3` | Kuv nyob zoo | I am well |
| `greetings-thank-you.mp3` | Ua tsaug | Thank you |
| `greetings-goodbye.mp3` | Sib ntsib dua | See you again / Goodbye |
| `greetings-go-well.mp3` | Mus zoo | Go well (to the one leaving) |
| `greetings-stay-well.mp3` | Nyob zoo | Stay well (to the one staying) |

## Numbers & Time

### Numbers — 10 clips

`vocabulary/numbers/`

| File | Hmong | English |
|---|---|---|
| `numbers-1.mp3` | ib | one |
| `numbers-2.mp3` | ob | two |
| `numbers-3.mp3` | peb | three |
| `numbers-4.mp3` | plaub | four |
| `numbers-5.mp3` | tsib | five |
| `numbers-6.mp3` | rau | six |
| `numbers-7.mp3` | xya | seven |
| `numbers-8.mp3` | yim | eight |
| `numbers-9.mp3` | cuaj | nine |
| `numbers-10.mp3` | kaum | ten |

### Money & Shopping — 14 clips

`vocabulary/money/`

| File | Hmong | English |
|---|---|---|
| `money-kim-npaum-licas.mp3` | kim npaum li cas? | How much does it cost? (lit. "expensive how much?") |
| `money-pestsawg.mp3` | pes tsawg? | How much? / How many? |
| `money-duaslas.mp3` | duas las | dollar |
| `money-xees.mp3` | xees | cent |
| `money-kim.mp3` | kim | expensive (adjective) |
| `money-pheejyig.mp3` | pheej yig | cheap, inexpensive (adjective) |
| `money-yuav.mp3` | yuav | (verb: to buy) |
| `money-thim.mp3` | thim | (verb: to return, give back; refund) |
| `money-muag.mp3` | muag | (verb: to sell) |
| `money-tus-nqi.mp3` | nqi | the price; cost; fee |
| `money-txo-nqi.mp3` | txo nqi | discount; to lower the price |
| `money-lov-nqi.mp3` | lov nqi | sale; price reduction |
| `money-nyiaj.mp3` | nyiaj | money; silver |
| `money-tshev.mp3` | tshev | check (payment) |

### Timeframes & Time of Day — 19 clips

`vocabulary/timeframes/`

| File | Hmong | English |
|---|---|---|
| `time-ib-tag-hmo.mp3` | ib tag hmo | midnight |
| `time-ib-hmos.mp3` | ib hmos | one night / all night long |
| `time-tavsu.mp3` | tav su | noon, midday |
| `time-tavsu-dua.mp3` | tav su dua | afternoon (lit. "past noon") |
| `time-sawv-ntxov.mp3` | sawv ntxov | morning; a.m. |
| `time-tsaus-ntuj.mp3` | tsaus ntuj | night, evening; p.m. (lit. "dark sky") |
| `time-nruab-hnub.mp3` | nruab hnub | daytime |
| `time-hmo-ntuj.mp3` | hmo ntuj | nighttime |
| `time-tagkis-no.mp3` | tag kis no | this morning |
| `time-ib-pliag.mp3` | ib pliag | in a moment, later, shortly |
| `time-teev.mp3` | teev | hour; o'clock |
| `time-feeb.mp3` | feeb | minute |
| `time-teevsij.mp3` | teev sij | clock; watch |
| `time-hnub-hnub.mp3` | hnub hnub | three days ago |
| `time-hnub-hmos.mp3` | hnub hmos | two days ago |
| `time-naghmo.mp3` | nag hmo | yesterday |
| `time-tagkis.mp3` | tag kis | tomorrow (also: morning) |
| `time-nagkis.mp3` | nag kis | the day after tomorrow (two days from now) |
| `time-puagnraus.mp3` | puag nraus | three days from now |

---

**Total: 119 files.**
