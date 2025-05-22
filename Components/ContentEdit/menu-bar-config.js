// export const menuBlueprint = [
//   {
//     label: "فایل",
//     items: [
//       { label: "جدید", action: () => newDoc() },
//       { label: "باز کردن", action: () => openDoc() },
//       { label: "ایجاد کپی", action: () => saveDoc() },
//       { label: "به اشتراک گذاری", action: () => downloadAsPdf() },
//       { label: "ایمیل", action: () => downloadAsPdf() },
//       { label: "دانلود", action: () => downloadAsPdf() },
//     ],
//   },
//   {
//     label: "ویرایش",
//     items: [
//       { label: "واگرد", action: () => editor?.commands.undo() },
//       { label: "از نو", action: () => editor?.commands.redo() },
//       { label: "برش", action: () => editor?.commands.cut() },
//       { label: "کپی", action: () => editor?.commands.copy() },
//       { label: "چسباندن", action: () => editor?.commands.paste() },
//       { label: "انتخاب همه", action: () => editor?.commands.selectAll() },
//       { label: "حذف", action: () => editor?.commands.selectAll() },
//       {
//         label: "جست و جو و جایگزینی",
//         action: () => editor?.commands.selectAll(),
//       },
//     ],
//   },
//   {
//     label: "نمایش",
//     items: [
//       { label: "خط کش", action: () => toggleRuler() },
//       { label: "خطوط راهنما", action: () => toggleGuides() },
//       { label: "نمای طرح", action: () => togglePrintLayout() },
//     ],
//   },
//   {
//     label: "درج",
//     items: [
//       { label: "تصویر", action: () => insertImage() },
//       { label: "جدول", action: () => insertTable() },
//       { label: "پیوند", action: () => insertLink() },
//       { label: "خط افقی", action: () => insertHorizontalRule() },
//     ],
//   },
//   {
//     label: "قالب‌ بندی",
//     items: [
//       { label: "درشت", action: () => editor?.commands.toggleBold() },
//       { label: "مورب", action: () => editor?.commands.toggleItalic() },
//       { label: "زیرخط‌دار", action: () => editor?.commands.toggleUnderline() },
//       {
//         label: "ترازبندی چپ",
//         action: () => editor?.commands.setTextAlign("left"),
//       },
//       {
//         label: "ترازبندی وسط",
//         action: () => editor?.commands.setTextAlign("center"),
//       },
//       {
//         label: "ترازبندی راست",
//         action: () => editor?.commands.setTextAlign("right"),
//       },
//     ],
//   },
// ];

export const getMenuBlueprint = (editor) => [
  {
    label: "فایل",
    items: [
      { label: "جدید", action: () => newDoc() },
      { label: "باز کردن", action: () => openDoc() },
      { label: "ایجاد کپی", action: () => saveDoc() },
      { label: "به اشتراک گذاری", action: () => downloadAsPdf() },
      { label: "ایمیل", action: () => downloadAsPdf() },
      { label: "دانلود", action: () => downloadAsPdf() },
    ],
  },
  {
    label: "ویرایش",
    items: [
      { label: "واگرد", action: () => editor.dispatchCommand("UNDO_COMMAND") },
      { label: "از نو", action: () => editor.dispatchCommand("REDO_COMMAND") },
      { label: "برش", action: () => document.execCommand("cut") },
      { label: "کپی", action: () => document.execCommand("copy") },
      { label: "چسباندن", action: () => document.execCommand("paste") },
      { label: "انتخاب همه", action: () => document.execCommand("selectAll") },
      { label: "حذف", action: () => document.execCommand("delete") },
      {
        label: "جست و جو و جایگزینی",
        action: () => openFindReplaceDialog(),
      },
    ],
  },
  {
    label: "نمایش",
    items: [
      { label: "خط کش", action: () => toggleRuler() },
      { label: "خطوط راهنما", action: () => toggleGuides() },
      { label: "نمای طرح", action: () => togglePrintLayout() },
    ],
  },
  {
    label: "درج",
    items: [
      { label: "تصویر", action: () => insertImage(editor) },
      { label: "جدول", action: () => insertTable(editor) },
      { label: "پیوند", action: () => insertLink(editor) },
      { label: "خط افقی", action: () => insertHorizontalRule(editor) },
    ],
  },
  {
    label: "قالب‌ بندی",
    items: [
      {
        label: "درشت",
        action: () => editor.dispatchCommand("FORMAT_TEXT_COMMAND", "bold"),
      },
      {
        label: "مورب",
        action: () => editor.dispatchCommand("FORMAT_TEXT_COMMAND", "italic"),
      },
      {
        label: "زیرخط‌دار",
        action: () =>
          editor.dispatchCommand("FORMAT_TEXT_COMMAND", "underline"),
      },
      {
        label: "ترازبندی چپ",
        action: () => editor.dispatchCommand("FORMAT_ELEMENT_COMMAND", "left"),
      },
      {
        label: "ترازبندی وسط",
        action: () =>
          editor.dispatchCommand("FORMAT_ELEMENT_COMMAND", "center"),
      },
      {
        label: "ترازبندی راست",
        action: () => editor.dispatchCommand("FORMAT_ELEMENT_COMMAND", "right"),
      },
    ],
  },
];
