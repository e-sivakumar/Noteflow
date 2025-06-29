import React, { useEffect } from 'react'
import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import { FiBold, FiItalic, FiUnderline, FiLink, FiRotateCcw, FiRotateCw } from 'react-icons/fi'
import { FaListUl, FaListOl } from 'react-icons/fa'

interface Props {
  content: string
  onUpdate: (html: string) => void
  className?: string
}

export default function RichTextEditor({ content, onUpdate, className = '' }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      TextStyle,
      Color,
    ],
    content,
    onUpdate: ({ editor }) => onUpdate(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg m-0 focus:outline-none dark:prose-invert',
      },
    },
  })

  // sync external content changes
  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content, false)
    }
  }, [content, editor])

  if (!editor) return null

  // helper to render toolbar buttons
  function MenuBar({ editor }: { editor: Editor }) {
    const btn = (cmd: () => void, Icon: React.ReactNode, isActive?: boolean) => (
      <button
        // onClick={() => cmd()}
        onMouseDown={(e)=>{
            e.preventDefault()
            cmd()
        }}
        className={`p-2 rounded bg-gray-500 dark:bg-gray-500' 
            ${
          isActive ? 'bg-gray-800 dark:bg-gray-900 hover:bg-gray-800 hover:dark:bg-gray-900' : 'hover:bg-gray-400 dark:hover:bg-gray-600 '
        }`}
      >
        {Icon}
      </button>
    )

    return (
      <div className="flex flex-wrap gap-1 p-2 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700 rounded-t">
        {btn(() => editor.chain().focus().toggleBold().run(), <FiBold />, editor.isActive('bold'))}
        {btn(() => editor.chain().focus().toggleItalic().run(), <FiItalic />, editor.isActive('italic'))}
        {btn(() => editor.chain().focus().toggleUnderline().run(), <FiUnderline />, editor.isActive('underline'))}
        {btn(
          () => {
            const url = window.prompt('Enter URL')
            if (url) editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
          },
          <FiLink />,
          editor.isActive('link'),
        )}
        {btn(() => editor.chain().focus().toggleBulletList().run(), <FaListUl />, editor.isActive('bulletList'))}
        {btn(() => editor.chain().focus().toggleOrderedList().run(), <FaListOl />, editor.isActive('orderedList'))}
        {btn(() => editor.chain().focus().undo().run(), <FiRotateCcw />)}
        {btn(() => editor.chain().focus().redo().run(), <FiRotateCw />)}
      </div>
    )
  }

  return (
    <div className={`${className} shadow-sm`}>
      <MenuBar editor={editor} />
        <EditorContent 
        editor={editor} 
        className="p-4 bg-white h-60 overflow-y-auto dark:bg-gray-600 min-h-[200px] prose dark:prose-invert cursor-text" 
        onClick={() => editor.chain().focus().run()}
        />
    </div>
  )
}

