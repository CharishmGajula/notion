const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const Y = require("yjs");
const {
  Awareness,
  applyAwarenessUpdate,
  encodeAwarenessUpdate,
} = require("y-protocols/awareness");

// Your REST routes
const authRouter = require("./routes/auth.routes");
const pageRouter = require("./routes/page.routes");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// REST API Routes
app.use("/api/auth", authRouter);
app.use("/api/pages", pageRouter);

// Room awareness and Y.Doc storage
const docs = new Map();

io.on("connection", (socket) => {
  const room = socket.handshake.query.room || "default-room";
  console.log(`✅ Socket connected to room: ${room}`);
  socket.join(room);

  // Create Y.Doc and Awareness if room is new
  if (!docs.has(room)) {
    const ydoc = new Y.Doc();
    const awareness = new Awareness(ydoc);
    docs.set(room, { ydoc, awareness });
  }

  const { ydoc, awareness } = docs.get(room);

  // 🧠 Awareness handling
  socket.on("awareness", (update) => {
    try {
      const uint8 = new Uint8Array(update);
      applyAwarenessUpdate(awareness, uint8, socket.id);
      socket.to(room).emit("awareness", update);
    } catch (err) {
      console.error("❌ Awareness error:", err);
    }
  });

  // 📄 Document content sync
  socket.on("update", (update) => {
    try {
      socket.to(room).emit("update", update);
    } catch (err) {
      console.error("❌ Update sync error:", err);
    }
  });

  // 🧱 Block updates
  socket.on("send-update", ({ pageId, blockId, content }) => {
    socket.to(pageId).emit("receive-update", { blockId, content });
  });

  socket.on("add-block", ({ pageId, block }) => {
    socket.to(pageId).emit("block-added", { block });
  });

  socket.on("delete-block", ({ pageId, blockId }) => {
    socket.to(pageId).emit("block-deleted", { blockId });
  });

  // ✅ Room Join/Leave
  socket.on("join-page", (pageId) => {
    socket.join(pageId);
    console.log(`User ${socket.id} joined page room: ${pageId}`);
  });

  socket.on("leave-page", (pageId) => {
    socket.leave(pageId);
    console.log(`User ${socket.id} left page room: ${pageId}`);
  });

  // 🧹 Disconnect Cleanup
  socket.on("disconnect", () => {
    console.log(`❌ Disconnected from room: ${room}`);
    if (awareness.getStates().has(socket.id)) {
      awareness.removeStates([socket.id]);
      const update = encodeAwarenessUpdate(awareness, [socket.id]);
      socket.to(room).emit("awareness", update);
    }
  });
});

const PORT = process.env.PORT || 5005;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
