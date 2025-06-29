import { ElementNode, $applyNodeReplacement } from 'lexical';

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
    element.contentEditable = 'true';
    return element;
  }

  updateDOM(prevNode, dom) {
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

  remove() {
    return false;
  }

  canInsertTextBefore() { return true; }
  canInsertTextAfter() { return false; }
}

export function $createFooterNode() {
  return $applyNodeReplacement(new FooterNode());
}

export function $isFooterNode(node) {
  return node instanceof FooterNode;
}