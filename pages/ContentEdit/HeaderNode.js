// HeaderNode.js
import { ElementNode, $isElementNode, $applyNodeReplacement } from 'lexical';

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
    element.contentEditable = 'true';
    return element;
  }

  updateDOM(prevNode, dom) {
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

  remove() {
    return false;
  }

  canInsertTextBefore() { return false; }
  canInsertTextAfter() { return true; }
}

export function $createHeaderNode() {
  return new HeaderNode();
}

export function $isHeaderNode(node) {
  return node instanceof HeaderNode;
}