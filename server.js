const env = require("dotenv");
env.config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const authRouter = require("./routes/auth.routes");

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);

mongoose
  .connect("mongodb://localhost:27017/chatgram")
  .then(() => {
    console.log("Database was connected");
  })
  .catch((err) => {
    console.log("Database connection error: " + err.message);
  });

const PORT = 3000;
app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`Server is running on port ${PORT}`);
});
