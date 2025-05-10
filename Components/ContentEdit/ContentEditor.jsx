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

const ContentEditor = () => {
  const { doc_uuid } = useParams();
  const doc = useLoaderData();
  const nameRef = useRef();
  /* Share Modal */
  const [showShareModal, setShowShareModal] = useState(false);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const shareModalRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      renameDocument(doc_uuid, nameRef.current.value);
      nameRef.current.blur();
    }
  };

  return (
    <div className="content-editor">
      <menu className="navbar">
        <button className="menu-logo">
          <IconLogo />
        </button>
        <input
          type="text"
          className="content-name"
          autoFocus={false}
          defaultValue={doc.title}
          ref={nameRef}
          onKeyDown={handleKeyDown}
          onBlur={() => renameDocument(doc_uuid, nameRef.current.value)}
        />

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
      <HistoryModal open={openHistoryModal} setOpen={setOpenHistoryModal} />
      <div className="fix-scrollbar"></div>
      <Editor doc_uuid={doc_uuid} />
    </div>
  );
};

export default ContentEditor;
