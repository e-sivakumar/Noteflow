import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  FiChevronLeft,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiMoreVertical,
  FiClock,
} from 'react-icons/fi'
import { FaThumbtack } from 'react-icons/fa'
import { MdArchive, MdUnarchive } from 'react-icons/md'
import Modal from '../components/Modal'
import { useModal } from '../hooks/useModal'
import RichTextEditor from '../components/RichTextEditor'
import { useUpdateNote, useDeleteNote, usePinNote, useUnarchiveNote, useArchiveNote, useUnPinNote } from '../hooks/useNotes'
import { getNotes } from '../api/notes'
import { useQuery } from '@tanstack/react-query'

export default function NoteViewPage() {
  const { folderId, noteId } = useParams<{ folderId: string; noteId: string }>()
  const navigate = useNavigate()

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['getNotes', noteId],
    queryFn: () => getNotes(noteId as string),
    enabled: !!noteId,
  })

  // Mutations
  const updateNote = useUpdateNote()
  const deleteNote = useDeleteNote()
  const pinNote = usePinNote()
  const unPinNote = useUnPinNote()
  const archiveNote = useArchiveNote()
  const unarchiveNote = useUnarchiveNote()

  // Modal and edit state
  const { isOpen, open, close } = useModal()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('<p></p>')
  const [showActions, setShowActions] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (note) {
      setTitle(note.name)
      setContent(note.content || '<p></p>')
    }
  }, [note])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (isError || !note) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="text-red-500 text-lg mb-2">⚠️ Error loading note</div>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-700 underline"
        >
          Go back
        </button>
      </div>
    )
  }

  const handleDelete = async () => {
    await deleteNote.mutateAsync(noteId!)
    navigate(`/folder/${folderId}`, { replace: true })
  }

  const handleSave = async () => {
    await updateNote.mutateAsync({
      id: noteId!,
      data: { name: title, content },
    })
    close()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="mb-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex bg-transparent items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors mb-4 group"
        >
          <FiChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to notes</span>
        </button>

        {/* Note Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
                  {note.name}
                </h1>
                {note.isPinned && (
                  <FaThumbtack className="text-blue-600 dark:text-blue-400 flex-shrink-0" size={16} />
                )}
                {note.isArchived && (
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded-full text-xs font-medium">
                    Archived
                  </div>
                )}
              </div>
              
              {/* Metadata */}
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                {note.updatedAt && (
                  <div className="flex items-center gap-1">
                    <FiClock size={14} />
                    <span>Updated {formatDate(note.updatedAt)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 ml-4">
              {/* Pin/Unpin */}
              <button
                onClick={() => note.isPinned ? unPinNote.mutate({id: noteId!}) : pinNote.mutate({id: noteId!})}
                className={`
                    hidden sm:block 
                    p-2 rounded-lg transition-colors ${
                  note.isPinned
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                title={note.isPinned ? 'Unpin note' : 'Pin note'}
              >
                <FaThumbtack size={16} />
              </button>

              {/* Archive/Unarchive */}
              <button
                onClick={() => note.isArchived ? unarchiveNote.mutate({id: noteId!}) : archiveNote.mutate({id: noteId!})}
                className={`
                    hidden sm:block
                    p-2 rounded-lg transition-colors ${
                  note.isArchived
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                title={note.isArchived ? 'Unarchive note' : 'Archive note'}
              >
                {note.isArchived ? <MdUnarchive size={16} /> : <MdArchive size={16} />}
              </button>

              {/* Edit */}
              <button
                onClick={open}
                className="
                hidden sm:block
                p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-700 transition-colors"
                title="Edit note"
              >
                <FiEdit2 size={16} />
              </button>
              <button
                      onClick={() => {
                        setShowDeleteConfirm(true)
                        setShowActions(false)
                      }}
                      className="hidden sm:block hover:border-red-300 bg-red-400/20 p-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors "
                    >
                      <FiTrash2 size={16} />
                    </button>

              {/* More Actions */}
              <div className="block sm:hidden relative">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title="More actions"
                >
                  <FiMoreVertical size={16} />
                </button>

                {showActions && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-10">
                    <button
                onClick={() => note.isPinned ? unPinNote.mutate({id: noteId!}) : pinNote.mutate({id: noteId!})}
                className={`
                    bg-transparent w-full px-4 py-2 text-left transition-colors flex items-center gap-2 ${
                  note.isPinned
                    ? 'hover:bg-blue-100 hover:dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : ' text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                title={note.isPinned ? 'Unpin note' : 'Pin note'}
              >
                <FaThumbtack size={16} className={note.isPinned ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'} />
                {note.isPinned ? 'Pinned' : 'Pin'}
              </button>

              {/* Archive/Unarchive */}
              <button
                onClick={() => note.isArchived ? unarchiveNote.mutate({id: noteId!}) : archiveNote.mutate({id: noteId!})}
                className={`
                    bg-transparent w-full px-4 py-2 text-left transition-colors flex items-center gap-2 ${
                  note.isArchived
                    ? 'hover:bg-yellow-100 hover:dark:bg-yellow-900/20 text-blue-600 dark:text-blue-400'
                    : ' text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                title={note.isArchived ? 'Unarchive note' : 'Archive note'}
              >
                {note.isArchived ? <MdUnarchive size={16} className='text-blue-600 dark:text-blue-400' /> : <MdArchive size={16} className='text-gray-600 dark:text-gray-300'/>}
                {note.isArchived ? 'Archived' : 'Archive'}
              </button>
              <button
                onClick={
                    ()=>{
                        setShowActions(!showActions)
                        open()
                    }
                }
                className="bg-transparent w-full px-4 py-2 text-left text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center gap-2"
                title="Edit note"
              >
                <FiEdit2 size={16} />
                Edit
              </button>
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(true)
                        setShowActions(false)
                      }}
                      className=" hover:border-red-300 bg-transparent w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                    >
                      <FiTrash2 size={16} />
                      Delete 
                    </button>
                    
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: note.content || '<p>No content</p>' }} />
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onClose={close} title="Edit Note">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter note title..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content
            </label>
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <RichTextEditor
                content={content}
                onUpdate={setContent}
                className="min-h-[300px]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={close}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={updateNote.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {updateNote.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                <FiTrash2 className="text-red-600 dark:text-red-400" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete Note
              </h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete "{note.name}"? This action cannot be undone.
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteNote.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {deleteNote.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 size={16} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close actions menu */}
      {showActions && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowActions(false)}
        />
      )}
    </div>
  )
}