// HeaderNode.js
import { ElementNode } from 'lexical';

export class HeaderNode extends ElementNode {
  static getType() {
    return 'header';
  }

  static clone(node) {
    return new HeaderNode(node.__key);
  }

  createDOM(config) {
    const element = document.createElement('header');
    element.className = config.theme.header || 'editor-header';
    return element;
  }

  updateDOM() {
    return false;
  }

  static importJSON(serializedNode) {
    return $createHeaderNode();
  }

  exportJSON() {
    return {
      ...super.exportJSON(),
      type: 'header',
      version: 1,
    };
  }
}

export function $createHeaderNode() {
  return new HeaderNode();
}

export function $isHeaderNode(node) {
  return node instanceof HeaderNode;
}