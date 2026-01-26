import express from "express";
import http from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/authRoutes";
import conversationRoutes from "./routes/conversationRoutes";
import messagesRoutes from "./routes/messagesRoutes";
import contactRoutes from "./routes/contactRoutes";
import geminiRoutes from "./routes/geminiRoutes";
import { saveMessage } from "./controllers/messagesController";
import { log, error } from "./utils/logger";

const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    message: "ChatApp Backend is live: By Lord_DSP_3",
    version: "v.1.3.1",
    uptime: process.uptime(),
  });
});

app.use("/auth", authRoutes);
app.use("/conversation", conversationRoutes);
app.use("/messages", messagesRoutes);
app.use("/contacts", contactRoutes);
app.use("/gemini", geminiRoutes);

io.on("connection", (socket) => {
  log("socket: A user connected:", socket.id);

  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
  });

  socket.on("sendMessage", async (message) => {
    log("📩 sendMessage received:", message);
    const { conversationId, senderId, content } = message;
    if (!conversationId || !senderId || !content) {
      console.log("❌ Invalid message payload");
      return;
    }
    try {
      const savedMessage = await saveMessage(conversationId, senderId, content);
      log("✅ Message saved:", savedMessage);
      io.to(conversationId).emit("newMessage", savedMessage);
      io.emit("conversationUpdated", {
        conversationId,
        lastMessage: savedMessage.content,
        lastMessageTime: savedMessage.created_at,
      });
    } catch (err) {
      error("soket.on.sendmessage: Failed to save message in db", err);
    }
  });
  socket.on("disconnect", () => {
    log("socket: user disconnected: " + socket.id);
  });
});

const PORT = process.env.PORT || 6000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Server Mode: ${process.env.NODE_ENV}`);
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);

});
