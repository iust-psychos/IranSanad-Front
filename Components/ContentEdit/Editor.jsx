import { useState, useEffect, useRef, useCallback, forwardRef } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { HeadingNode } from "@lexical/rich-text";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { createWebsocketProvider } from "./providers";
import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ListNode, ListItemNode } from "@lexical/list";
import ToolbarPlugin from "./ToolbarPlugin";
import theme from "./theme";

const editorConfig = {
  editorState: null,
  namespace: "Editor-1",
  theme: theme,
  onError: (error) => console.error(error),
  nodes: [HeadingNode, CodeHighlightNode, CodeNode, ListNode, ListItemNode],
};

const Editor = ({ doc_uuid }) => {
  const providerName = "websockets";
  const containerRef = useRef(null);
  const [yjsProvider, setYjsProvider] = useState(null);
  const [connected, setConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);

  const handleAwarenessUpdate = useCallback(() => {
    const awareness = yjsProvider.awareness;
    setActiveUsers(
      Array.from(awareness.getStates().entries()).map(
        ([userId, { color, name }]) => ({
          color,
          name,
          userId,
        })
      )
    );
  }, [yjsProvider]);

  useEffect(() => {
    if (yjsProvider == null) {
      return;
    }

    yjsProvider.awareness.on("update", handleAwarenessUpdate);

    return () => yjsProvider.awareness.off("update", handleAwarenessUpdate);
  }, [yjsProvider, handleAwarenessUpdate]);

  const providerFactory = useCallback(
    (id, yjsDocMap) => {
      const provider = createWebsocketProvider(id, yjsDocMap);
      provider.on("status", (event) => {
        setConnected(
          event.status === "connected" ||
            ("connected" in event && event.connected === true)
        );
      });
      setTimeout(() => setYjsProvider(provider), 0);

      return provider;
    },
    [providerName]
  );

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <ToolbarPlugin />
      <div className="editor-container">
        <RichTextPlugin
          contentEditable={<ContentEditable className="editor-input" />}
          ErrorBoundary={LexicalErrorBoundary}
        />

        <AutoFocusPlugin />

        <HistoryPlugin />

        <ListPlugin />

        <OnChangePlugin onChange={() => {}} />

        <CollaborationPlugin
          id={doc_uuid}
          providerFactory={providerFactory}
          shouldBootstrap={true}
          username="Test"
          cursorColor="Red"
          cursorsContainerRef={containerRef}
        />
      </div>
    </LexicalComposer>
  );
};
export default Editor;
