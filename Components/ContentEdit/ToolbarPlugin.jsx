import React, { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { richTextActions, richTextOptions } from "./rich-text-actions";
import { mergeRegister } from "@lexical/utils";
import InsertTableButton from './Inserttablebutton';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  CAN_REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import {
  $patchStyleText,
  $getSelectionStyleValueForProperty,
} from "@lexical/selection";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
} from "@lexical/list";
import { IconDivider1, MinusIcon, PlusIcon } from "./Icons";

function ToolbarPlugin({currentPage , activeEditor}) {
  // const [activeEditor] = useLexicalComposerContext();
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState("14");
  const [disableMap, setDisableMap] = useState({
    [richTextActions.Undo]: true,
    [richTextActions.Redo]: true,
  });
  const [selectionMap, setSelectionMap] = useState({});

  const updateToolbar = () => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      const newSelectionMap = {
        [richTextActions.Bold]: selection.hasFormat("bold"),
        [richTextActions.Italics]: selection.hasFormat("italic"),
        [richTextActions.Underline]: selection.hasFormat("underline"),
        [richTextActions.Strikethrough]: selection.hasFormat("strikethrough"),
        [richTextActions.Superscript]: selection.hasFormat("superscript"),
        [richTextActions.Subscript]: selection.hasFormat("subscript"),
        [richTextActions.Code]: selection.hasFormat("code"),
        [richTextActions.Highlight]: selection.hasFormat("highlight"),
      };
      setSelectionMap(newSelectionMap);
    }
  };

  useEffect(() => {
    if(activeEditor !== undefined && activeEditor !== null)
      return mergeRegister(
        activeEditor.registerUpdateListener(({ activeEditorState }) => {
          activeEditorState.read(() => {
            updateToolbar();
          });
        }),
        activeEditor.registerCommand(
          SELECTION_CHANGE_COMMAND,
          (payLoad) => {
            updateToolbar();
            return false;
          },
          COMMAND_PRIORITY_LOW
        ),
        activeEditor.registerCommand(
          CAN_UNDO_COMMAND,
          (payLoad) => {
            setDisableMap((prev) => ({ ...prev, undo: !payLoad }));
            return false;
          },
          COMMAND_PRIORITY_LOW
        ),
        activeEditor.registerCommand(
          CAN_REDO_COMMAND,
          (payLoad) => {
            setDisableMap((prev) => ({ ...prev, redo: !payLoad }));
            return false;
          },
          COMMAND_PRIORITY_LOW
        )
      );
  });

  const onAction = (id) => {
    switch (id) {
      case richTextActions.Bold:
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        break;
      case richTextActions.Italics:
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        break;
      case richTextActions.Underline:
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        break;
      case richTextActions.Strikethrough:
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        break;
      case richTextActions.Superscript:
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript");
        break;
      case richTextActions.Subscript:
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript");
        break;
      case richTextActions.Highlight:
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "highlight");
        break;
      case richTextActions.Code:
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
        break;
      case richTextActions.LeftAlign:
        activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        break;
      case richTextActions.CenterAlign:
        activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        break;
      case richTextActions.RightAlign:
        activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        break;
      case richTextActions.Undo:
        activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
        break;
      case richTextActions.Redo:
        activeEditor.dispatchCommand(REDO_COMMAND, undefined);
        break;
      default:
        break;
    }
  };

  // useEffect(() => {
  //   return activeEditor.registerCommand(
  //     activeEditor.SELECTION_CHANGE_COMMAND,
  //     () => {
  //       const selection = $getSelection();
  //       if ($isRangeSelection(selection)) {
  //         setBold(selection.hasFormat("bold"));
  //         setItalic(selection.hasFormat("italic"));
  //         setUnderline(selection.hasFormat("underline"));
  //         setStrikethrough(selection.hasFormat("strikethrough"));

  //         const family = $getSelectionStyleValueForProperty(
  //           selection,
  //           "font-family",
  //           fontFamily
  //         );
  //         const size = $getSelectionStyleValueForProperty(
  //           selection,
  //           "font-size",
  //           `${fontSize}px`
  //         );
  //         if (family) setFontFamily(family.replace(/['"]/g, ""));
  //         if (size) setFontSize(parseInt(size));
  //       }
  //       return false;
  //     },

  //     0
  //   );
  // }, [activeEditor, fontFamily, fontSize]);

  const fontOptions = [
    "Arial",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Verdana",
  ];

  const fontSizes = [
    8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 72,
  ];

  return (
    <div className="toolbar">
      {richTextOptions.map(({ id, icon, label }, index) =>
        id === richTextActions.Divider ? (
          <IconDivider1 key={`${id}${index}`} />
        ) : (
          <button
            key={id}
            aria-label={label}
            onClick={() => onAction(id)}
            disabled={disableMap[id]}
            className={selectionMap[id] ? "active" : null}
          >
            {icon}
          </button>
          
        )
      )}
      <IconDivider1 />
      <InsertTableButton activeEditor={activeEditor} />
    </div>
  );
}

export default ToolbarPlugin;
