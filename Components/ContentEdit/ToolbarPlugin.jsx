import React, { useCallback, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { richTextActions, richTextOptions } from "./rich-text-actions";
import { mergeRegister } from "@lexical/utils";

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
  $getRoot,
} from "lexical";
import {
  $patchStyleText,
  $getSelectionStyleValueForProperty,
  getStyleObjectFromCSS,
} from "@lexical/selection";
import { $isTableSelection } from "@lexical/table";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
} from "@lexical/list";
import { IconDivider1, MinusIcon, PlusIcon } from "./Icons";
import InsertTableButton from "./InsertTableButton";
import {
  clearFormatting,
  getFontFallback,
  updateFontSize,
} from "./font-utility";
import { DEFAULT_FONT_SIZE } from "./editor-config";

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [disableMap, setDisableMap] = useState({
    [richTextActions.Undo]: true,
    [richTextActions.Redo]: true,
  });
  const [selectionMap, setSelectionMap] = useState({});

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    let newSelectionMap = {};
    // if ($isRangeSelection(selection)) {
    //   newSelectionMap = {
    //     [richTextActions.FontFamily]: $getSelectionStyleValueForProperty(
    //       selection,
    //       "font-family",
    //       "Arial"
    //     ),
    //     [richTextActions.FontSize.Update]: $getSelectionStyleValueForProperty(
    //       selection,
    //       "font-size",
    //       `${DEFAULT_FONT_SIZE}px`
    //     ),
    //   };
    // }
    if ($isRangeSelection(selection) || $isTableSelection(selection)) {
      newSelectionMap = {
        ...newSelectionMap,
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
  }, [editor, setSelectionMap]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (payLoad) => {
          updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payLoad) => {
          setDisableMap((prev) => ({ ...prev, undo: !payLoad }));
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payLoad) => {
          setDisableMap((prev) => ({ ...prev, redo: !payLoad }));
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  });

  const onAction = (id, option = "", value = "") => {
    switch (id) {
      case richTextActions.Bold:
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        break;
      case richTextActions.Italics:
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        break;
      case richTextActions.Underline:
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        break;
      case richTextActions.Strikethrough:
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        break;
      case richTextActions.Superscript:
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript");
        break;
      case richTextActions.Subscript:
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript");
        break;
      case richTextActions.Highlight:
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "highlight");
        break;
      case richTextActions.Code:
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
        break;
      case richTextActions.LeftAlign:
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        break;
      case richTextActions.CenterAlign:
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        break;
      case richTextActions.RightAlign:
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        break;
      case richTextActions.Undo:
        editor.dispatchCommand(UNDO_COMMAND, undefined);
        break;
      case richTextActions.Redo:
        editor.dispatchCommand(REDO_COMMAND, undefined);
        break;
      case richTextActions.FontSize.Increment:
        updateFontSize(editor, "increment", "");
        break;
      case richTextActions.FontSize.Update:
        updateFontSize(editor, "", value);
        break;
      case richTextActions.FontSize.Decrement:
        updateFontSize(editor, "decrement", "");
        break;
      case richTextActions.FontFamily:
        const robustValue = getFontFallback(value);
        editor.update(() => {
          const selection = $getSelection();
          if (selection !== null) {
            $patchStyleText(selection, {
              [option]: robustValue,
            });
          }
        });
        break;
      case richTextActions.ClearFormatting:
        clearFormatting(editor);
        break;
      default:
        break;
    }
  };

  return (
    <div className="toolbar">
      {richTextOptions.map(
        ({ id, component: StyledComponent, props }, index) => (
          <StyledComponent
            key={`${id}${index}`}
            onAction={onAction}
            disableMap={disableMap}
            selectionMap={selectionMap}
            {...props}
          />
        )
      )}
      <IconDivider1 />
      <InsertTableButton editor={editor} />
    </div>
  );
}

export default ToolbarPlugin;
