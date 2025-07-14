import { useState, useEffect, useRef, useCallback } from "react";
import { createWebsocketProvider } from "./Provider";
import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { $getRoot, $createParagraphNode, $createTextNode } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import ToolbarPlugin from "@/pages/ContentEdit/ToolbarPlugin";
import axios from "axios";
import CookieManager from "@/managers/CookieManager";
import { ImageNode, ImagePlugin, INSERT_IMAGE_COMMAND } from "./ImagePlugin";
import "@/styles/EditorTable.css";
import { HeaderPlugin } from "./HeaderPlugin";
import { FooterPlugin } from "./FooterPlugin";

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
  const [editor] = useLexicalComposerContext();
  const [yjsProvider, setYjsProvider] = useState(null);
  const [connected, setConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageContents, setPageContents] = useState([""]);

  const uploadImage = async (file) => {
    try {
      // این می تونه حذف بشه اگه تو بک نیاریم
      const formData = new FormData();
      formData.append("image", file);

      const token = CookieManager.LoadToken();
      const response = await axios.post(
        "http://your-api-endpoint/upload",
        formData,
        {
          headers: {
            Authorization: `JWT ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return {
        src: response.data.url,
        altText: file.name,
      };
    } catch (error) {
      console.error("Image upload failed:", error);
      // Fallback to local URL if upload fails
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            src: reader.result,
            altText: file.name,
          });
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handlePaste = useCallback(
    (event) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          if (file) {
            event.preventDefault();
            uploadImage(file).then(({ src, altText }) => {
              editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src, altText });
            });
          }
        }
      }
    },
    [editor]
  );

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      const files = event.dataTransfer?.files;
      if (!files || files.length === 0) return;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith("image/")) {
          uploadImage(file).then(({ src, altText }) => {
            editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src, altText });
          });
        }
      }
    },
    [editor]
  );

  // User info handling
  const handleGetUserInformation = async () => {
    try {
      const token = CookieManager.LoadToken();
      const response = await axios.get(
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
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
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
    setPageContents((prev) => [...prev]);
    setCurrentPage(newPage);
  };

  const addNewPage = () => {
    setPageContents((prev) => [...prev, ""]);
    setTotalPages((prev) => prev + 1);
    setCurrentPage(totalPages);
  };

  return (
    <>
      <ToolbarPlugin />

      <div
        className="editor-container"
        ref={containerRef}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="page-controls">
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
          </div>

          <div className="active-users">
            <h4>Active Users:</h4>
            <ul>
              {activeUsers.map((user) => (
                <li key={user.userId} style={{ color: user.color }}>
                  {user.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <PageContentManager
          currentPage={currentPage}
          pageContents={pageContents}
        />

        <RichTextPlugin
          contentEditable={
            <ContentEditable className="editor-input" onPaste={handlePaste} />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <CheckListPlugin />
        <TabIndentationPlugin maxIndent={7} />
        <AutoFocusPlugin />
        <HistoryPlugin />
        <ListPlugin />
        <ImagePlugin />
        <HeaderPlugin />
        <FooterPlugin />
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
          id={`${doc_uuid}/page-${currentPage}`}
          providerFactory={providerFactory}
          shouldBootstrap={true}
          username={userInfo?.username || "Anonymous"}
          cursorColor="red"
          cursorsContainerRef={containerRef}
        />
      </div>
    </>
  );
}
