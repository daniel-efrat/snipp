import { NoteForm } from "./NoteForm"

export function NewNote({ onSubmit, onAddTag, availableTags }) {
  return (
    <>
      <h1 className="mb-4">חדש</h1>
      <NoteForm
        onSubmit={onSubmit}
        onAddTag={onAddTag}
        availableTags={availableTags}
      />
    </>
  )
}