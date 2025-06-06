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
  IconHeader,
  IconFooter,
} from "@/pages/ContentEdit/Icons";
import {
  IconCheckList,
  IconCodeBlock,
  IconHeading1,
  IconHeading2,
  IconHeading3,
  IconNormalParagraph,
  IconOrderedList,
  IconQuote,
  IconUnorderedList,
} from "./Icons";
import { IconDropdown } from "./Buttons";

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
  Block: {
    Update: "block-update",
    Normal: "block-normal",
    Heading1: "block-heading1",
    Heading2: "block-heading2",
    Heading3: "block-heading3",
    OrderedList: "block-orderedList",
    UnorderedList: "block-unorderedList",
    CheckList: "block-checkList",
    Quote: "block-quote",
    CodeBlock: "block-codeBlock",
  },
  InsertHeader: "insertHeader",
  InsertFooter: "insertFooter",
};

export const blockTypeToBlockName = {
  paragraph: richTextActions.Block.Normal,
  h1: richTextActions.Block.Heading1,
  h2: richTextActions.Block.Heading2,
  h3: richTextActions.Block.Heading3,
  number: richTextActions.Block.OrderedList,
  bullet: richTextActions.Block.UnorderedList,
  check: richTextActions.Block.CheckList,
  quote: richTextActions.Block.Quote,
  code: richTextActions.Block.CodeBlock,
};

export const blockTypeMapping = [
  { lexical: "paragraph", id: richTextActions.Block.Normal },
  { lexical: "h1", id: richTextActions.Block.Heading1 },
  { lexical: "h2", id: richTextActions.Block.Heading2 },
  { lexical: "h3", id: richTextActions.Block.Heading3 },
  { lexical: "number", id: richTextActions.Block.OrderedList },
  { lexical: "bullet", id: richTextActions.Block.UnorderedList },
  { lexical: "check", id: richTextActions.Block.CheckList },
  { lexical: "quote", id: richTextActions.Block.Quote },
  { lexical: "code", id: richTextActions.Block.CodeBlock },
];

export const lexicalToBlockId = {};
export const blockIdToLexical = {};

blockTypeMapping.forEach(({ lexical, id }) => {
  lexicalToBlockId[lexical] = id;
  blockIdToLexical[id] = lexical;
});

const richTextBlockActions = [
  {
    id: richTextActions.Block.Normal,
    label: "Normal",
    Icon: (iconProps) => <IconNormalParagraph {...iconProps} />,
  },
  {
    id: richTextActions.Block.Heading1,
    label: "Heading 1",
    Icon: (iconProps) => <IconHeading1 {...iconProps} />,
  },
  {
    id: richTextActions.Block.Heading2,
    label: "Heading 2",
    Icon: (iconProps) => <IconHeading2 {...iconProps} />,
  },
  {
    id: richTextActions.Block.Heading3,
    label: "Heading 3",
    Icon: (iconProps) => <IconHeading3 {...iconProps} />,
  },
  {
    id: richTextActions.Block.OrderedList,
    label: "Ordered List",
    Icon: (iconProps) => <IconOrderedList {...iconProps} />,
  },
  {
    id: richTextActions.Block.UnorderedList,
    label: "Unordered List",
    Icon: (iconProps) => <IconUnorderedList {...iconProps} />,
  },
  {
    id: richTextActions.Block.CheckList,
    label: "Check List",
    Icon: (iconProps) => <IconCheckList {...iconProps} />,
  },
  {
    id: richTextActions.Block.Quote,
    label: "Quote",
    Icon: (iconProps) => <IconQuote {...iconProps} />,
  },
  {
    id: richTextActions.Block.CodeBlock,
    label: "Code Block",
    Icon: (iconProps) => <IconCodeBlock {...iconProps} />,
  },
];

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
  {
    id: richTextActions.Divider,
    component: IconDivider1,
  },
  {
    id: richTextActions.Block.Update,
    component: IconDropdown,
    props: {
      id: richTextActions.Block.Update,
      label: "Change Block format",
      items: richTextBlockActions,
      defaultValue: richTextActions.Block.Normal,
    },
  },
  {
    id: richTextActions.InsertHeader,
    component: IconButton,
    props: {
      id: richTextActions.InsertHeader,
      label: "Insert Header",
      Icon: (iconProps) => <IconHeader {...iconProps} />,
    },
  },
  {
    id: richTextActions.InsertFooter,
    component: IconButton,
    props: {
      id: richTextActions.InsertFooter,
      label: "Insert Footer",
      Icon: (iconProps) => <IconFooter {...iconProps} />,
    },
  },
];
