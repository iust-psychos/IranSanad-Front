import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
} from "lexical";
import { DEFAULT_FONT_SIZE, FONT_SIZES } from "./editor-config";
import { $isTableSelection } from "@lexical/table";
import { $getNearestBlockElementAncestorOrThrow } from "@lexical/utils";
import { $isHeadingNode, $isQuoteNode } from "@lexical/rich-text";
import { $isDecoratorBlockNode } from "@lexical/react/LexicalDecoratorBlockNode";
import { $patchStyleText } from "@lexical/selection";

export function getFontFallback(fontName) {
  const fontFallbackMap = {
    Arial: "sans-serif",
    Verdana: "sans-serif",
    Helvetica: "sans-serif",
    Tahoma: "sans-serif",
    "Trebuchet MS": "sans-serif",
    "Times New Roman": "serif",
    Georgia: "serif",
    Garamond: "serif",
    "Courier New": "monospace",
    "Lucida Console": "monospace",
    "Brush Script MT": "cursive",
    Impact: "fantasy",
  };

  const fallback = fontFallbackMap[fontName];
  if (fallback) {
    return `${fontName}, ${fallback}`;
  }

  return "sans-serif";
}

export function getAdjustedFontSize(
  currentSize,
  mode = "increment",
  fontSizes = FONT_SIZES
) {
  if (mode == "") {
    if (currentSize > fontSizes[-1]) return fontSizes[-1];
    else if (currentSize < fontSizes[0]) return fontSizes[0];
    else return currentSize;
  }
  const sortedSizes = [...fontSizes].sort((a, b) => a - b);
  const currentIndex = sortedSizes.findIndex((size) => size >= currentSize);

  if (mode === "increment") {
    if (currentIndex === -1 || currentIndex === sortedSizes.length - 1) {
      return sortedSizes[sortedSizes.length - 1];
    }

    if (sortedSizes[currentIndex] === currentSize) {
      return sortedSizes[currentIndex + 1] ?? sortedSizes[currentIndex];
    }

    return sortedSizes[currentIndex];
  }

  if (mode === "decrement") {
    if (currentIndex <= 0) {
      return sortedSizes[0];
    }

    if (sortedSizes[currentIndex] === currentSize) {
      return sortedSizes[currentIndex - 1] ?? sortedSizes[0];
    }

    return sortedSizes[currentIndex - 1];
  }
}

export const updateFontSizeInSelection = (editor, newFontSize, updateType) => {
  const getNextFontSize = (prevFontSize = null) => {
    if (!prevFontSize) {
      prevFontSize = `${DEFAULT_FONT_SIZE}px`;
    }
    prevFontSize = prevFontSize.slice(0, -2);
    const nextFontSize = getAdjustedFontSize(Number(prevFontSize), updateType);
    return `${nextFontSize}px`;
  };

  editor.update(() => {
    const selection = $getSelection();
    if (selection !== null) {
      $patchStyleText(selection, {
        "font-size": newFontSize || getNextFontSize,
      });
    }
  });
};

export const updateFontSize = (editor, updateType, inputValue) => {
  if (inputValue !== "") {
    const nextFontSize = getAdjustedFontSize(Number(inputValue), updateType);
    console.log(nextFontSize);
    updateFontSizeInSelection(editor, String(nextFontSize) + "px", null);
  } else {
    updateFontSizeInSelection(editor, null, updateType);
  }
};

export const clearFormatting = (editor) => {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection) || $isTableSelection(selection)) {
      const anchor = selection.anchor;
      const focus = selection.focus;
      const nodes = selection.getNodes();
      const extractedNodes = selection.extract();

      if (anchor.key === focus.key && anchor.offset === focus.offset) {
        return;
      }

      nodes.forEach((node, idx) => {
        if ($isTextNode(node)) {
          let textNode = node;
          if (idx === 0 && anchor.offset !== 0) {
            textNode = textNode.splitText(anchor.offset)[1] || textNode;
          }
          if (idx === nodes.length - 1) {
            textNode = textNode.splitText(focus.offset)[0] || textNode;
          }
          const extractedTextNode = extractedNodes[0];
          if (nodes.length === 1 && $isTextNode(extractedTextNode)) {
            textNode = extractedTextNode;
          }

          if (textNode.__style !== "") {
            textNode.setStyle("");
          }
          if (textNode.__format !== 0) {
            textNode.setFormat(0);
          }
          const nearestBlockElement =
            $getNearestBlockElementAncestorOrThrow(textNode);
          if (nearestBlockElement.__format !== 0) {
            nearestBlockElement.setFormat("");
          }
          if (nearestBlockElement.__indent !== 0) {
            nearestBlockElement.setIndent(0);
          }
          node = textNode;
        } else if ($isHeadingNode(node) || $isQuoteNode(node)) {
          node.replace($createParagraphNode(), true);
        } else if ($isDecoratorBlockNode(node)) {
          node.setFormat("");
        }
      });
    }
  });
};
