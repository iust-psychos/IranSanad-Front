import { useRef, useState, useEffect } from "react";
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

/* Added By Erfan */
import Commentsystem from "../Comment/CommentSystem";
import CookieManager from "../../Managers/CookieManager";
import axios from "axios";
const getUserInfoAPI = "http://iransanad.fiust.ir/api/v1/auth/info/";

const ContentEditor = () => {
  const { doc_uuid } = useParams();
  const doc = useLoaderData();
  const nameRef = useRef();
  /* Share Modal */
  const [showShareModal, setShowShareModal] = useState(false);
  const shareModalRef = useRef(null);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);

  /* Added By Erfan */
  const [openCommentSystem, setOpenCommentSystem] = useState(false);
  const [user, setUser] = useState(null);
  const token = CookieManager.LoadToken();
  useEffect(() => {
    axios
      .get(`${getUserInfoAPI}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
      })
      .then((response) => {
        setUser(response.data);
        console.log(response);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      renameDocument(doc_uuid, nameRef.current.value);
      nameRef.current.blur();
    }
  };

  return (
    <div
      className={`content-editor ${openCommentSystem ? "with-comments" : ""}`}
    >
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
          onClick={() => setOpenCommentSystem(true)}
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

      {/* Added By Erfan  */}
      {openCommentSystem && (
        <Commentsystem
          documentId={doc_uuid}
          currentUser={user}
          onClose={() => setOpenCommentSystem(false)}
        />
      )}

      <div className="fix-scrollbar"></div>
      <Editor doc_uuid={doc_uuid} />
    </div>
  );
};

export default ContentEditor;
