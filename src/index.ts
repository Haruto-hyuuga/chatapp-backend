import express from "express";
import http from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/authRoutes";
import conversationRoutes from "./routes/conversationRoutes";
import messagesRoutes from "./routes/messagesRoutes";
import contactRoutes from "./routes/contactRoutes";
import { saveMessage } from "./controllers/messagesController";

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
    uptime: process.uptime(),
  });
});

app.use("/auth", authRoutes);
app.use("/conversation", conversationRoutes);
app.use("/messages", messagesRoutes);
app.use("/contacts", contactRoutes);

io.on("connection", (socket) => {
  console.log("socket: A user connected:", socket.id);
  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
  });

  socket.on("sendMessage", async (message) => {
    const { conversationId, senderId, content } = message;
    try {
      const savedMessage = await saveMessage(conversationId, senderId, content);
      io.to(conversationId).emit("newMessage", savedMessage);
      io.emit("conversationUpdated", {
        conversationId,
        lastMessage: savedMessage.content,
        lastMessageTime: savedMessage.created_at,
      });
    } catch (err) {
      console.error("soket.on.sendmessage: Failed to save message in db", err);
    }
  });
  socket.on("disconnect", () => {
    console.log("socket: user disconnected: " + socket.id);
  });
});

const PORT = process.env.PORT || 6000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Server Mode: ${process.env.NODE_ENV}`);
});
