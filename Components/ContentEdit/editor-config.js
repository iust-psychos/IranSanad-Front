import { HeadingNode } from "@lexical/rich-text";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { ListNode, ListItemNode } from "@lexical/list";
import { TableNode, TableRowNode, TableCellNode } from "@lexical/table";
const theme = {
  code: "editor-code",
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3",
    h4: "editor-heading-h4",
    h5: "editor-heading-h5",
  },
  image: "editor-image",
  link: "editor-link",
  list: {
    listitem: "editor-listitem",
    nested: {
      listitem: "editor-nested-listitem",
    },
    ol: "editor-list-ol",
    ul: "editor-list-ul",
  },
  ltr: "ltr",
  paragraph: "editor-paragraph",
  placeholder: "editor-placeholder",
  quote: "editor-quote",
  rtl: "rtl",
  text: {
    code: "editor-text-code",
    hashtag: "editor-text-hashtag",
    overflowed: "editor-text-overflowed",
    bold: "editor-text-bold",
    underline: "editor-text-underline",
    strikethrough: "editor-text-strikethrough",
    underlineStrikethrough: "editor-text-underlineStrikethrough",
    italic: "editor-text-italic",
    code: "editor-code",
    highlight: "editor-highlight",
  },
};

export const editorConfig = {
  editorState: null,
  namespace: "Editor-1",
  theme: theme,
  onError: (error) => console.error(error),
  nodes: [
    HeadingNode,
    CodeHighlightNode,
    CodeNode,
    ListNode,
    ListItemNode,
    TableNode,
    TableRowNode,
    TableCellNode,
  ],
};

export const FONT_SIZES = [
  8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72,
];

export const DEFAULT_FONT_SIZE = 12;

export const FONT_FAMILY = [
  "Arial",
  "Verdana",
  "Helvetica",
  "Tahoma",
  "Trebuchet MS",
  "Times New Roman",
  "Georgia",
  "Garamond",
  "Courier New",
  "Lucida Console",
  "Brush Script MT",
  "Impact",
];
