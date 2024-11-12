import env from "dotenv";
env.config();
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./configs/swagger.config";

// Routes
import authRouter from "./routes/auth.routes";
import usersRoute from "./routes/users.routes";
// Servers
import { createServer } from "http";
import { Server } from "socket.io";
import User from "./models/User.model";
import Room from "./models/Room.model";
import Message from "./models/Message.model";
const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("API is working");
});

app.use("/auth", authRouter);
app.use("/users", usersRoute);

io.on("connection", (socket) => {
  console.log("a user connected");

  //? Join room with selected user id
  socket.on(
    "joinRoom",
    async ({
      username,
      targetUserId,
    }: {
      username: string;
      targetUserId: string;
    }) => {
      const user = await User.findOne({ email: `${username}@gmail.com` });
      let room = await Room.findOne({
        users: { $all: [user!._id, targetUserId] },
      });
      if (!room) {
        room = new Room({ users: [user!._id, targetUserId] });
        await room.save();
      }
      socket.join(room.id);
      socket.emit("roomJoined", room.id);
    }
  );

  //? Send message within the selected room
  socket.on(
    "message",
    async ({
      roomId,
      senderName,
      text,
    }: {
      roomId: string;
      senderName: string;
      text: string;
    }) => {
      const user = await User.findOne({ email: `${senderName}@gmail.com` });
      const message = new Message({ room: roomId, sender: user?._id, text });
      await message.save();
      io.to(roomId).emit("newMessage", {
        roomId,
        senderId: user?._id,
        text,
        timestamp: message.timestamp,
      });
    }
  );

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

mongoose
  .connect(process.env.DB_URL as string)
  .then(() => {
    console.log("Database was connected");
  })
  .catch((err: Error) => {
    console.log("Database connection error: " + err.message);
  });

const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
});
