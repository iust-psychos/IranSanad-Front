// HeaderPlugin.jsx
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodes, COMMAND_PRIORITY_EDITOR, createCommand } from 'lexical';
import { useEffect } from 'react';
import { $createHeaderNode, HeaderNode } from './HeaderNode';

export const INSERT_HEADER_COMMAND = createCommand('INSERT_HEADER_COMMAND');

export function HeaderPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([HeaderNode])) {
      throw new Error('HeaderPlugin: HeaderNode not registered on editor');
    }

    return editor.registerCommand(
      INSERT_HEADER_COMMAND,
      () => {
        const headerNode = $createHeaderNode();
        $insertNodes([headerNode]);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}