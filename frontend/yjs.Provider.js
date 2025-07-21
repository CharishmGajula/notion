// src/yjsProvider.js
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'

export const ydoc = new Y.Doc()

export const provider = new WebrtcProvider('room-demo', ydoc)


