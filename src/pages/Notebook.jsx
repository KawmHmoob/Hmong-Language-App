import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Tabs from '../components/Tabs.jsx'
import { useNotebook } from '../context/NotebookContext.jsx'
import { categories } from '../data/vocabulary.js'

const tabs = [
  { id: 'saved', label: 'Saved Words' },
  { id: 'notes', label: 'Notes' },
]

export default function Notebook() {
  const { tab } = useParams()
  return (
    <>
      <div className="mb-8">
        <h2 className="font-serif text-4xl text-stone-900 mb-2">Notebook</h2>
        <p className="text-stone-700">
          A place for words you want to remember and notes from your reading.
        </p>
      </div>
      <Tabs basePath="/notebook" tabs={tabs} />
      {tab === 'saved' && <SavedWords />}
      {tab === 'notes' && <Notes />}
    </>
  )
}

function SavedWords() {
  const { savedWords, unsaveWord, updateWordNote } = useNotebook()
  const ids = Object.keys(savedWords)

  // Build a flat lookup once per render â€” small data, fine to recompute.
  const wordById = {}
  for (const cat of categories) {
    for (const w of cat.words) {
      wordById[w.id] = { ...w, _category: cat }
    }
  }

  if (ids.length === 0) {
    return (
      <EmptyState
        icon="ðŸ“–"
        title="No saved words yet"
        message="From any word's detail page, tap 'Save to notebook' to add it here."
      />
    )
  }

  return (
    <ul className="space-y-3">
      {ids.map((id) => {
        const w = wordById[id]
        if (!w) return null
        return (
          <SavedWordItem
            key={id}
            word={w}
            entry={savedWords[id]}
            onUpdate={(note) => updateWordNote(id, note)}
            onRemove={() => unsaveWord(id)}
          />
        )
      })}
    </ul>
  )
}

function SavedWordItem({ word, entry, onUpdate, onRemove }) {
  const [note, setNote] = useState(entry.note)
  const [editing, setEditing] = useState(false)

  const save = () => {
    onUpdate(note)
    setEditing(false)
  }

  return (
    <li className="surface p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <Link
          to={`/vocabulary/${word._category.id}/${word.id}`}
          className="hover:opacity-80"
        >
          <div className="font-serif text-xl text-clay-700">{word.hmongRPA}</div>
          <div className="text-sm text-stone-600">{word.english}</div>
        </Link>
        <button
          onClick={onRemove}
          className="text-xs text-stone-500 hover:text-red-700"
        >
          Remove
        </button>
      </div>
      {editing ? (
        <div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Your note about this wordâ€¦"
            className="w-full rounded border border-cream-300 bg-cream-50 p-3 text-sm focus:outline-none focus:border-clay-500"
            rows={3}
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <button onClick={save} className="btn-primary text-xs px-3 py-1.5">Save</button>
            <button
              onClick={() => {
                setNote(entry.note)
                setEditing(false)
              }}
              className="btn-ghost text-xs px-3 py-1.5"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => setEditing(true)}
          className="text-sm text-stone-700 italic cursor-pointer hover:text-stone-900"
        >
          {entry.note || (
            <span className="text-stone-500">+ Add a note</span>
          )}
        </div>
      )}
    </li>
  )
}

function Notes() {
  const { notes, createNote } = useNotebook()

  return (
    <>
      <div className="flex justify-end mb-3">
        <button
          onClick={() => createNote({ title: 'Untitled note', body: '' })}
          className="btn-primary"
        >
          + New Note
        </button>
      </div>
      {notes.length === 0 ? (
        <EmptyState
          icon="ðŸ“"
          title="No notes yet"
          message="Click 'New Note' to start writing."
        />
      ) : (
        <ul className="space-y-3">
          {notes.map((n) => (
            <NoteItem key={n.id} note={n} />
          ))}
        </ul>
      )}
    </>
  )
}

function NoteItem({ note }) {
  const { updateNote, deleteNote } = useNotebook()
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(note.title)
  const [body, setBody] = useState(note.body)

  const save = () => {
    updateNote(note.id, { title, body })
    setEditing(false)
  }

  if (!editing) {
    return (
      <li
        className="surface surface-hover p-5 cursor-pointer"
        onClick={() => setEditing(true)}
      >
        <h3 className="font-serif text-xl text-stone-900 mb-1">
          {note.title || 'Untitled'}
        </h3>
        {note.body && (
          <p className="text-sm text-stone-700 line-clamp-3 whitespace-pre-wrap">
            {note.body}
          </p>
        )}
        <p className="text-xs text-stone-500 mt-3">
          Updated {note.updatedAt.slice(0, 10)}
        </p>
      </li>
    )
  }

  return (
    <li className="surface p-5">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full rounded border border-cream-300 bg-cream-50 px-3 py-2 text-base font-serif mb-2 focus:outline-none focus:border-clay-500"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write hereâ€¦"
        rows={6}
        className="w-full rounded border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:outline-none focus:border-clay-500"
      />
      <div className="flex gap-2 mt-2">
        <button onClick={save} className="btn-primary text-xs px-3 py-1.5">Save</button>
        <button
          onClick={() => {
            setTitle(note.title)
            setBody(note.body)
            setEditing(false)
          }}
          className="btn-ghost text-xs px-3 py-1.5"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            if (window.confirm('Delete this note?')) deleteNote(note.id)
          }}
          className="ml-auto text-xs text-stone-500 hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </li>
  )
}

function EmptyState({ icon, title, message }) {
  return (
    <div className="rounded-md border-2 border-dashed border-cream-400 bg-cream-50/60 p-12 text-center">
      <div className="text-5xl mb-3 opacity-70">{icon}</div>
      <h3 className="font-serif text-xl text-stone-900">{title}</h3>
      <p className="text-sm text-stone-600 mt-1">{message}</p>
    </div>
  )
}
