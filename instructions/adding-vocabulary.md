# Adding Vocabulary

All vocabulary lives in `src/data/vocabulary.js`. Edit the file by hand; no build step or migration is needed — just save and the app reloads.

## Schema

```js
{
  id: 'animals-dog',          // REQUIRED — globally unique. Convention: `<categoryId>-<english-slug>`
  hmongRPA: 'dev',            // REQUIRED — the word in Romanized Popular Alphabet
  english: 'dog',             // REQUIRED
  category: 'animals',        // REQUIRED — must match the parent category's id
  tags: ['mammal', 'pet'],    // REQUIRED — empty array if none

  whiteHmong: 'dev',          // optional — alternate spelling in White Hmong
  greenHmong: 'dev',          // optional — alternate spelling in Green Hmong
  audioFile: 'animals-dog.mp3', // optional — see audio-files.md
  exampleSentence: { hmong: '…', english: '…' }, // optional
  image: 'animals-dog.jpg',   // optional, not yet rendered anywhere
}
```

## Workflow for entering from a book

1. Open `src/data/vocabulary.js`.
2. Find the right `categories[]` entry (or add a new category — see below).
3. Append a word object to its `words: [...]` array.
4. Use the `id` convention `<categoryId>-<english-keyword>`. If the keyword has spaces, hyphenate (`family-older-brother`).
5. Save. The dev server hot-reloads.

## Adding a new category

```js
{
  id: 'colors',
  title: 'Colors',
  description: 'Colors of objects.',
  emoji: '🎨',
  words: [],
}
```

Add it to the `categories` array in `vocabulary.js`. It immediately appears on `/vocabulary` with an empty-state card until you fill in `words`.

## Bulk import tip

For a large batch from a spreadsheet, export the sheet as CSV and use a small Node script to convert each row to a word object. Example shape:

```
csv columns: category,id,hmongRPA,english,whiteHmong,greenHmong,tags,audioFile
```

Then `node scripts/csv-to-vocab.js` could rewrite the `words` array. (Script not included — write when needed.)

## Validation

The app trusts the schema; there's no runtime validation. If you see a word render with "undefined", check that the field name matches the schema exactly (case-sensitive: `hmongRPA`, not `hmongRpa`).
