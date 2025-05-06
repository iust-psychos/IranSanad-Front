import {
  IconBold,
  IconCenterAlign,
  IconCode,
  IconHighlight,
  IconItalics,
  IconJustify,
  IconLeftAlign,
  IconRedo,
  IconRightAlign,
  IconStrikethrough,
  IconSubscript,
  IconSuperscript,
  IconUnderline,
  IconUndo,
} from "./Icons";

export const richTextActions = {
  Bold: "bold",
  Italics: "italics",
  Underline: "underline",
  Strikethrough: "strikethrough",
  Superscript: "superscript",
  Subscript: "subscript",
  Highlight: "highlight",
  Code: "code",
  LeftAlign: "leftAlign",
  CenterAlign: "centerAlign",
  RightAlign: "rightAlign",
  JustifyAlign: "justifyAlign",
  Divider: "divider",
  Undo: "undo",
  Redo: "redo",
};

export const richTextOptions = [
  { id: richTextActions.Bold, icon: <IconBold />, label: "Bold" },
  { id: richTextActions.Italics, icon: <IconItalics />, label: "Italics" },
  {
    id: richTextActions.Underline,
    icon: <IconUnderline />,
    label: "Underline",
  },
  { id: richTextActions.Divider },
  {
    id: richTextActions.Highlight,
    icon: <IconHighlight />,
    label: "Highlight",
  },
  {
    id: richTextActions.Strikethrough,
    icon: <IconStrikethrough />,
    label: "Strikethrough",
  },
  {
    id: richTextActions.Superscript,
    icon: <IconSuperscript />,
    label: "Superscript",
  },
  {
    id: richTextActions.Subscript,
    icon: <IconSubscript />,
    label: "Subscript",
  },
  {
    id: richTextActions.Code,
    icon: <IconCode />,
    label: "Code",
  },
  {
    id: richTextActions.Divider,
  },
  {
    id: richTextActions.RightAlign,
    icon: <IconRightAlign />,
    label: "Align Right",
  },
  {
    id: richTextActions.CenterAlign,
    icon: <IconCenterAlign />,
    label: "Align Center",
  },
  {
    id: richTextActions.LeftAlign,
    icon: <IconLeftAlign />,
    label: "Align Left",
  },
  {
    id: richTextActions.JustifyAlign,
    icon: <IconJustify />,
    label: "Justify Align",
  },
  {
    id: richTextActions.Divider,
  },
  {
    id: richTextActions.Redo,
    icon: <IconRedo />,
    label: "Redo",
  },
  {
    id: richTextActions.Undo,
    icon: <IconUndo />,
    label: "Undo",
  },
];
