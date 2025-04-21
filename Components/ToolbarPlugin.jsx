import React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import styles from "./ContentEdit/ContentEdit.module.css";
// import { FORMAT_TEXT_COMMAND, FORMAT_ELEMENT_COMMAND } from 'lexical';
// import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND as FORMAT_TEXT } from 'lexical';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
} from "@lexical/list";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $isElementNode,
  $getNodeByKey,
} from "lexical";
// import { TEXT_DIRECTION_COMMAND } from '@lexical/rich-text';
import { createCommand, COMMAND_PRIORITY_EDITOR } from "lexical";

// Add this to your component or a separate commands file
export const TEXT_DIRECTION_COMMAND = createCommand("TEXT_DIRECTION_COMMAND");
export const FONT_FAMILY_COMMAND = createCommand("FONT_FAMILY_COMMAND");

export const INCREASE_FONT_SIZE_COMMAND = createCommand('INCREASE_FONT_SIZE_COMMAND');
export const DECREASE_FONT_SIZE_COMMAND = createCommand('DECREASE_FONT_SIZE_COMMAND');
export const FONT_SIZE_COMMAND = createCommand('FONT_SIZE_COMMAND');


const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = React.useState(false);
  const [isItalic, setIsItalic] = React.useState(false);
  const [isUnderline, setIsUnderline] = React.useState(false);
  const [isCode, setIsCode] = React.useState(false);
  const [isOrderedList, setIsOrderedList] = React.useState(false);
  const [isUnorderedList, setIsUnorderedList] = React.useState(false);
  const [alignment, setAlignment] = React.useState("left");
  const [textDirection, setTextDirection] = React.useState("ltr");
  const [fontFamily, setFontFamily] = React.useState("Arial");
  const [fontSize, setFontSize] = React.useState('14px');

  // Common font sizes (matches Word's default sizes)
  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
  const minSize = 8;
  const maxSize = 72;
  const updateToolbar = React.useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        // Text formatting
        setIsBold(selection.hasFormat("bold"));
        setIsItalic(selection.hasFormat("italic"));
        setIsUnderline(selection.hasFormat("underline"));
        setIsCode(selection.hasFormat("code"));

        // Alignment
        const anchorNode = selection.anchor.getNode();
        const element =
          anchorNode.getKey() === "root"
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
            isOrdered = parent.getListType() === "number";
            break;
          }
        }

        setIsOrderedList(isList && isOrdered);
        setIsUnorderedList(isList && !isOrdered);
      }
    });
  }, [editor]);
  React.useEffect(() => {
    return editor.registerCommand(
      FONT_SIZE_COMMAND,
      (size) => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $patchStyleText(selection, {
              'font-size': size,
            });
          }
        });
        setFontSize(size);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  React.useEffect(() => {
    return editor.registerCommand(
      INCREASE_FONT_SIZE_COMMAND,
      () => {
        const currentSize = parseInt(fontSize);
        const newSize = Math.min(currentSize + 2, maxSize);
        editor.dispatchCommand(FONT_SIZE_COMMAND, `${newSize}px`);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor, fontSize]);

  React.useEffect(() => {
    return editor.registerCommand(
      DECREASE_FONT_SIZE_COMMAND,
      () => {
        const currentSize = parseInt(fontSize);
        const newSize = Math.max(currentSize - 2, minSize);
        editor.dispatchCommand(FONT_SIZE_COMMAND, `${newSize}px`);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor, fontSize]);
  React.useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);
  React.useEffect(() => {
    return editor.registerCommand(
      FONT_FAMILY_COMMAND,
      (font) => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $patchStyleText(selection, {
              "font-family": font,
            });
          }
        });
        setFontFamily(font);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);
  React.useEffect(() => {
    return editor.registerCommand(
      TEXT_DIRECTION_COMMAND,
      (direction) => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const nodes = selection.getNodes();
            nodes.forEach((node) => {
              if ($isElementNode(node)) {
                node.setDirection(direction);
              }
            });
          }
        });
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);
  const insertList = (listType) => {
    if (isOrderedList || isUnorderedList) {
      editor.dispatchCommand(REMOVE_LIST_COMMAND);
    }
    editor.dispatchCommand(
      listType === "number"
        ? INSERT_ORDERED_LIST_COMMAND
        : INSERT_UNORDERED_LIST_COMMAND,
      undefined
    );
  };

  const applyAlignment = (align) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, align);
  };
  const fontOptions = [
    { value: "Arial", label: "Arial" },
    { value: "Times New Roman", label: "Times New Roman" },
    { value: "Calibri", label: "Calibri" },
    { value: "Courier New", label: "Courier New" },
    { value: "Georgia", label: "Georgia" },
    { value: "Verdana", label: "Verdana" },
    { value: "Tahoma", label: "Tahoma" },
    { value: "Trebuchet MS", label: "Trebuchet MS" },
  ];
  return (
    <div className="toolbar">
      <div className={styles.fontFaimlyDropDown}>
        <select className={styles.fontFaimlyDropDownselect}
          value={fontFamily}
          onChange={(e) =>
            editor.dispatchCommand(FONT_FAMILY_COMMAND, e.target.value)
          }
          aria-label="Font family"
          title="Font"
          style={{ fontFamily: fontFamily }}
        >
          {fontOptions.map((font) => (
            <option
              key={font.value}
              value={font.value}
              style={{ fontFamily: font.value }}
            >
              {font.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.toolbardividerthicker}></div>
      {/* Text formatting buttons */}
      {/* <div className={styles.toolbarGrouping}> */}
      <div className="font-size-controls">
        <button
          onClick={() => editor.dispatchCommand(DECREASE_FONT_SIZE_COMMAND)}
          className="toolbar-item"
          aria-label="Decrease font size"
          title="Decrease Font Size (Ctrl+Shift+<)"
        >
          {/* <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19 13H5v-2h14v2z"/>
            <path fill="currentColor" d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
          </svg> */}
          -
        </button>
        
        <select
          value={fontSize}
          onChange={(e) => editor.dispatchCommand(FONT_SIZE_COMMAND, e.target.value)}
          className={styles.fontSizeDropDownselect}
          aria-label="Font size"
          title="Font Size"
        >
          {fontSizes.map((size) => (
            <option key={size} value={`${size}px`}>
              {size}
            </option>
          ))}
        </select>
        
        <button
          onClick={() => editor.dispatchCommand(INCREASE_FONT_SIZE_COMMAND)}
          className="toolbar-item"
          aria-label="Increase font size"
          title="Increase Font Size (Ctrl+Shift+>)"
        >
          {/* <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            <path fill="currentColor" d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
          </svg> */}
          +
        </button>
      </div>
<div className={styles.toolbardivider}></div>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        className={`toolbar-item spaced ${isBold ? "active" : ""}`}
        aria-label="Format Bold"
        title="Bold (Ctrl+B)"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ display: "block" }}
        >
          <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
          <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
        </svg>
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        className={`toolbar-item spaced ${isItalic ? "active" : ""}`}
        aria-label="Format Italics"
        title="Italic (Ctrl+I)"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ display: "block" }}
        >
          <path d="M19 4h-9M14 20H5M15 4L9 20" />
        </svg>
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
        className={`toolbar-item spaced ${isUnderline ? "active" : ""}`}
        aria-label="Format Underline"
        title="Underline (Ctrl+U)"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ display: "block" }}
        >
          <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
          <line x1="4" y1="21" x2="20" y2="21" />
        </svg>
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")}
        className={`toolbar-item spaced ${isCode ? "active" : ""}`}
        aria-label="Insert Code"
      >
        <span className="format code">{"</>"}</span>
      </button>

      {/* </div> */}
      <div className={styles.toolbardividerthicker}></div>
      {/* List buttons */}
      <button
        onClick={() => insertList("bullet")}
        className={`toolbar-item spaced ${isUnorderedList ? "active" : ""}`}
        aria-label="Insert Bullet List"
        title="Bullet List"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ display: "block" }}
        >
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <circle cx="3" cy="6" r="1.5" />
          <circle cx="3" cy="12" r="1.5" />
          <circle cx="3" cy="18" r="1.5" />
        </svg>
      </button>
      <button
        onClick={() => insertList("number")}
        className={`toolbar-item spaced ${isOrderedList ? "active" : ""}`}
        aria-label="Insert Numbered List"
        title="Numbered List"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ display: "block" }}
        >
          <line x1="10" y1="6" x2="21" y2="6" />
          <line x1="10" y1="12" x2="21" y2="12" />
          <line x1="10" y1="18" x2="21" y2="18" />
          <path d="M4 6h1v4" />
          <path d="M4 10h2" />
          <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
        </svg>
      </button>
      <div className={styles.toolbardivider}></div>
      {/* Alignment buttons */}
      <button
        onClick={() => applyAlignment("left")}
        className={`toolbar-item spaced ${
          alignment === "left" ? "active" : ""
        }`}
        aria-label="Left Align"
      >
        <span className="format left-align">
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M3 3h18v2H3V3m0 4h12v2H3V7m0 4h18v2H3v-2m0 4h12v2H3v-2m0 4h18v2H3v-2z"
            />
          </svg>
        </span>
      </button>
      <button
        onClick={() => applyAlignment("center")}
        className={`toolbar-item spaced ${
          alignment === "center" ? "active" : ""
        }`}
        aria-label="Center Align"
      >
        <span className="format center-align">
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M3 3h18v2H3V3m4 4h10v2H7V7m-4 4h18v2H3v-2m4 4h10v2H7v-2m-4 4h18v2H3v-2z"
            />
          </svg>
        </span>
      </button>
      <button
        onClick={() => applyAlignment("right")}
        className={`toolbar-item spaced ${
          alignment === "right" ? "active" : ""
        }`}
        aria-label="Right Align"
      >
        <span className="format right-align">
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M3 3h18v2H3V3m6 4h12v2H9V7m-6 4h18v2H3v-2m6 4h12v2H9v-2m-6 4h18v2H3v-2z"
            />
          </svg>
        </span>
      </button>
      <div className={styles.toolbardivider}></div>
      <button
        onClick={() => editor.dispatchCommand(TEXT_DIRECTION_COMMAND, "ltr")}
        className={`toolbar-item direction-btn ${
          textDirection === "ltr" ? "active" : ""
        }`}
        aria-label="Left-to-right"
        title="Left-to-right (LTR)"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 4V20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M4 8L9 4V8H15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 16L9 20V16H15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19 4V20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Right-to-Left (Word-style) */}
      <button
        onClick={() => editor.dispatchCommand(TEXT_DIRECTION_COMMAND, "rtl")}
        className={`toolbar-item direction-btn ${
          textDirection === "rtl" ? "active" : ""
        }`}
        aria-label="Right-to-left"
        title="Right-to-left (RTL)"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 4V20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M20 8L15 4V8H9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20 16L15 20V16H9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 4V20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default ToolbarPlugin;
