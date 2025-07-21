import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";

export function createProvider(pageId) {
  const ydoc = new Y.Doc();
  

  const signalingServers = [
    "ws://localhost:4444", 
    "wss://signaling.yjs.dev", 
  ];

  const provider = new WebrtcProvider(`page-${pageId}`, ydoc, {
    signaling: signalingServers,
    password: null,        
    awareness: new Y.awarenessProtocol.Awareness(ydoc),
    maxConns: 20,
    filterBcConns: false,
  });

  return { ydoc, provider };
}
