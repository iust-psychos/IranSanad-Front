import React, { useEffect, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { richTextActions, richTextOptions } from "./rich-text-actions";

import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
} from "lexical";
import {
  $patchStyleText,
  $getSelectionStyleValueForProperty,
} from "@lexical/selection";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
} from "@lexical/list";

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const onAction = (id) => {
    switch (id) {
      case richTextActions.Bold:
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        break;
      case richTextActions.Italics:
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        break;
      case richTextActions.Underline:
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        break;
      case richTextActions.Strikethrough:
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        break;
      case richTextActions.LeftAlign:
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        break;
      case richTextActions.CenterAlign:
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        break;
      case richTextActions.RightAlign:
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        break;
      default:
        break;
    }
  };

  const [isBold, setBold] = useState(false);
  const [isItalic, setItalic] = useState(false);
  const [isUnderline, setUnderline] = useState(false);
  const [isStrikethrough, setStrikethrough] = useState(false);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState("14");

  useEffect(() => {
    return editor.registerCommand(
      editor.SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          setBold(selection.hasFormat("bold"));
          setItalic(selection.hasFormat("italic"));
          setUnderline(selection.hasFormat("underline"));
          setStrikethrough(selection.hasFormat("strikethrough"));

          const family = $getSelectionStyleValueForProperty(
            selection,
            "font-family",
            fontFamily
          );
          const size = $getSelectionStyleValueForProperty(
            selection,
            "font-size",
            `${fontSize}px`
          );
          if (family) setFontFamily(family.replace(/['"]/g, ""));
          if (size) setFontSize(parseInt(size));
        }
        return false;
      },

      0
    );
  }, [editor, fontFamily, fontSize]);

  const fontOptions = [
    "Arial",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Verdana",
  ];

  const fontSizes = [
    8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 72,
  ];

  return (
    <div className="toolbar">
      {richTextOptions.map(({ id, icon, label }) => (
        <button aria-label={label} onClick={() => onAction(id)}>
          {icon}
        </button>
      ))}
      {/* Bold
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        className={isBold ? "active" : ""}
        aria-label="Bold"
      >
        <svg
          width="14"
          height="16"
          viewBox="0 0 14 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.85936 15.5C11.6496 15.5 14 13.847 14 11.2071C14 9.22111 12.2291 7.7354 9.81746 7.57877V7.49513C10.741 7.37764 11.5845 6.98512 12.1957 6.3884C12.8068 5.79167 13.1455 5.03002 13.1505 4.24088C13.1505 1.94465 11.0593 0.5 7.72619 0.5H0V15.5H7.85936ZM3.71642 2.83881H6.76874C8.50186 2.83881 9.49891 3.52464 9.49891 4.73054C9.49891 5.99878 8.36689 6.73783 6.3854 6.73783H3.71642V2.83881ZM3.71642 13.1612V8.80596H6.82993C9.02018 8.80596 10.2134 9.55414 10.2134 10.9577C10.2134 12.3917 9.05618 13.1612 6.91631 13.1612H3.71642Z"
            fill="black"
          />
        </svg>
      </button>

      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        className={isItalic ? "active" : ""}
        aria-label="Italic"
      >
        <svg
          width="13"
          height="18"
          viewBox="0 0 13 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.4 1.5H8.7M8.7 1.5H12M8.7 1.5L4.3 16.5M4.3 16.5H1M4.3 16.5H7.6"
            stroke="black"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
        className={isUnderline ? "active" : ""}
        aria-label="Underline"
      >
        <svg
          width="15"
          height="18"
          viewBox="0 0 15 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.8333 1.5V7.92857C11.8333 9.06521 11.3768 10.1553 10.5641 10.959C9.75147 11.7628 8.64927 12.2143 7.5 12.2143C6.35073 12.2143 5.24853 11.7628 4.43587 10.959C3.62321 10.1553 3.16667 9.06521 3.16667 7.92857V1.5M1 16.5H14"
            stroke="black"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <button
        onClick={() =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
        }
        className={isStrikethrough ? "active" : ""}
        aria-label="Strikethrough"
      >
        <svg
          width="17"
          height="18"
          viewBox="0 0 17 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 9H16M12.0717 1.5H6.89C6.08518 1.50023 5.30669 1.78678 4.6938 2.30841C4.0809 2.83004 3.67358 3.5527 3.5447 4.34714C3.41582 5.14157 3.57379 5.95594 3.99034 6.64458C4.40689 7.33321 5.05486 7.85118 5.81833 8.10583L8.5 9M3.5 16.5H10.11C10.6968 16.5 11.2736 16.3477 11.7839 16.0579C12.2942 15.7682 12.7205 15.3509 13.0212 14.847C13.3219 14.3431 13.4866 13.7697 13.4993 13.183C13.5119 12.5963 13.372 12.0164 13.0933 11.5"
            stroke="black"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <select
        value={fontFamily}
        onChange={(e) => {
          const newFont = e.target.value;
          setFontFamily(newFont);
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              // Apply font-family style via lexical selection
              $patchStyleText(selection, { "font-family": newFont });
            }
          });
        }}
        aria-label="Font Family"
      >
        {fontOptions.map((font) => (
          <option key={font} value={font}>
            {font}
          </option>
        ))}
      </select>

      <div className="font-size-controls">
        <button
          onClick={() => {
            // Increase font size to next in list
            const current = parseInt(fontSize) || fontSizes[0];
            const nextIndex = fontSizes.indexOf(current) + 1;
            const newSize = fontSizes[nextIndex] || current;
            setFontSize(newSize);
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                $patchStyleText(selection, { "font-size": `${newSize}px` });
              }
            });
          }}
          aria-label="Increase Font Size"
        >
          +
        </button>
        <input
          type="number"
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
          onBlur={() => {
            // Apply manually typed size
            const newSize = parseInt(fontSize) || fontSizes[0];
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                $patchStyleText(selection, { "font-size": `${newSize}px` });
              }
            });
          }}
          style={{ width: "3em" }}
        />
        <button
          onClick={() => {
            // Decrease font size to previous in list
            const current = parseInt(fontSize) || fontSizes[0];
            const prevIndex = Math.max(0, fontSizes.indexOf(current) - 1);
            const newSize = fontSizes[prevIndex];
            setFontSize(newSize);
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                $patchStyleText(selection, { "font-size": `${newSize}px` });
              }
            });
          }}
          aria-label="Decrease Font Size"
        >
          –
        </button>
      </div>

      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}
        aria-label="Align Left"
      >
        <svg
          width="20"
          height="17"
          viewBox="0 0 20 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 8.5H10.6M1 16H19M1 1H19"
            stroke="black"
            stroke-width="1.5"
            stroke-miterlimit="10"
            stroke-linecap="round"
          />
        </svg>
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}
        aria-label="Align Center"
      >
        <svg
          width="23"
          height="17"
          viewBox="0 0 23 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.00037 8.5H18.9996M8.49962 16H14.5004M1 1H22"
            stroke="black"
            stroke-width="1.5"
            stroke-miterlimit="10"
            stroke-linecap="round"
          />
        </svg>
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}
        aria-label="Align Right"
      >
        <svg
          width="20"
          height="17"
          viewBox="0 0 20 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 8.5H9.4M19 1H1M19 16H1"
            stroke="black"
            stroke-width="1.5"
            stroke-miterlimit="10"
            stroke-linecap="round"
          />
        </svg>
      </button>

      <button
        onClick={() => {
          // Left-to-right direction
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $patchStyleText(selection, { direction: "ltr", unicodeBidi: "" });
            }
          });
        }}
        aria-label="Left-to-Right"
      >
        <svg
          width="16"
          height="19"
          viewBox="0 0 16 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.28201 1.5109V11.6198C7.28201 11.7641 7.23302 11.8844 7.13504 11.9807C7.03706 12.0771 6.91561 12.1253 6.77069 12.1253C6.62576 12.1253 6.50465 12.0768 6.40735 11.9797C6.31005 11.8827 6.26107 11.7627 6.26039 11.6198V7.30332H5.80928C4.85672 7.30332 4.04942 6.97243 3.38739 6.31063C2.72536 5.64883 2.39434 4.84618 2.39434 3.90267C2.39434 2.95917 2.72536 2.15618 3.38739 1.49371C4.04942 0.831237 4.85672 0.5 5.80928 0.5H11.6584C11.8033 0.5 11.9244 0.548523 12.0217 0.645569C12.119 0.742615 12.168 0.862911 12.1687 1.00646C12.1693 1.15001 12.1203 1.26997 12.0217 1.36634C11.923 1.46271 11.8019 1.5109 11.6584 1.5109H10.2458V11.6198C10.2458 11.7634 10.1969 11.8834 10.0989 11.9797C10.0009 12.0761 9.87944 12.1246 9.73452 12.1253C9.58959 12.126 9.46848 12.0774 9.37118 11.9797C9.27389 11.882 9.22524 11.762 9.22524 11.6198V1.5109H7.28201ZM6.26141 6.29243V1.5109H5.80928C5.14385 1.5109 4.57843 1.74542 4.11304 2.21448C3.64764 2.68286 3.41494 3.24627 3.41494 3.9047C3.41494 4.56245 3.64764 5.12518 4.11304 5.59289C4.57843 6.05992 5.14385 6.29344 5.80928 6.29344L6.26141 6.29243ZM14.3752 15.994H0.510308C0.365383 15.994 0.244271 15.9455 0.146974 15.8484C0.0496764 15.7514 0.000687392 15.6311 6.99042e-06 15.4875C-0.000673412 15.344 0.0483156 15.224 0.146974 15.1277C0.245632 15.0313 0.366744 14.9831 0.510308 14.9831H14.3558L12.7106 13.3535C12.6017 13.2457 12.5473 13.1234 12.5473 12.9866C12.5473 12.8491 12.6017 12.7264 12.7106 12.6186C12.8195 12.5108 12.943 12.4569 13.0811 12.4569C13.2192 12.4569 13.343 12.5108 13.4526 12.6186L15.752 14.8972C15.9173 15.0603 16 15.251 16 15.4693C16 15.6877 15.9173 15.8781 15.752 16.0405L13.4526 18.3383C13.3614 18.4461 13.2454 18.5 13.1045 18.5C12.9637 18.5 12.8389 18.4461 12.73 18.3383C12.6211 18.2304 12.5667 18.1111 12.5667 17.9804C12.5667 17.8497 12.6211 17.7304 12.73 17.6225L14.3752 15.994Z"
            fill="black"
          />
        </svg>
      </button>
      <button
        onClick={() => {
          // Right-to-left direction
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $patchStyleText(selection, {
                direction: "rtl",
                unicodeBidi: "bidi-override",
              });
            }
          });
        }}
        aria-label="Right-to-Left"
      >
        <svg
          width="16"
          height="19"
          viewBox="0 0 16 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.95235 1.51203V11.6324C6.95235 11.7767 6.90336 11.8972 6.80538 11.9936C6.70741 12.0901 6.58595 12.1384 6.44103 12.1384C6.2961 12.1384 6.17499 12.0898 6.07769 11.9926C5.9804 11.8955 5.93141 11.7754 5.93073 11.6324V7.31097H5.47962C4.52706 7.31097 3.71976 6.9797 3.05773 6.31716C2.3957 5.65462 2.06468 4.85106 2.06468 3.9065C2.06468 2.96194 2.3957 2.15805 3.05773 1.49483C3.71976 0.831609 4.52706 0.5 5.47962 0.5H11.3287C11.4736 0.5 11.5947 0.548578 11.692 0.645733C11.7893 0.742888 11.8383 0.863319 11.839 1.00703C11.8397 1.15074 11.7907 1.27083 11.692 1.36731C11.5934 1.46379 11.4723 1.51203 11.3287 1.51203H9.91618V11.6324C9.91618 11.7761 9.86719 11.8962 9.76922 11.9926C9.67124 12.0891 9.54979 12.1377 9.40486 12.1384C9.25993 12.139 9.13882 12.0905 9.04153 11.9926C8.94423 11.8948 8.89558 11.7747 8.89558 11.6324V1.51203H6.95235ZM1.60541 16.0114L3.27001 17.661C3.36527 17.7521 3.4129 17.8675 3.4129 18.0071C3.4129 18.1468 3.36561 18.2639 3.27103 18.3583C3.17646 18.4528 3.05637 18.5 2.91076 18.5C2.76447 18.5 2.64336 18.4528 2.54743 18.3583L0.248007 16.0772C0.0826689 15.9105 0 15.7159 0 15.4933C0 15.2706 0.0826689 15.0773 0.248007 14.9134L2.54743 12.6322C2.65629 12.5243 2.77672 12.4703 2.90872 12.4703C3.04072 12.4703 3.16115 12.5243 3.27001 12.6322C3.37888 12.7402 3.43331 12.863 3.43331 13.0006C3.43331 13.1383 3.37888 13.2607 3.27001 13.368L1.62582 14.9994H15.4897C15.6346 14.9994 15.7557 15.048 15.853 15.1451C15.951 15.2423 16 15.3627 16 15.5064C16 15.6501 15.951 15.7702 15.853 15.8667C15.7551 15.9632 15.6339 16.0114 15.4897 16.0114H1.60541ZM5.93175 6.29995V1.51203H5.47962C4.81419 1.51203 4.24877 1.74682 3.78338 2.21641C3.31798 2.68531 3.08528 3.24935 3.08528 3.90852C3.08528 4.56702 3.31798 5.13038 3.78338 5.59862C4.24877 6.06618 4.81419 6.29995 5.47962 6.29995H5.93175Z"
            fill="black"
          />
        </svg>
      </button>

      <button
        onClick={() =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        }
        aria-label="Bullet List"
      >
        <svg
          width="20"
          height="16"
          viewBox="0 0 20 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.25 3C1.58152 3 1.89946 2.8683 2.13388 2.63388C2.3683 2.39946 2.5 2.08152 2.5 1.75C2.5 1.41848 2.3683 1.10054 2.13388 0.866116C1.89946 0.631696 1.58152 0.5 1.25 0.5C0.918479 0.5 0.600537 0.631696 0.366116 0.866116C0.131696 1.10054 0 1.41848 0 1.75C0 2.08152 0.131696 2.39946 0.366116 2.63388C0.600537 2.8683 0.918479 3 1.25 3ZM5 1.75C5 1.58424 5.06585 1.42527 5.18306 1.30806C5.30027 1.19085 5.45924 1.125 5.625 1.125H19.375C19.5408 1.125 19.6997 1.19085 19.8169 1.30806C19.9342 1.42527 20 1.58424 20 1.75C20 1.91576 19.9342 2.07473 19.8169 2.19194C19.6997 2.30915 19.5408 2.375 19.375 2.375H5.625C5.45924 2.375 5.30027 2.30915 5.18306 2.19194C5.06585 2.07473 5 1.91576 5 1.75ZM5 8C5 7.83424 5.06585 7.67527 5.18306 7.55806C5.30027 7.44085 5.45924 7.375 5.625 7.375H19.375C19.5408 7.375 19.6997 7.44085 19.8169 7.55806C19.9342 7.67527 20 7.83424 20 8C20 8.16576 19.9342 8.32473 19.8169 8.44194C19.6997 8.55915 19.5408 8.625 19.375 8.625H5.625C5.45924 8.625 5.30027 8.55915 5.18306 8.44194C5.06585 8.32473 5 8.16576 5 8ZM5.625 13.625C5.45924 13.625 5.30027 13.6908 5.18306 13.8081C5.06585 13.9253 5 14.0842 5 14.25C5 14.4158 5.06585 14.5747 5.18306 14.6919C5.30027 14.8092 5.45924 14.875 5.625 14.875H19.375C19.5408 14.875 19.6997 14.8092 19.8169 14.6919C19.9342 14.5747 20 14.4158 20 14.25C20 14.0842 19.9342 13.9253 19.8169 13.8081C19.6997 13.6908 19.5408 13.625 19.375 13.625H5.625ZM2.5 14.25C2.5 14.5815 2.3683 14.8995 2.13388 15.1339C1.89946 15.3683 1.58152 15.5 1.25 15.5C0.918479 15.5 0.600537 15.3683 0.366116 15.1339C0.131696 14.8995 0 14.5815 0 14.25C0 13.9185 0.131696 13.6005 0.366116 13.3661C0.600537 13.1317 0.918479 13 1.25 13C1.58152 13 1.89946 13.1317 2.13388 13.3661C2.3683 13.6005 2.5 13.9185 2.5 14.25ZM1.25 9.25C1.58152 9.25 1.89946 9.1183 2.13388 8.88388C2.3683 8.64946 2.5 8.33152 2.5 8C2.5 7.66848 2.3683 7.35054 2.13388 7.11612C1.89946 6.8817 1.58152 6.75 1.25 6.75C0.918479 6.75 0.600537 6.8817 0.366116 7.11612C0.131696 7.35054 0 7.66848 0 8C0 8.33152 0.131696 8.64946 0.366116 8.88388C0.600537 9.1183 0.918479 9.25 1.25 9.25Z"
            fill="black"
          />
        </svg>
      </button>

      <button
        onClick={() =>
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        }
        aria-label="Numbered List"
      >
        <svg
          width="25"
          height="18"
          viewBox="0 0 25 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.39804 1.46915V4.81221H3.35665V0.373596H2.59137L1.26221 1.26776L1.64082 1.94443L2.39804 1.46915Z"
            fill="black"
          />
          <path
            d="M2.48659 7.43834C2.5696 7.43061 2.65332 7.43992 2.7326 7.46569C2.81189 7.49146 2.88508 7.53316 2.94768 7.58822C3.01028 7.64328 3.06098 7.71054 3.09667 7.78589C3.13235 7.86124 3.15227 7.94308 3.1552 8.0264C3.1552 8.33251 2.98603 8.62251 2.45437 9.04946L0.843255 10.3142V11.1197H4.17826V10.2256H2.29326L3.09881 9.60529C3.90437 9.0414 4.12992 8.58223 4.12992 7.99418C4.12311 7.79329 4.0753 7.59592 3.98941 7.41419C3.90352 7.23247 3.78137 7.07022 3.63048 6.93744C3.47958 6.80465 3.30313 6.70412 3.11195 6.64204C2.92078 6.57995 2.71893 6.55761 2.51881 6.5764C2.18309 6.57445 1.85171 6.65232 1.55199 6.80358C1.25226 6.95484 0.992779 7.17517 0.794922 7.4464L1.40714 8.03446C1.53015 7.8598 1.69123 7.71538 1.87823 7.61212C2.06523 7.50885 2.27326 7.44943 2.48659 7.43834Z"
            fill="black"
          />
          <path
            d="M3.28432 15.3489C3.51299 15.2918 3.7162 15.1603 3.86201 14.9751C4.00782 14.7899 4.08798 14.5615 4.08987 14.3258C4.08987 13.625 3.46154 13.1094 2.47876 13.1094C2.1537 13.1038 1.83176 13.1736 1.53823 13.3134C1.24471 13.4531 0.987593 13.6591 0.787096 13.915L1.34293 14.495C1.47157 14.3404 1.63129 14.2147 1.81171 14.1258C1.99212 14.037 2.1892 13.9871 2.39015 13.9794C2.82515 13.9794 3.13126 14.1889 3.13126 14.5111C3.13126 14.8333 2.84126 15.0106 2.32571 15.0106H1.85849V15.8161H2.37404C2.97015 15.8161 3.23599 15.9853 3.23599 16.3236C3.23599 16.662 2.95404 16.8714 2.43043 16.8714C2.20893 16.8697 1.99016 16.8223 1.7878 16.7322C1.58544 16.6421 1.40383 16.5112 1.25432 16.3478L0.69043 16.9761C0.914933 17.2228 1.1905 17.4176 1.49795 17.547C1.8054 17.6764 2.13736 17.7372 2.47071 17.7253C3.50987 17.7253 4.18654 17.1695 4.18654 16.4042C4.18591 16.1498 4.09479 15.904 3.92949 15.7106C3.76419 15.5173 3.5355 15.3891 3.28432 15.3489Z"
            fill="black"
          />
          <path
            d="M24.1162 2.75C24.1162 2.53635 24.0313 2.33146 23.8803 2.18038C23.7292 2.02931 23.5243 1.94444 23.3107 1.94444H6.05566V3.55555H23.3107C23.5243 3.55555 23.7292 3.47068 23.8803 3.31961C24.0313 3.16854 24.1162 2.96364 24.1162 2.75Z"
            fill="black"
          />
          <path
            d="M23.3107 8.38889H6.05566V10H23.3107C23.5243 10 23.7292 9.91513 23.8803 9.76406C24.0313 9.61298 24.1162 9.40809 24.1162 9.19444C24.1162 8.98079 24.0313 8.7759 23.8803 8.62483C23.7292 8.47376 23.5243 8.38889 23.3107 8.38889Z"
            fill="black"
          />
          <path
            d="M23.3107 14.8333H6.05566V16.4444H23.3107C23.5243 16.4444 23.7292 16.3596 23.8803 16.2085C24.0313 16.0574 24.1162 15.8525 24.1162 15.6389C24.1162 15.4252 24.0313 15.2203 23.8803 15.0693C23.7292 14.9182 23.5243 14.8333 23.3107 14.8333Z"
            fill="black"
          />
        </svg>
      </button> */}
    </div>
  );
}

export default ToolbarPlugin;
