import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useCallback, useEffect, useRef, useState } from "react";
import Editor from "./Editor";
import ExampleTheme from "./ExampleTheme";
import { getRandomUserProfile } from "./getRandomUserProfile";
import { createWebsocketProvider } from "./providers";
import { IconLogo } from "../user-dashboard/components/Icons";
import UserProfileDropdown from "../user-dashboard/components/UserProfileDropdown";
import "./content-editor.css";
import { IconShare } from "./Icons";
import Share from "../Share";
import { useParams } from "react-router-dom";
import { ListNode, ListItemNode } from "@lexical/list";
import { useLoaderData } from "react-router-dom";
import ReactDOM from "react-dom";

// interface ActiveUserProfile extends UserProfile {
//   userId: number;
// }

const editorConfig = {
  editorState: null,
  namespace: "React.js Collab Demo",
  nodes: [ListNode, ListItemNode],
  onError: (error) => console.error(error),
  theme: ExampleTheme,
};

const ContentEditor = () => {
  const nameRef = useRef();
  const providerName = "websockets";
  // const [userProfile, setUserProfile] = useState(() => getRandomUserProfile());
  // const containerRef = useRef(null);
  const [yjsProvider, setYjsProvider] = useState(null);
  const [connected, setConnected] = useState(false);
  // const [activeUsers, setActiveUsers] = useState([]);
  const { doc_uuid } = useParams();
  const doc = useLoaderData();

  // const handleAwarenessUpdate = useCallback(() => {
  //   const awareness = yjsProvider.awareness;
  //   setActiveUsers(
  //     Array.from(awareness.getStates().entries()).map(
  //       ([userId, { color, name }]) => ({
  //         color,
  //         name,
  //         userId,
  //       })
  //     )
  //   );
  // }, [yjsProvider]);

  // useEffect(() => {
  //   if (yjsProvider == null) {
  //     return;
  //   }

  //   yjsProvider.awareness.on("update", handleAwarenessUpdate);

  //   return () => yjsProvider.awareness.off("update", handleAwarenessUpdate);
  // }, [yjsProvider, handleAwarenessUpdate]);

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

  /* Share Modal */
  const [showShareModal, setShowShareModal] = useState(false);
  const shareModalRef = useRef(null);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (
  //       shareModalRef.current &&
  //       !shareModalRef.current.contains(event.target)
  //     ) {
  //       setShowShareModal(false);
  //     }
  //   };

  //   if (showShareModal) {
  //     document.addEventListener("mousedown", handleClickOutside);
  //   }

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [showShareModal]);

  return (
    // {/* <p>
    //   <b>Used provider:</b>{' '}
    //   {providerName === 'webrtc'
    //     ? 'WebRTC (within browser communication via BroadcastChannel fallback, unless run locally)'
    //     : 'Websockets (cross-browser communication)'}
    //   <br />
    //   {window.location.hostname === 'localhost' ? (
    //     providerName === 'webrtc' ? (
    //       <a href="/app?provider=wss">Enable WSS</a>
    //     ) : (
    //       <a href="/app">Enable WebRTC</a>
    //     )
    //   ) : null}{' '} */}
    // {/* WebRTC provider doesn't implement disconnect correctly */}
    // {/* {providerName !== 'webrtc' ? (
    //     <button onClick={handleConnectionToggle}>
    //       {connected ? 'Disconnect' : 'Connect'}
    //     </button>
    //   ) : null}
    // </p>
    // <p>
    //   <b>My Name:</b>{' '}
    //   <input
    //     type="text"
    //     value={userProfile.name}
    //     onChange={(e) =>
    //       setUserProfile((profile) => ({...profile, name: e.target.value}))
    //     }
    //   />{' '}
    //   <input
    //     type="color"
    //     value={userProfile.color}
    //     onChange={(e) =>
    //       setUserProfile((profile) => ({...profile, color: e.target.value}))
    //     }
    //   />
    // </p> */}
    // {/* <p>
    //   <b>Active users:</b>{' '}
    //   {activeUsers.map(({name, color, userId}, idx) => (
    //     <Fragment key={userId}>
    //       <span style={{color}}>{name}</span>
    //       {idx === activeUsers.length - 1 ? '' : ', '}
    //     </Fragment>
    //   ))}
    // </p> */}
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
          onBlur={() => renameDocument(doc.document_id, nameRef.current.value)}
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

      <LexicalComposer initialConfig={editorConfig}>
        <CollaborationPlugin
          id={doc_uuid}
          providerFactory={providerFactory}
          shouldBootstrap={true}
          // username={userProfile.name}
          // cursorColor={userProfile.color}
          // cursorsContainerRef={containerRef}
        />

        <Editor />
      </LexicalComposer>
    </div>
  );
};

export default ContentEditor;
