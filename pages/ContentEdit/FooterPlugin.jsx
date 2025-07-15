import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { 
  $getRoot, 
  $createParagraphNode, 
  COMMAND_PRIORITY_EDITOR, 
  createCommand, 
  $setSelection,
  $createRangeSelection
} from 'lexical';
import { useEffect } from 'react';
import { mergeRegister } from "@lexical/utils";
import { $createFooterNode, FooterNode, $isFooterNode } from "./FooterNode";

export const TOGGLE_FOOTER_COMMAND = createCommand('TOGGLE_FOOTER_COMMAND');
export const FOCUS_FOOTER_COMMAND = createCommand('FOCUS_FOOTER_COMMAND');

export function FooterPlugin() {
  const [editor] = useLexicalComposerContext();

  const getFooterNode = () => {
    return editor.getEditorState().read(() => {
      const root = $getRoot();
      const children = root.getChildren();
      return children.find(node => $isFooterNode(node));
    });
  };

  const focusFooter = () => {
    editor.update(() => {
      const footer = getFooterNode();
      if (footer) {
        const selection = $createRangeSelection();
        selection.anchor.set(footer.getKey(), 0, 'element');
        selection.focus.set(footer.getKey(), 0, 'element');
        $setSelection(selection);
      }
    });
  };

  const toggleFooter = () => {
    editor.update(() => {
      const footer = getFooterNode();
      if (footer) {
        // Remove existing footer when button is clicked
        footer.remove();
      } else {
        // Create new footer at bottom
        const root = $getRoot();
        const footer = $createFooterNode();
        footer.append($createParagraphNode());
        root.append(footer);
        
        focusFooter();
      }
    });
  };

  useEffect(() => {
    if (!editor.hasNodes([FooterNode])) {
      throw new Error('FooterPlugin: FooterNode not registered on editor');
    }

    return mergeRegister(
      editor.registerCommand(
        TOGGLE_FOOTER_COMMAND,
        () => {
          toggleFooter();
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand(
        FOCUS_FOOTER_COMMAND,
        () => {
          focusFooter();
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor]);

  return null;
}