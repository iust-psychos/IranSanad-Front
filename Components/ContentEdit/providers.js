import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";
import CookieManager from "../../Managers/CookieManager";

export function createWebsocketProvider(id, yjsDocMap) {
  const doc = getDocFromMap(id, yjsDocMap);
  const token = CookieManager.LoadToken();
  const socketUrl = `ws://iransanad.fiust.ir/ws/docs/${id}/?Authorization=${token}`;
  console.log(socketUrl);
  return new WebsocketProvider(
    socketUrl,
    id,
    doc,
    {
      connect: false,
    }
  );
}

function getDocFromMap(id, yjsDocMap) {
  let doc = yjsDocMap.get(id);

  if (doc === undefined) {
    doc = new Y.Doc();
    yjsDocMap.set(id, doc);
  } else {
    doc.load();
  }

  return doc;
}
