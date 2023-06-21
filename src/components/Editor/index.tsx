'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { TiptapEditorProps } from './props';
import { TiptapEditorExtensions } from './extensions';
import { useCompletion } from 'ai/react';
import { toast } from 'sonner';
import { useCallback, useEffect, useRef, useState } from 'react';
import HeaderButtons from '../HeaderButtons';
import TurndownService from 'turndown';
import short from 'short-uuid';
import useLocalStorage from '@/lib/useLocalStorage';
import { useDebouncedCallback } from 'use-debounce';

export default function Editor() {
  const [isMobile, setIsMobile] = useState(false);

  const [content, setContent] = useLocalStorage(
    'fmdsh.content',
    '<h1><b>fmd.sh</b></h1><h3><i>create, visualize and export markdown files with ease.</i></h3>'
  );

  const [saveStatus, setSaveStatus] = useState('Saved');

  const [hydrated, setHydrated] = useState(false);

  const debouncedUpdates = useDebouncedCallback(async ({ editor }) => {
    const json = editor.getJSON();

    setSaveStatus('Saving...');
    setContent(json);

    setTimeout(() => {
      setSaveStatus('Saved');
    }, 500);
  }, 750);

  const prev = useRef<string>('');

  const turndownService = new TurndownService();

  const editor = useEditor({
    extensions: TiptapEditorExtensions,
    editorProps: TiptapEditorProps,
    content,
    autofocus: 'end',
    onUpdate: (e) => {
      setSaveStatus('Unsaved');

      debouncedUpdates(e);
    }
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
    },
    onFinish: (_prompt, completion) => {
      editor?.commands.setTextSelection({
        from: editor.state.selection.from - completion.length,
        to: editor.state.selection.from
      });
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
    element.download = `${short.generate()}.md`;

    document.body.appendChild(element);
    element.click();

    setTimeout(() => {
      document.body.removeChild(element);
    }, 1500);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || (e.metaKey && e.key === 'z')) {
        stop();

        toast.success('Generation stopped with success!');
      }
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

        generateText();
      }
    };

    if (isLoading) document.addEventListener('keydown', onKeyDown);
    else document.removeEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [complete, generateText, editor?.isFocused, editor, isLoading]);

  useEffect(() => {
    const diff = completion.slice(prev.current.length);

    prev.current = completion;

    editor?.commands.insertContent(diff, {
      parseOptions: {
        preserveWhitespace: 'full'
      }
    });
  }, [isLoading, editor, completion]);

  useEffect(() => {
    setIsMobile(
      Boolean(navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i))
    );
  }, []);

  useEffect(() => {
    if (editor && content && !hydrated) {
      editor.commands.setContent(content);

      setHydrated(true);
    }
  }, [editor, content, hydrated]);

  return (
    <>
      <HeaderButtons
        isLoading={isLoading}
        isMobile={isMobile}
        complete={handleGenerateButtonClick}
        exportMD={exportMD}
        isExportDisabled={Boolean(editor?.isEmpty)}
      />

      <div
        className="relative w-full bg-white py-16 sm:py-12 px-12 min-h-[512px] sm:rounded-lg border-zinc-200/75 sm:border-[1px] sm:shadow-lg cursor-text"
        onClick={() => {
          editor?.chain().focus().run();
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </>
  );
}
