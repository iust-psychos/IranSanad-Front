import { WebsocketProvider } from "y-websocket";
import { Doc } from "yjs";
import CookieManager from "../../Managers/CookieManager";

export function createWebsocketProvider(id, yjsDocMap) {
  const token = CookieManager.LoadToken();
  let doc = yjsDocMap.get(id);

  if (doc === undefined) {
    doc = new Doc();
    yjsDocMap.set(id, doc);
  } else {
    doc.load();
  }

  return new WebsocketProvider(
    `ws://iransanad.fiust.ir/ws/docs/${id}`,
    `?Authorization=${token}`,
    doc,
    {
      connect: false,
    }
  );
}
