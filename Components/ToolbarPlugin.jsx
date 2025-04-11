import React from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
// import { FORMAT_TEXT_COMMAND, FORMAT_ELEMENT_COMMAND } from 'lexical';
// import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND as FORMAT_TEXT } from 'lexical';
import { 
  INSERT_ORDERED_LIST_COMMAND, 
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode
} from '@lexical/list';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $isElementNode,
  $getNodeByKey
} from 'lexical';

const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = React.useState(false);
  const [isItalic, setIsItalic] = React.useState(false);
  const [isUnderline, setIsUnderline] = React.useState(false);
  const [isCode, setIsCode] = React.useState(false);
  const [isOrderedList, setIsOrderedList] = React.useState(false);
  const [isUnorderedList, setIsUnorderedList] = React.useState(false);
  const [alignment, setAlignment] = React.useState('left');

  const updateToolbar = React.useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      
      if ($isRangeSelection(selection)) {
        // Text formatting
        setIsBold(selection.hasFormat('bold'));
        setIsItalic(selection.hasFormat('italic'));
        setIsUnderline(selection.hasFormat('underline'));
        setIsCode(selection.hasFormat('code'));
        
        // Alignment
        const anchorNode = selection.anchor.getNode();
        const element = anchorNode.getKey() === 'root' 
          ? anchorNode 
          : $isElementNode(anchorNode) 
            ? anchorNode 
            : anchorNode.getParentOrThrow();
        
        if ($isElementNode(element)) {
          setAlignment(element.getFormatType());
        }

        // List detection
        const nodes = selection.getNodes();
        let isList = false;
        let isOrdered = false;
        
        for (const node of nodes) {
          const parent = node.getParent();
          if ($isListNode(parent)) {
            isList = true;
            isOrdered = parent.getListType() === 'number';
            break;
          }
        }
        
        setIsOrderedList(isList && isOrdered);
        setIsUnorderedList(isList && !isOrdered);
      }
    });
  }, [editor]);

  React.useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  const insertList = (listType) => {
    if (isOrderedList || isUnorderedList) {
      editor.dispatchCommand(REMOVE_LIST_COMMAND);
    }
    editor.dispatchCommand(
      listType === 'number' 
        ? INSERT_ORDERED_LIST_COMMAND 
        : INSERT_UNORDERED_LIST_COMMAND, 
      undefined
    );
  };

  const applyAlignment = (align) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, align);
  };

  return (
    <div className="toolbar">
      {/* Text formatting buttons */}
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        className={`toolbar-item spaced ${isBold ? 'active' : ''}`}
        aria-label="Format Bold"
      >
        <span className="format bold">B</span>
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        className={`toolbar-item spaced ${isItalic ? 'active' : ''}`}
        aria-label="Format Italics"
      >
        <span className="format italic">I</span>
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        className={`toolbar-item spaced ${isUnderline ? 'active' : ''}`}
        aria-label="Format Underline"
      >
        <span className="format underline">U</span>
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
        className={`toolbar-item spaced ${isCode ? 'active' : ''}`}
        aria-label="Insert Code"
      >
        <span className="format code">{'</>'}</span>
      </button>

      {/* List buttons */}
      <div className="toolbar-divider"></div>
      <button
        onClick={() => insertList('bullet')}
        className={`toolbar-item spaced ${isUnorderedList ? 'active' : ''}`}
        aria-label="Insert Bullet List"
      >
        <span className="format bullet-list">•</span>
      </button>
      <button
        onClick={() => insertList('number')}
        className={`toolbar-item spaced ${isOrderedList ? 'active' : ''}`}
        aria-label="Insert Numbered List"
      >
        <span className="format numbered-list">1.</span>
      </button>

      {/* Alignment buttons */}
      <div className="toolbar-divider"></div>
      <button
        onClick={() => applyAlignment('left')}
        className={`toolbar-item spaced ${alignment === 'left' ? 'active' : ''}`}
        aria-label="Left Align"
      >
        <span className="format left-align">
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M3 3h18v2H3V3m0 4h12v2H3V7m0 4h18v2H3v-2m0 4h12v2H3v-2m0 4h18v2H3v-2z"/>
          </svg>
        </span>
      </button>
      <button
        onClick={() => applyAlignment('center')}
        className={`toolbar-item spaced ${alignment === 'center' ? 'active' : ''}`}
        aria-label="Center Align"
      >
        <span className="format center-align">
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M3 3h18v2H3V3m4 4h10v2H7V7m-4 4h18v2H3v-2m4 4h10v2H7v-2m-4 4h18v2H3v-2z"/>
          </svg>
        </span>
      </button>
      <button
        onClick={() => applyAlignment('right')}
        className={`toolbar-item spaced ${alignment === 'right' ? 'active' : ''}`}
        aria-label="Right Align"
      >
        <span className="format right-align">
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M3 3h18v2H3V3m6 4h12v2H9V7m-6 4h18v2H3v-2m6 4h12v2H9v-2m-6 4h18v2H3v-2z"/>
          </svg>
        </span>
      </button>
    </div>
  );
}

export default ToolbarPlugin;