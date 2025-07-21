// utils/ySocketSetup.js
import * as Y from "yjs";
import {
  writeUpdate,
  applyUpdate,
  encodeStateAsUpdate,
  encodeStateVector,
} from "yjs";
import {
  messageSync,
  readSyncMessage,
  writeSyncStep1,
  writeSyncStep2,
} from "y-protocols/sync";
import { Awareness } from "y-protocols/awareness";

export function setupWSConnection(socket, req, { docName = "default-room" } = {}) {
  const doc = new Y.Doc();
  const awareness = new Awareness(doc);

  socket.on("message", (message) => {
    const encoder = writeUpdate(doc, new Uint8Array(message));
    socket.send(encoder);
  });

  const stateVector = encodeStateVector(doc);
  const update = encodeStateAsUpdate(doc, stateVector);
  socket.send(update);
}
