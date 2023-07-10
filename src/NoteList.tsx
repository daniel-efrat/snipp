import { useMemo, useState } from "react"
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Stack,
} from "react-bootstrap"
import { Link } from "react-router-dom"
import ReactSelect from "react-select"
import { Tag } from "./App"
import styles from "./styles/NoteList.css"
import ReactMarkdown from "react-markdown"
import { FiEdit, FiCopy, FiSave, FiTrash2 } from "react-icons/fi"
import { AiOutlineTags, AiOutlinePlus } from "react-icons/Ai"
import Top from "./Top"
type SimplifiedNote = {
  tags: Tag[]
  title: string
  id: string
  markdown: string
}

type NoteListProps = {
  availableTags: Tag[]
  notes: SimplifiedNote[]
  onDeleteTag: (id: string) => void
  onUpdateTag: (id: string, label: string) => void
}

type EditTagsModalProps = {
  show: boolean
  availableTags: Tag[]
  handleClose: () => void
  onDeleteTag: (id: string) => void
  onUpdateTag: (id: string, label: string) => void
}

export function NoteList({
  availableTags,
  notes,
  onUpdateTag,
  onDeleteTag,
}: NoteListProps) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [title, setTitle] = useState("")
  const [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState(false)


  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      return (
        (title === "" ||
          note.title.toLowerCase().includes(title.toLowerCase())) &&
        (selectedTags.length === 0 ||
          selectedTags.every(tag =>
            note.tags.some(noteTag => noteTag.id === tag.id)
          ))
      )
    })
  }, [title, selectedTags, notes])

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1>סְנִיפֶּטְס</h1>
        </Col>

        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Link to="/new">
              <Button variant="primary">
                <AiOutlinePlus />
              </Button>
            </Link>
            <Button
              onClick={() => setEditTagsModalIsOpen(true)}
              variant="outline-secondary"
            >
              <AiOutlineTags />
            </Button>
          </Stack>
        </Col>
      </Row>
      <Row>
        <Col>
          <Top />
        </Col>
      </Row>
      <Form>
        <Row className="mb-4">
          <Col>
            <Form.Group controlId="title">
              <Form.Label>חיפוש טקסט</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>חיפוש תגיות</Form.Label>
              <ReactSelect
                value={selectedTags.map((tag) => {
                  return { label: tag.label, value: tag.id }
                })}
                options={availableTags.map((tag) => {
                  return { label: tag.label, value: tag.id }
                })}
                onChange={(tags) => {
                  setSelectedTags(
                    tags.map((tag) => {
                      return { label: tag.label, id: tag.value }
                    })
                  )
                }}
                isMulti
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
        {filteredNotes.map((note) => (
          <Col key={note.id}>
            <NoteCard
              id={note.id}
              title={note.title}
              tags={note.tags}
              markdown={note.markdown}
            />
          </Col>
        ))}
      </Row>
      <EditTagsModal
        onUpdateTag={onUpdateTag}
        onDeleteTag={onDeleteTag}
        show={editTagsModalIsOpen}
        handleClose={() => setEditTagsModalIsOpen(false)}
        availableTags={availableTags}
      />
    </>
  )
}

function NoteCard({ id, title, tags, markdown }: SimplifiedNote) {
  const handleCopyClick = () => {
    navigator.clipboard.writeText(markdown).then(() => {
      console.log("Markdown text copied to clipboard")
    })
  }

  return (
    <Card className={`h-100 text-reset text-decoration-none ${styles.card}`}>
      <Card.Body>
        <Stack
          gap={2}
          className="align-items-center justify-content-between h-100"
        >
          <span className="fs-5">{title}</span>
          {tags.length > 0 && (
            <Stack
              gap={1}
              direction="horizontal"
              className="justify-content-center flex-wrap"
            >
              {tags.map((tag) => (
                <Badge className="text-truncate" key={tag.id}>
                  {tag.label}
                </Badge>
              ))}
            </Stack>
          )}
          <div className="note-content">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>
          <Stack direction="horizontal" gap={2}>
            {/* Edit button */}
            <Link to={`/${id}`}>
              <Button variant="primary"><FiEdit/></Button>
            </Link>
            {/* Copy button */}
            <Button variant="secondary" onClick={handleCopyClick}>
              <FiCopy />
            </Button>
          </Stack>
        </Stack>
      </Card.Body>
    </Card>
  )
}
function EditTagsModal({
  availableTags,
  handleClose,
  show,
  onDeleteTag,
  onUpdateTag,
}: EditTagsModalProps) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title><AiOutlineTags/></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Stack gap={2}>
            {availableTags.map(tag => (
              <Row key={tag.id}>
                <Col>
                  <Form.Control
                    type="text"
                    value={tag.label}
                    onChange={e => onUpdateTag(tag.id, e.target.value)}
                  />
                </Col>
                <Col xs="auto">
                  <Button
                    onClick={() => onDeleteTag(tag.id)}
                    variant="danger"
                  >
                    <FiTrash2/>
                  </Button>
                </Col>
              </Row>
            ))}
          </Stack>
        </Form>
      </Modal.Body>
    </Modal>
  )
}