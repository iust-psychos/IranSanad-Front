import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { 
  $getRoot, 
  $createParagraphNode,  
  COMMAND_PRIORITY_EDITOR, 
  createCommand, 
  $setSelection,
  $createRangeSelection,
} from 'lexical';
import { useEffect } from 'react';
import { mergeRegister } from "@lexical/utils";
import { $createHeaderNode, HeaderNode, $isHeaderNode } from "./HeaderNode";

export const TOGGLE_HEADER_COMMAND = createCommand('TOGGLE_HEADER_COMMAND');
export const FOCUS_HEADER_COMMAND = createCommand('FOCUS_HEADER_COMMAND');

export function HeaderPlugin() {
  const [editor] = useLexicalComposerContext();

  const getHeaderNode = () => {
    return editor.getEditorState().read(() => {
      const root = $getRoot();
      const children = root.getChildren();
      return children.find(node => $isHeaderNode(node));
    });
  };

  const focusHeader = () => {
    editor.update(() => {
      const header = getHeaderNode();
      if (header) {
        const selection = $createRangeSelection();
        selection.anchor.set(header.getKey(), 0, 'element');
        selection.focus.set(header.getKey(), 0, 'element');
        $setSelection(selection);
      }
    });
  };

  const toggleHeader = () => {
    editor.update(() => {
      const header = getHeaderNode();
      if (header) {
        // Remove existing header when button is clicked
        header.remove()
      } else {
        // Create new header at top
        const root = $getRoot();
        const header = $createHeaderNode();
        header.append($createParagraphNode());
        const firstChild = root.getFirstChild();
        
        if (firstChild) {
          firstChild.insertBefore(header);
        } else {
          root.append(header);
        }
        
        focusHeader();
      }
    });
  };

  useEffect(() => {
    if (!editor.hasNodes([HeaderNode])) {
      throw new Error('HeaderPlugin: HeaderNode not registered on editor');
    }

    return mergeRegister(
      editor.registerCommand(
        TOGGLE_HEADER_COMMAND,
        () => {
          toggleHeader();
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand(
        FOCUS_HEADER_COMMAND,
        () => {
          focusHeader();
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor]);

  return null;
}