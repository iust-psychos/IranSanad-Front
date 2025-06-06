// FooterPlugin.jsx
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodes, COMMAND_PRIORITY_EDITOR, createCommand } from 'lexical';
import { useEffect } from 'react';
import { $createFooterNode, FooterNode } from './FooterNode';

export const INSERT_FOOTER_COMMAND = createCommand('INSERT_FOOTER_COMMAND');

export function FooterPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([FooterNode])) {
      throw new Error('FooterPlugin: FooterNode not registered on editor');
    }

    return editor.registerCommand(
      INSERT_FOOTER_COMMAND,
      () => {
        const footerNode = $createFooterNode();
        $insertNodes([footerNode]);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}