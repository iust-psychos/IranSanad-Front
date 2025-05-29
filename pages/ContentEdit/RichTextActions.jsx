import {
  Dropdown,
  IconButton,
  InputDropdown,
} from "@/pages/ContentEdit/Buttons";
import {
  DEFAULT_FONT_SIZE,
  FONT_FAMILY,
  FONT_SIZES,
} from "@/pages/ContentEdit/EditorConfig";
import {
  IconBold,
  IconCenterAlign,
  IconClearFormatting,
  IconCode,
  IconDivider1,
  IconHighlight,
  IconItalics,
  IconJustify,
  IconLeftAlign,
  IconPlus,
  IconMinus,
  IconRedo,
  IconRightAlign,
  IconStrikethrough,
  IconSubscript,
  IconSuperscript,
  IconUnderline,
  IconUndo,
} from "@/pages/ContentEdit/Icons";

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
  FontFamily: "fontFamily",
  FontSize: {
    Increment: "fontSize-increment",
    Decrement: "fontSize-decrement",
    Update: "fontSize-update",
  },
  ClearFormatting: "clearFormatting",
};

export const richTextOptions = [
  {
    id: richTextActions.Redo,
    component: IconButton,
    props: {
      id: richTextActions.Redo,
      label: "Redo",
      Icon: (iconProps) => <IconRedo {...iconProps} />,
    },
  },
  {
    id: richTextActions.Undo,
    component: IconButton,
    props: {
      id: richTextActions.Undo,
      label: "Undo",
      Icon: (iconProps) => <IconUndo {...iconProps} />,
    },
  },
  {
    id: richTextActions.Divider,
    component: IconDivider1,
  },
  {
    id: richTextActions.Bold,
    component: IconButton,
    props: {
      id: richTextActions.Bold,
      label: "Bold",
      Icon: (iconProps) => <IconBold {...iconProps} />,
    },
  },
  {
    id: richTextActions.Italics,
    component: IconButton,
    props: {
      id: richTextActions.Italics,
      label: "Italics",
      Icon: (iconProps) => <IconItalics {...iconProps} />,
    },
  },
  {
    id: richTextActions.Underline,
    component: IconButton,
    props: {
      id: richTextActions.Underline,
      label: "Underline",
      Icon: (iconProps) => <IconUnderline {...iconProps} />,
    },
  },
  {
    id: richTextActions.Highlight,
    component: IconButton,
    props: {
      id: richTextActions.Highlight,
      label: "Highlight",
      Icon: (iconProps) => <IconHighlight {...iconProps} color="yellow" />,
    },
  },
  {
    id: richTextActions.Strikethrough,
    component: IconButton,
    props: {
      id: richTextActions.Strikethrough,
      label: "Strikethrough",
      Icon: (iconProps) => <IconStrikethrough {...iconProps} />,
    },
  },
  {
    id: richTextActions.Superscript,
    component: IconButton,
    props: {
      id: richTextActions.Superscript,
      label: "Superscript",
      Icon: (iconProps) => <IconSuperscript {...iconProps} />,
    },
  },
  {
    id: richTextActions.Subscript,
    component: IconButton,
    props: {
      id: richTextActions.Subscript,
      label: "Subscript",
      Icon: (iconProps) => <IconSubscript {...iconProps} />,
    },
  },
  {
    id: richTextActions.Code,
    component: IconButton,
    props: {
      id: richTextActions.Code,
      label: "Code",
      Icon: (iconProps) => <IconCode {...iconProps} />,
    },
  },
  {
    id: richTextActions.ClearFormatting,
    component: IconButton,
    props: {
      id: richTextActions.ClearFormatting,
      label: "Clear Formatting",
      Icon: (iconProps) => <IconClearFormatting {...iconProps} />,
    },
  },
  {
    id: richTextActions.FontSize.Increment,
    component: IconButton,
    props: {
      id: richTextActions.FontSize.Increment,
      label: "Increment Font Size",
      Icon: (iconProps) => <IconPlus {...iconProps} />,
    },
  },
  {
    id: richTextActions.FontSize.Update,
    component: Dropdown,
    props: {
      id: richTextActions.FontSize.Update,
      label: "Font Size",
      items: FONT_SIZES,
      option: "font-size",
      defaultValue: DEFAULT_FONT_SIZE,
    },
  },
  {
    id: richTextActions.FontSize.Decrement,
    component: IconButton,
    props: {
      id: richTextActions.FontSize.Decrement,
      label: "Decrement Font Size",
      Icon: (iconProps) => <IconMinus {...iconProps} />,
    },
  },
  {
    id: richTextActions.FontFamily,
    component: Dropdown,
    props: {
      id: richTextActions.FontFamily,
      label: "Font Family",
      items: FONT_FAMILY,
      option: "font-family",
      defaultValue: "Arial",
    },
  },
  {
    id: richTextActions.Divider,
    component: IconDivider1,
  },
  {
    id: richTextActions.RightAlign,
    component: IconButton,
    props: {
      id: richTextActions.RightAlign,
      label: "Align Right",
      Icon: (iconProps) => <IconRightAlign {...iconProps} />,
    },
  },
  {
    id: richTextActions.CenterAlign,
    component: IconButton,
    props: {
      id: richTextActions.CenterAlign,
      label: "Align Center",
      Icon: (iconProps) => <IconCenterAlign {...iconProps} />,
    },
  },
  {
    id: richTextActions.LeftAlign,
    component: IconButton,
    props: {
      id: richTextActions.LeftAlign,
      label: "Align Left",
      Icon: (iconProps) => <IconLeftAlign {...iconProps} />,
    },
  },
  {
    id: richTextActions.JustifyAlign,
    component: IconButton,
    props: {
      id: richTextActions.JustifyAlign,
      label: "Justify Align",
      Icon: (iconProps) => <IconJustify {...iconProps} />,
    },
  },
  // {
  //   id: richTextActions.FontFamily,
  //   component: (
  //     <InputDropdown id={richTextActions.FontFamily} label="Font Family" />
  //   ),
  // },
];
