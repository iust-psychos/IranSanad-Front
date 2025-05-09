import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

const connectonManager = (roomid) => {
  const doc = Y.Doc();
  const provider = new WebsocketProvider(
    "ws://your-ypy-backend-url", // Your YPY backend WebSocket URL
    roomId,
    doc
  );
  const yText = doc.getText("lexical");
  const awareness = provider.awareness;

  return { doc, provider, yText, awareness };
};

export default connectonManager;
