import { useRef, useState } from "react";
import Editor from "./Editor";
import { IconLogo } from "../user-dashboard/components/Icons";
import UserProfileDropdown from "../user-dashboard/components/UserProfileDropdown";
import "./content-editor.css";
import { IconComment, IconHistory, IconShare } from "./Icons";
import Share from "../Share";
import { useParams } from "react-router-dom";
import { useLoaderData } from "react-router-dom";
import ReactDOM from "react-dom";
import { renameDocument } from "../../Managers/user-dashboard-manager";
import HistoryModal from "./HistoryModal";
import { getMenuBlueprint } from "./menu-bar-config";
import MenubarDropdown from "./MenuBarDropdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

const ContentEditor = () => {
  const { doc_uuid } = useParams();
  const doc = useLoaderData();
  // const doc = { doc_uuid: "abcdefg", title: "گزارش" };
  const [initialName, setInitialName] = useState(doc.title);
  const nameRef = useRef();
  const triggeredByCode = useRef(false);
  const [editor] = useLexicalComposerContext();
  /* Share Modal */
  const shareModalRef = useRef(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      triggeredByCode.current = true;
      await renameDocument(doc_uuid, initialName);
      doc.title = initialName;
      nameRef.current.blur();
      editor.focus();
    } else if (e.key === "Escape") {
      triggeredByCode.current = true;
      nameRef.current.blur();
      setInitialName(doc.title);
      editor.focus();
    }
  };

  const handleBlur = async () => {
    if (triggeredByCode.current) {
      triggeredByCode.current = false;
      return;
    } else {
      await renameDocument(doc_uuid, initialName);
      doc.title = initialName;
    }
  };

  return (
    <div className="content-editor">
      <menu className="navbar">
        <button className="menu-logo">
          <IconLogo />
        </button>
        <div className="document-header">
          <input
            type="text"
            className="content-name"
            autoFocus={false}
            value={initialName}
            ref={nameRef}
            onChange={(e) => setInitialName(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
          />
          <menu className="menubar">
            {getMenuBlueprint(editor).map((section) => (
              <MenubarDropdown
                key={section.label}
                mainLabel={section.label}
                items={section.items}
              />
            ))}
          </menu>
        </div>

        <button
          className="menu-button menu-history"
          onClick={() => setOpenHistoryModal(true)}
        >
          <IconHistory />
        </button>
        <button
          className="menu-button menu-comment"
          // onClick={() => setShowShareModal(true)}
        >
          <IconComment />
        </button>
        <button
          className="menu-button menu-share"
          onClick={() => setShowShareModal(true)}
        >
          <IconShare />
        </button>
        <UserProfileDropdown />
      </menu>

      {showShareModal &&
        ReactDOM.createPortal(
          <div className="share-modal-overlay">
            <div ref={shareModalRef}>
              <Share
                onClose={() => setShowShareModal(false)}
                doc_uuid={doc_uuid}
              />
            </div>
          </div>,
          document.body
        )}
      <div className="fix-scrollbar"></div>
      <Editor doc_uuid={doc_uuid} />
      <HistoryModal open={openHistoryModal} setOpen={setOpenHistoryModal} />
    </div>
  );
};

export default ContentEditor;
