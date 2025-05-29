import { useRef, useState, useEffect } from "react";
import Editor from "./Editor";
import UserProfileDropdown from "@/pages/UserDashboard/UserProfileDropdown";
import "@/pages/ContentEdit/index.css";
import { IconComment, IconHistory, IconShare } from "@/pages/ContentEdit/Icons";
import Share from "@/Components/Share";
import { useParams, useLoaderData, useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import { renameDocument } from "@/managers/userDashboardManager";
import HistoryModal from "@/pages/ContentEdit/HistoryModal";
import { getMenuBlueprint } from "@/pages/ContentEdit/MenubarConfig";
import MenubarDropdown from "@/pages/ContentEdit/MenubarDropdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import FindReplaceModal from "@/pages/ContentEdit/FindReplaceModal";
import Commentsystem from "@/components/Comment/CommentSystem";
import CookieManager from "@/managers/CookieManager";
import axios from "axios";
import { useTheme } from "@/src/ThemeContext";
import logo_dark from "/images/logo_dark.png";
import logo_light from "/images/logo_light.png";

const getUserInfoAPI = "http://iransanad.fiust.ir/api/v1/auth/info/";

const ContentEditor = () => {
  const { doc_uuid } = useParams();
  const doc = useLoaderData();
  // const doc = { doc_uuid: "abcdefg", title: "گزارش" };
  const [initialName, setInitialName] = useState(doc.title);
  const nameRef = useRef();
  const triggeredByCode = useRef(false);
  const [editor] = useLexicalComposerContext();
  /* Added By Erfan */
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const shareModalRef = useRef(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);

  const [openFindReplaceDialog, setOpenFindReplaceDialog] = useState(false);

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        setOpenFindReplaceDialog(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
        <button className="menu-logo" onClick={() => navigate("/landing")}>
          <img
            style={{ width: "50px", height: "50px" }}
            src={isDarkMode ? logo_dark : logo_light}
            alt=""
          />
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
            {getMenuBlueprint(editor, () => setOpenFindReplaceDialog(true)).map(
              (section) => (
                <MenubarDropdown
                  key={section.label}
                  mainLabel={section.label}
                  items={section.items}
                />
              )
            )}
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
      {openFindReplaceDialog && (
        <FindReplaceModal
          onClose={() => setOpenFindReplaceDialog(false)}
          isOpen={openFindReplaceDialog}
        />
      )}
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
