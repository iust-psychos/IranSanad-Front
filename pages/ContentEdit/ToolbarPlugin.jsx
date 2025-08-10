import React, { useCallback, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  richTextActions,
  richTextOptions,
} from "@/pages/ContentEdit/RichTextActions";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import InsertTableButton from "@/pages/ContentEdit/InsertTableButton";
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
  $isNodeSelection,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
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
  ListNode,
} from "@lexical/list";
import { $isHeadingNode } from "@lexical/rich-text";
import { IconDivider1, MinusIcon, PlusIcon } from "./Icons";
import {
  clearFormatting,
  getFontFallback,
  updateFontSize,
} from "@/pages/ContentEdit/FontUtility";
import { DEFAULT_FONT_SIZE } from "@/pages/ContentEdit/EditorConfig";
import {
  $findTopLevelElement,
  formatBulletList,
  formatCheckList,
  formatCode,
  formatHeading,
  formatNumberedList,
  formatParagraph,
  formatQuote,
} from "./BlockUtility";
import {
  blockIdToLexical,
  blockTypeToBlockName,
  lexicalToBlockId,
} from "./RichTextActions";
import { TOGGLE_HEADER_COMMAND } from "./HeaderPlugin";
import { TOGGLE_FOOTER_COMMAND } from "./FooterPlugin";

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [disableMap, setDisableMap] = useState({
    [richTextActions.Undo]: true,
    [richTextActions.Redo]: true,
  });
  const [selectionMap, setSelectionMap] = useState({});

  const $handleBlockNode = useCallback(
    (selectedElement) => {
      const type = $isHeadingNode(selectedElement)
        ? selectedElement.getTag()
        : selectedElement.getType();

      console.log(`${richTextActions.Block.Update}:${lexicalToBlockId[type]}`);
      if (type in lexicalToBlockId) {
        setSelectionMap((prev) => ({
          ...prev,
          [richTextActions.Block.Update]: lexicalToBlockId[type],
        }));
      }
    },
    [editor]
  );

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    const anchorNode = selection.anchor.getNode();
    const element = $findTopLevelElement(anchorNode);
    const elementKey = element.getKey();
    const elementDOM = editor.getElementByKey(elementKey);
    let newSelectionMap = {};

    if (elementDOM !== null) {
      const nodes = selection.getNodes();
      for (const selectedNode of nodes) {
        const parentList = $getNearestNodeOfType(selectedNode, ListNode);
        let type = null;
        if (parentList) {
          type = parentList.getListType();
          newSelectionMap = {
            [richTextActions.Block.Update]: lexicalToBlockId[type],
          };
        } else {
          const selectedElement = $findTopLevelElement(selectedNode);
          type = $isHeadingNode(selectedElement)
            ? selectedElement.getTag()
            : selectedElement.getType();

          if (type in lexicalToBlockId) {
            newSelectionMap = {
              [richTextActions.Block.Update]: lexicalToBlockId[type],
            };
          }
        }
      }
    }

    if ($isRangeSelection(selection)) {
      newSelectionMap = {
        ...newSelectionMap,
        [richTextActions.FontFamily]: $getSelectionStyleValueForProperty(
          selection,
          "font-family",
          "Arial"
        ),
        [richTextActions.FontSize.Update]: $getSelectionStyleValueForProperty(
          selection,
          "font-size",
          `${DEFAULT_FONT_SIZE}px`
        ),
      };
    }
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

    // if ($isNodeSelection(selection)) {
    //   console.log("there");
    //   const nodes = selection.getNodes();
    //   for (const selectedNode of nodes) {
    //     const parentList = $getNearestNodeOfType(selectedNode, ListNode);
    //     if (parentList) {
    //       const type = parentList.getListType();
    //       setSelectionMap((prev) => ({
    //         ...prev,
    //         [richTextActions.Block.Update]: lexicalToBlockId[type],
    //       }));
    //     } else {
    //       const selectedElement = $findTopLevelElement(selectedNode);
    //       $handleBlockNode(selectedElement);
    //       // $handleCodeNode(selectedElement);
    //     }
    //   }
    // }
  }, [editor, setSelectionMap]);

  useEffect(() => {
    if (editor !== undefined && editor !== null)
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
      case richTextActions.ToggleHeader:
        editor.dispatchCommand(TOGGLE_HEADER_COMMAND, undefined);
        break;
      case richTextActions.ToggleFooter:
        editor.dispatchCommand(TOGGLE_FOOTER_COMMAND, undefined);
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
      case richTextActions.Block.Normal:
        formatParagraph(editor);
        break;
      case richTextActions.Block.Heading1:
        formatHeading(editor, blockIdToLexical[value], "h1");
        break;
      case richTextActions.Block.Heading2:
        formatHeading(editor, blockIdToLexical[value], "h2");
        break;
      case richTextActions.Block.Heading3:
        formatHeading(editor, blockIdToLexical[value], "h3");
        break;
      case richTextActions.Block.OrderedList:
        formatNumberedList(editor, blockIdToLexical[value]);
        break;
      case richTextActions.Block.UnorderedList:
        formatBulletList(editor, blockIdToLexical[value]);
        break;
      case richTextActions.Block.CheckList:
        formatCheckList(editor, blockIdToLexical[value]);
        break;
      case richTextActions.Block.Quote:
        formatQuote(editor, blockIdToLexical[value]);
        break;
      case richTextActions.Block.CodeBlock:
        formatCode(editor, blockIdToLexical[value]);
        break;
      case richTextActions.LeftIndent:
        editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
        break;
      case richTextActions.LeftOutdent:
        editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
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