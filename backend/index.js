const express = require("express");
const app = express();
const port = 5000;

// body data
app.use(express.json());

// cookie
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// .env
const dotenv = require("dotenv");
dotenv.config();
const { MONGODB_URI } = process.env;

// mongodb
const mongoose = require("mongoose");
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB Connected!"))
  .catch((err) => console.log(err));

// test
app.get("/", (req, res) => {
  res.send("KonKon!");
});

// user router
const users = require("./router/user");
app.use("/api/user", users);

// pay router
const pay = require("./router/pay");
app.use("/api/pay", pay);

// history router
const history = require("./router/history");
app.use("/api/history", history);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
