import env from "dotenv";
env.config();
import express from "express";
import mongoose from "mongoose";
// Routes
import authRouter from "./routes/auth.routes";
import usersRoute from "./routes/users.routes";
// Servers
import { createServer } from "http";
import { Server } from "socket.io";
const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {});

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
