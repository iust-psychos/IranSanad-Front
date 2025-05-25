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
import { getMenuBlueprint } from "./menu-bar-config";
import MenubarDropdown from "./MenuBarDropdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

/* Added By Erfan */
import Commentsystem from "../Comment/CommentSystem";
import CookieManager from "../../Managers/CookieManager";
import axios from "axios";
const getUserInfoAPI = "http://iransanad.fiust.ir/api/v1/auth/info/";

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
      })
      .catch((error) => console.log(error));
  }, []);

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
    <div
      className={`content-editor ${openCommentSystem ? "with-comments" : ""}`}
    >
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
      <HistoryModal open={openHistoryModal} setOpen={setOpenHistoryModal} />
    </div>
  );
};

export default ContentEditor;
