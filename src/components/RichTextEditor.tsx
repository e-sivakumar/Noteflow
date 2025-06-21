// // src/components/RichTextEditor.tsx
// import { useEditor, EditorContent } from '@tiptap/react'
// import StarterKit from '@tiptap/starter-kit'

// interface Props {
//   value: string
//   onChange: (html: string) => void
// }

// export default function RichTextEditor({ value, onChange }: Props) {
//   const editor = useEditor({
//     extensions: [StarterKit],
//     content: value,
//     onUpdate: ({ editor }) => {
//       onChange(editor.getHTML())
//     },
//   })

//   return (
//     <div className="bg-white dark:bg-gray-700 rounded shadow-sm">
//       <EditorContent editor={editor} />
//     </div>
//   )
// }