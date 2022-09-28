const express = require("express");
const bodyParser = require("body-parser");
const signuphandler = require("./handler/signup.js");
const loginhandler = require("./handler/login.js");
const upload = require("./handler/upload.js");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json({ limit: "50MB" }));
app.use(express.json());

const PORT = process.env.NODE_SERVER_PORT || 3000;

app.post("/signup", signuphandler);
app.post("/signin", loginhandler);
app.post("/upload", upload);

app.listen(PORT, () => {
  console.log("Server Running at port " + PORT + "...");
});
