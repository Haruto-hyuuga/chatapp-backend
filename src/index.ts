import express from "express";
import http from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/authRoutes";
import conversationRoutes from "./routes/conversationRoutes";
import messagesRoutes from "./routes/messagesRoutes";
import { saveMessage } from "./controllers/messagesController";

const app = express();
const server = http.createServer(app);
app.use(express.json());
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

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
    console.log("User joined conversation: " + conversationId);
  });

  socket.on("sendMessage", async (message) => {
    const { conversationId, senderId, content } = message;
    try {
      const savedMessage = await saveMessage(conversationId, senderId, content);
      console.log("SendMessage");
      console.log(savedMessage);
      io.to(conversationId).emit("newMessage", savedMessage);
    } catch (err) {
      console.error("soket.on.sendmessage: Failed to save message in db", err);
    }
  });
  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
  });
});

const PORT = process.env.PORT || 6000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
