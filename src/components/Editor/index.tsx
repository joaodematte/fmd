'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { TiptapEditorProps } from './props';
import { TiptapEditorExtensions } from './extensions';

export default function Editor() {
  const editor = useEditor({
    extensions: TiptapEditorExtensions,
    editorProps: TiptapEditorProps,
    content: '<p>Hello World!</p>'
  });

  return (
    <div
      className="h-full w-full bg-white p-12"
      onClick={() => {
        editor?.chain().focus().run();
      }}
    >
      <EditorContent editor={editor} />
    </div>
  );
}
