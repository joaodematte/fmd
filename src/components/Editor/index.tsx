'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { TiptapEditorProps } from './props';
import { TiptapEditorExtensions } from './extensions';
import { useCompletion } from 'ai/react';
import { toast } from 'sonner';
import { useCallback, useEffect, useRef, useState } from 'react';
import HeaderButtons from '../HeaderButtons';
import TurndownService from 'turndown';

export default function Editor() {
  const [isMobile, setIsMobile] = useState(false);

  const prev = useRef<string>('');

  const turndownService = new TurndownService();

  const editor = useEditor({
    extensions: TiptapEditorExtensions,
    editorProps: TiptapEditorProps,
    content: '<h1><b>fmd.sh</b></h1><h3><i>create, visualize and export markdown files with ease.</i></h3>',
    autofocus: 'end'
  });

  const { complete, completion, isLoading, stop } = useCompletion({
    id: 'novel',
    api: '/api/generate',
    onResponse: (response) => {
      if (response.status === 429) {
        toast.error('You have reached your request limit for the day.');
        return;
      }

      toast.success('Text generated with success!');
    },
    onError: () => {
      toast.error('Something went wrong.');
    }
  });

  const generateText = useCallback(() => {
    toast.message('Generating text...');

    if (editor) complete(editor.getText());
  }, [complete, editor]);

  const handleGenerateButtonClick = () => {
    generateText();
  };

  const exportMD = () => {
    if (!editor) return;

    const element = document.createElement('a');

    console.log(turndownService.turndown(editor.getHTML()));

    const file = new Blob([turndownService.turndown(editor.getHTML())], { type: 'text/markdown' });

    element.href = URL.createObjectURL(file);
    element.download = 'myFile.md';

    document.body.appendChild(element);
    element.click();

    setTimeout(() => {
      document.body.removeChild(element);
    }, 1500);
  };

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
      if (e.key === 'Tab' && editor?.isFocused && editor.getText().length >= 1 && !isLoading) {
        e.preventDefault();

        generateText();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [complete, generateText, editor?.isFocused, editor, isLoading]);

  useEffect(() => {
    const diff = completion.slice(prev.current.length);

    prev.current = completion;

    editor?.commands.insertContent(diff);
  }, [isLoading, editor, completion]);

  useEffect(() => {
    setIsMobile(
      Boolean(navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i))
    );
  }, []);

  return (
    <>
      <HeaderButtons
        isLoading={isLoading}
        isMobile={isMobile}
        complete={handleGenerateButtonClick}
        exportMD={exportMD}
      />

      <div
        className="h-full w-full bg-white px-8 py-16 md:px-12"
        onClick={() => {
          editor?.chain().focus().run();
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </>
  );
}
