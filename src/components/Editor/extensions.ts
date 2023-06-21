import StarterKit from '@tiptap/starter-kit';
import TiptapLink from '@tiptap/extension-link';
import TiptapImage from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import HorizontalRule from '@tiptap/extension-horizontal-rule';

import { InputRule } from '@tiptap/core';
import SlashCommand from './slashCommand';

export const TiptapEditorExtensions = [
  StarterKit.configure({
    bulletList: {
      HTMLAttributes: {
        class: 'list-disc list-outside leading-3'
      }
    },
    orderedList: {
      HTMLAttributes: {
        class: 'list-decimal list-outside leading-3'
      }
    },
    listItem: {
      HTMLAttributes: {
        class: 'leading-normal'
      }
    },
    blockquote: {
      HTMLAttributes: {
        class: 'border-l-4 border-gray-300 pl-4'
      }
    },
    codeBlock: {
      HTMLAttributes: {
        class: 'rounded-md bg-gray-200 p-5 font-mono font-medium text-gray-800'
      }
    },
    code: {
      HTMLAttributes: {
        class: 'rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-black'
      }
    },
    horizontalRule: false,
    dropcursor: {
      color: '#DBEAFE',
      width: 4
    }
  }),
  TiptapLink.configure({
    HTMLAttributes: {
      class: 'text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer'
    }
  }),
  TiptapImage.configure({
    inline: true
  }),
  Placeholder.configure({
    placeholder: ({ editor }) => {
      return editor.isEmpty ? 'Press `/` for commands or press `tab` for AI autocomplete...' : '';
    },
    includeChildren: true
  }),
  SlashCommand,
  HorizontalRule.extend({
    addInputRules() {
      return [
        new InputRule({
          find: /^(?:---|—-|___\s|\*\*\*\s)$/,
          handler: ({ state, range, match }) => {
            const attributes = {};

            const { tr } = state;
            const start = range.from;
            let end = range.to;

            tr.insert(start - 1, this.type.create(attributes)).delete(tr.mapping.map(start), tr.mapping.map(end));
          }
        })
      ];
    }
  }).configure({
    HTMLAttributes: {
      class: 'mt-4 mb-6 border-t border-stone-300'
    }
  })
];
