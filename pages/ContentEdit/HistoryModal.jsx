import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import { IconBack, IconDown, IconUp } from "@/pages/ContentEdit/Icons";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { editorConfig as initialEditorConfig } from "@/pages/ContentEdit/EditorConfig";
import {
  IconUserProfileDefault,
  IconVerticalOptions,
} from "@/pages/UserDashboard/Icons";

export default function HistoryModal({ open, setOpen }) {
  const editorConfig = {
    editable: false,
    ...initialEditorConfig,
  };
  const nameRef = useRef();
  const versions = [
    { date: "15 فروردین 1404", user: "مهران رزاقی", selected: true },
    { date: "14 فروردین 1404", user: "مهران رزاقی", selected: false },
    { date: "13 فروردین 1404", user: "مهران رزاقی", selected: false },
    { date: "15 فروردین 1404", user: "مهران رزاقی", selected: false },
    { date: "14 فروردین 1404", user: "مهران رزاقی", selected: false },
    { date: "13 فروردین 1404", user: "مهران رزاقی", selected: false },
    { date: "15 فروردین 1404", user: "مهران رزاقی", selected: false },
    { date: "14 فروردین 1404", user: "مهران رزاقی", selected: false },
    { date: "13 فروردین 1404", user: "مهران رزاقی", selected: false },
    { date: "15 فروردین 1404", user: "مهران رزاقی", selected: false },
    { date: "14 فروردین 1404", user: "مهران رزاقی", selected: false },
    { date: "13 فروردین 1404", user: "مهران رزاقی", selected: false },
  ];

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Backdrop className="user-dashboard rename-modal backdrop" />
        <Dialog.Popup className="history-modal popup">
          <div className="sidebar-header-container">
            <p className="sidebar-title">تاریخچه تغییرات</p>
            <Dialog.Close className="close">
              <IconBack />
            </Dialog.Close>
          </div>
          <div className="sidebar-content-container">
            {versions.map((item, index) => (
              <button className="timeline-item" key={index}>
                <div
                  className={`timeline-circle ${index === 0 ? "selected" : ""}`}
                />
                <div className="timeline-content">
                  <div className="timeline-header">{item.date}</div>
                  <div className="timeline-meta">
                    <span className="avatar">
                      <IconUserProfileDefault />
                    </span>
                    <span>{item.user}</span>
                    <span className="dot">•</span>
                    <span>{item.date}</span>
                  </div>
                </div>
                <div className="timeline-menu">
                  <IconVerticalOptions />
                </div>
              </button>
            ))}
          </div>
          <div className="navbar">
            <input
              type="text"
              className="version-name"
              tabIndex={-1}
              defaultValue="14 فروردین 1404"
              ref={nameRef}
              // onKeyDown={handleKeyDown}
              // onBlur={() => renameDocument(doc_uuid, nameRef.current.value)}
            />
            <button className="restore">بازیابی</button>
          </div>
          <div className="toolbar">
            <p>تغییر 1 از 1</p>
            <button>
              <IconUp />
            </button>
            <button>
              <IconDown />
            </button>
          </div>
          <div className="document">
            <LexicalComposer initialConfig={editorConfig}>
              <div className="editor-container">
                <RichTextPlugin
                  contentEditable={<ContentEditable className="editor-input" />}
                  ErrorBoundary={LexicalErrorBoundary}
                />
              </div>
            </LexicalComposer>
          </div>
          {/* <Dialog.Close className="content-edit history-modal button button-cancel">
                لغو
              </Dialog.Close> */}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
