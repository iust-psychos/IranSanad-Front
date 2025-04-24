/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// import {Provider} from '@lexical/yjs';
import {WebsocketProvider} from 'y-websocket';
import * as Y from 'yjs';
import CookieManager from '../../Managers/CookieManager';
let idSuffix = 0; // In React Strict mode "new WebrtcProvider" may be called twice


export function createWebsocketProvider(
  id,
  yjsDocMap,
) {
  const doc = getDocFromMap(id, yjsDocMap);
  const token = CookieManager.LoadToken();
  // @ts-expect-error TODO: FIXME
  return new WebsocketProvider($`ws://iransanad.fiust.ir/:8000/ws/save/doc-init/?Authorization={token}`, id, doc, {
    connect: false,
  });
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