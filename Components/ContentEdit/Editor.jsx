import { useState, useEffect, useRef, useCallback, forwardRef } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { createWebsocketProvider } from "./providers";
import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $getRoot, $createParagraphNode, $createTextNode } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import ToolbarPlugin from "./ToolbarPlugin";
import { editorConfig } from "./editor-config";
import axios from "axios";
import CookieManager from "../../Managers/CookieManager";
import "../../Styles/editortable.css";

function PageContentManager({ currentPage, pageContents }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      const root = $getRoot();
      root.clear();
      const paragraph = $createParagraphNode();

      if (pageContents[currentPage]) {
        paragraph.append($createTextNode(pageContents[currentPage]));
      }

      root.append(paragraph);
    });
  }, [currentPage, editor]);

  return null;
}

export default function Editor({ doc_uuid }) {
  const containerRef = useRef(null);
  const [yjsProvider, setYjsProvider] = useState(null);
  const [connected, setConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageContents, setPageContents] = useState([""]);

  const handleGetUserInformation = async () => {
    try {
      let token = CookieManager.LoadToken();
      let response = await axios.get(
        "http://iransanad.fiust.ir/api/v1/auth/info/",
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      return null;
    }
  };
  useEffect(() => {
    if (userInfo === null) {
      handleGetUserInformation().then((data) => {
        if (data) {
          setUserInfo(data);
        }
      });
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo && yjsProvider) {
      yjsProvider.awareness.setLocalStateField("user", {
        name: userInfo.username,
        color: "#" + Math.floor(Math.random() * 16777215).toString(16), // Random color
      });
    }
  }, [userInfo, yjsProvider]);
  const handleAwarenessUpdate = useCallback(() => {
    if (!yjsProvider) return;
    const awareness = yjsProvider.awareness;
    const users = Array.from(awareness.getStates().entries()).map(
      ([userId, state]) => ({
        userId,
        name: state.user?.name || "Unknown",
        color: state.user?.color || "#ccc",
      })
    );
    setActiveUsers(users);
  }, [yjsProvider]);

  useEffect(() => {
    if (!yjsProvider) return;
    yjsProvider.awareness.on("update", handleAwarenessUpdate);
    return () => {
      yjsProvider.awareness.off("update", handleAwarenessUpdate);
    };
  }, [yjsProvider, handleAwarenessUpdate]);

  // ... (keep all other existing useEffect hooks and functions the same)
  const providerFactory = useCallback((id, yjsDocMap) => {
    const provider = createWebsocketProvider(id, yjsDocMap);
    provider.on("status", (event) => {
      setConnected(
        event.status === "connected" ||
          ("connected" in event && event.connected === true)
      );
    });
    setTimeout(() => setYjsProvider(provider), 0);
    return provider;
  }, []);
  const handlePageChange = (newPage) => {
    // Save current content before switching
    setPageContents((prev) => {
      const updated = [...prev];
      // We'll update the current page content via OnChangePlugin
      return updated;
    });
    setCurrentPage(newPage);
  };

  const addNewPage = () => {
    setPageContents((prev) => [...prev, ""]);
    setTotalPages((prev) => prev + 1);
    setCurrentPage(totalPages);
  };

  return (
    // <LexicalComposer initialConfig={editorConfig}>
    <>
      <ToolbarPlugin />

      <div className="editor-container" ref={containerRef}>
        {/* <RichTextPlugin
          contentEditable={<ContentEditable className="editor-input" />}
          ErrorBoundary={LexicalErrorBoundary}
        /> */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* <div className="page-controls">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              Previous Page
            </button>
            <span>
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
            >
              Next Page
            </button>
            <button onClick={addNewPage}>Add New Page</button>
          </div> */}

          <div className="active-users">
            <h4>کاربران فعال:</h4>
            <ul>
              {activeUsers.map((user) => (
                <li key={user.userId} style={{ color: user.color }}>
                  {user.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="editor-inner" ref={containerRef}>
          <PageContentManager
            currentPage={currentPage}
            pageContents={pageContents}
          />
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            ErrorBoundary={LexicalErrorBoundary}
          />

          <AutoFocusPlugin />
          <HistoryPlugin />
          <ListPlugin />
          <OnChangePlugin
            onChange={(editorState) => {
              editorState.read(() => {
                const content = $getRoot().getTextContent();
                setPageContents((prev) => {
                  const updated = [...prev];
                  updated[currentPage] = content;
                  return updated;
                });
              });
            }}
          />

          <CollaborationPlugin
            id={`${doc_uuid}-page-${currentPage}`}
            providerFactory={providerFactory}
            shouldBootstrap={true}
            username={userInfo?.username || "Anonymous"}
            cursorColor="red"
            cursorsContainerRef={containerRef}
          />
        </div>
      </div>
    </>
    // </LexicalComposer>
  );
}
