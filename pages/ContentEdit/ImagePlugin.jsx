import React from 'react';
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  createCommand,
  DecoratorNode
} from "lexical";
import { useEffect } from "react";

export const INSERT_IMAGE_COMMAND = createCommand("INSERT_IMAGE_COMMAND");

function ImageComponent({ src, altText }) {
  return (
    <div style={{ display: 'inline-block' }}>
      <img 
        src={src} 
        alt={altText} 
        style={{ 
          maxWidth: '100%',
          height: 'auto',
          display: 'block',
          margin: '10px 0'
        }} 
      />
    </div>
  );
}

export class ImageNode extends DecoratorNode {
  __src;
  __altText;

  static getType() {
    return "image";
  }

  static clone(node) {
    return new ImageNode(node.__src, node.__altText, node.__key);
  }

  constructor(src, altText, key) {
    super(key);
    this.__src = src;
    this.__altText = altText;
  }

  static importJSON(serializedNode) {
    const { src, altText } = serializedNode;
    return $createImageNode({ src, altText });
  }

  exportJSON() {
    return {
      src: this.__src,
      altText: this.__altText,
      type: "image",
      version: 1,
    };
  }

  createDOM() {
    const div = document.createElement('div');
    div.style.display = 'inline-block';
    return div;
  }

  updateDOM() {
    return false;
  }

  decorate() {
    return <ImageComponent src={this.__src} altText={this.__altText} />;
  }

  getSrc() {
    return this.__src;
  }

  getAltText() {
    return this.__altText;
  }
}

export function $createImageNode({ src, altText }) {
  return new ImageNode(src, altText);
}

export function $isImageNode(node) {
  return node instanceof ImageNode;
}

export function ImagePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error("ImagePlugin: ImageNode not registered on editor");
    }

    return mergeRegister(
      editor.registerCommand(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          const { src, altText } = payload;
          const imageNode = $createImageNode({ src, altText });
          const selection = $getSelection();

          if ($isRangeSelection(selection)) {
            selection.insertNodes([imageNode]);
          }
          return true;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor]);

  return null;
}