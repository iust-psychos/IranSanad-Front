import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from "@lexical/markdown";
import { $generateHtmlFromNodes } from "@lexical/html";
import { $getRoot } from "lexical";
import html2pdf from "html2pdf.js";

export const getLexicalHtml = (editor) => {
  let htmlString = "";
  editor.read(() => {
    htmlString = $generateHtmlFromNodes(editor, null);
  });
  return htmlString;
};

export const convertLexicalToHtml = (editor) => {
  const htmlString = getLexicalHtml(editor);

  const blob = new Blob([htmlString], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "lexical-content.html";

  anchor.click();

  URL.revokeObjectURL(url);
};

export const convertLexicalToMarkdown = (editor) => {
  let markdownString;
  editor.read(() => {
    markdownString = $convertToMarkdownString(TRANSFORMERS);
  });
  const blob = new Blob([markdownString], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "lexical-content.md";

  anchor.click();

  URL.revokeObjectURL(url);
};

export const convertLexicalToPlainText = (editor) => {
  let plainText = "";
  editor.read(() => {
    plainText = $getRoot().getTextContent();
  });
  console.log(plainText);

  const blob = new Blob([plainText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "lexical-content.txt";
  anchor.click();
  URL.revokeObjectURL(url);
};

export const convertLexicalToPdf = (editor) => {
  const html = getLexicalHtml(editor);

  const container = document.createElement("div");
  container.innerHTML = html;
  document.body.appendChild(container);

  html2pdf()
    .set({ filename: "lexical-content.pdf" })
    .from(container)
    .save()
    .then(() => {
      container.remove();
    });
};

export const convertLexicalToDocx = async (editor) => {};

export const convertToLexical = () => {};

export const convertHtmlToLexical = () => {};

export const convertMarkdownToLexical = () => {};
