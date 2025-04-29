import {
  IconBold,
  IconCenterAlign,
  IconItalics,
  IconLeftAlign,
  IconRightAlign,
  IconStrikethrough,
  IconUnderline,
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
  {
    id: richTextActions.Strikethrough,
    icon: <IconStrikethrough />,
    label: "Strikethrough",
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
];
