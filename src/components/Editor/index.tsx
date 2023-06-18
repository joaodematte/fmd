'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { TiptapEditorProps } from './props';
import { TiptapEditorExtensions } from './extensions';
import { useCompletion } from 'ai/react';
import { toast } from 'sonner';
import { useEffect, useRef } from 'react';

export default function Editor() {
  const prev = useRef<string>('');

  const editor = useEditor({
    extensions: TiptapEditorExtensions,
    editorProps: TiptapEditorProps,
    content: '<p>Hello World!</p>'
  });

  const { complete, completion, isLoading, stop } = useCompletion({
    id: 'novel',
    api: '/api/generate',
    onResponse: (response) => {
      if (response.status === 429) {
        toast.error('You have reached your request limit for the day.');
        return;
      }
    },
    onError: () => {
      toast.error('Something went wrong.');
    }
  });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || (e.metaKey && e.key === 'z')) stop();
    };

    if (isLoading) document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [stop, isLoading, editor, completion.length]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && editor?.isFocused && editor.getText().length >= 1) {
        e.preventDefault();

        complete(editor.getText());
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [complete, editor?.isFocused, editor]);

  useEffect(() => {
    const diff = completion.slice(prev.current.length);

    prev.current = completion;

    editor?.commands.insertContent(diff);
  }, [isLoading, editor, completion]);

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
