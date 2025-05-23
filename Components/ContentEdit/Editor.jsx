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
import '../../Styles/editortable.css';

const PAGE_WIDTH = 1094;
const PAGE_HEIGHT = 1523;
const PAGE_MARGIN = 72;


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
const PageContainer = forwardRef(({ children, isLastPage }, ref) => {
  return (
    <div 
      ref={ref}
      className={`editor-page ${isLastPage ? 'last-page' : ''}`}
      style={{
        width: `${PAGE_WIDTH}px`,
        minHeight: `${PAGE_HEIGHT}px`,
        margin: '20px auto',
        backgroundColor: 'white',
        boxShadow: '0 0 5px rgba(0,0,0,0.1)',
        position: 'relative',
        border: '1px solid #e0e0e0',
        overflow: 'visible', // Changed from hidden to visible for tables
      }}
    >
      <div 
        style={{
          padding: `${PAGE_MARGIN}px`,
          height: '100%',
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'visible', // Allow tables to extend
        }}
      >
        {children}
      </div>
      
      {!isLastPage && (
        <div 
          className="page-break" 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '1px',
            backgroundColor: '#ccc',
          }}
        />
      )}
    </div>
  );
});
export default function Editor({ doc_uuid }) {
  const containerRef = useRef(null);
  const pagesContainerRef = useRef(null);
  const [yjsProvider, setYjsProvider] = useState(null);
  const [connected, setConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageContents, setPageContents] = useState([""]);
  const pageRefs = useRef([]);
  const [activeEditor, setActiveEditor] = useState(null);

  const handleEditorReady = useCallback((editor) => {
    setActiveEditor(editor);
  }, []);

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

  const handleEditorChange = useCallback((editorState) => {
    editorState.read(() => {
      const content = $getRoot().getTextContent();
      setPageContents(prev => {
        const updated = [...prev];
        updated[currentPage] = content;
        return updated;
      });
    });
  }, [currentPage]);

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

  const handleScroll = useCallback(() => {
    if (!pagesContainerRef.current) return;
    
    const container = pagesContainerRef.current;
    const scrollPosition = container.scrollTop;
    const containerHeight = container.clientHeight;
    
    // Find which page is currently in view
    let current = 0;
    for (let i = 0; i < pageRefs.current.length; i++) {
      const page = pageRefs.current[i];
      if (page) {
        const rect = page.getBoundingClientRect();
        const pageTop = rect.top + scrollPosition - container.offsetTop;
        const pageBottom = pageTop + rect.height;
        
        // If more than 50% of the page is visible
        if (scrollPosition + (containerHeight / 2) >= pageTop && 
            scrollPosition + (containerHeight / 2) <= pageBottom) {
          current = i;
          break;
        }
      }
    }
    
    setCurrentPage(current);
  }, []);

  useEffect(() => {
    const container = pagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);

  // Auto-add pages when content overflows
  const checkForOverflow = useCallback(() => {
    const lastPageRef = pageRefs.current[pageRefs.current.length - 1];
    if (lastPageRef) {
      const lastPageHeight = lastPageRef.scrollHeight;
      const lastPageClientHeight = lastPageRef.clientHeight;
      
      // If content exceeds page height by more than 10px
      if (lastPageHeight > lastPageClientHeight + 10) {
        setTotalPages(prev => prev + 1);
        setPageContents(prev => [...prev, ""]);
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(checkForOverflow, 500);
    return () => clearTimeout(timer);
  }, [pageContents, checkForOverflow]);

  return (
    <div className="editor-wrapper">
      <ToolbarPlugin currentPage={currentPage} editor={activeEditor}/>
      
      <div className="editor-status">
        <span>Page {currentPage + 1} of {totalPages}</span>
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

      <div 
        className="pages-container" 
        ref={pagesContainerRef}
        style={{
          height: 'calc(100vh - 150px)',
          overflowY: 'auto',
          padding: '20px',
          backgroundColor: '#f5f5f5'
        }}
      >
        {Array.from({ length: totalPages }).map((_, index) => (
          <PageContainer 
            key={index}
            ref={el => pageRefs.current[index] = el}
            isLastPage={index === totalPages - 1}
          >
            <LexicalComposer initialConfig={editorConfig}>
            <PageContentManager 
              currentPage={currentPage}
              pageContents={pageContents}
            />
              <RichTextPlugin
                contentEditable={<ContentEditable className="editor-input" />}
                placeholder={
                  <div className="editor-placeholder"></div>
                }
                ErrorBoundary={LexicalErrorBoundary}
              />

              <AutoFocusPlugin />
              <HistoryPlugin />
              <ListPlugin />
              <OnChangePlugin
                onChange={handleEditorChange}
              />

              <CollaborationPlugin
                id={`${doc_uuid}-page-${index}`}
                providerFactory={providerFactory}
                shouldBootstrap={true}
                username={userInfo?.username || "Anonymous"}
                cursorColor="red"
                cursorsContainerRef={containerRef}
              />
            </LexicalComposer>
          </PageContainer>
        ))}
      </div>
    </div>
  );
}