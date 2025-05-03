import { useRef, useState } from "react";
import Editor from "./Editor";
import { IconLogo } from "../user-dashboard/components/Icons";
import UserProfileDropdown from "../user-dashboard/components/UserProfileDropdown";
import "./content-editor.css";
import { IconShare } from "./Icons";
import Share from "../Share";
import { useParams } from "react-router-dom";
import { useLoaderData } from "react-router-dom";
import ReactDOM from "react-dom";
import { renameDocument } from "../../Managers/user-dashboard-manager";

const ContentEditor = () => {
  const { doc_uuid } = useParams();
  const doc = useLoaderData();
  const nameRef = useRef();
  /* Share Modal */
  const [showShareModal, setShowShareModal] = useState(false);
  const shareModalRef = useRef(null);
  
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
          onBlur={() => renameDocument(doc_uuid, nameRef.current.value)}
        />

        <button
          className="menu-button menu-share"
          onClick={() => setShowShareModal(true)}
        >
          <IconShare />
          <p>اشتراک گذاری</p>
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

      <Editor doc_uuid={doc_uuid} />
    </div>
  );
};

export default ContentEditor;
