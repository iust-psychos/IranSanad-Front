import { ElementNode } from 'lexical';

export class FooterNode extends ElementNode {
  static getType() {
    return 'footer';
  }

  static clone(node) {
    return new FooterNode(node.__key);
  }

  createDOM(config) {
    const element = document.createElement('footer');
    element.className = config.theme.Footer || 'editor-footer';
    return element;
  }

  updateDOM() {
    return false;
  }

  static importJSON(serializedNode) {
    return $createFooterNode();
  }

  exportJSON() {
    return {
      ...super.exportJSON(),
      type: 'footer',
      version: 1,
    };
  }
}

export function $createFooterNode() {
  return new FooterNode();
}

export function $isFooterNode(node) {
  return node instanceof FooterNode;
}