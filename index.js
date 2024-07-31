require("dotenv").config();
const PORT = process.env.PORT || 3000;
const express = require("express");
const app = express();
const path = require("path");
const uploadRouter = require("./router/upload_router");
const fetchRouter = require("./router/fetch_router");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use("/upload", uploadRouter);
app.use("/fetch", fetchRouter); // Ensure this line is present

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);
let db = mongoose.connection;
db.once("open", () => {
  console.log("Connected to MongoDB");
});
db.on("error", (err) => {
  console.error("DB Error:" + err);
});

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

// Serve fetch-random.html
app.get("/fetch-random", (req, res) => {
  res.sendFile(path.join(__dirname, "views/fetch-random.html"));
});

// Serve fetch-multiple-random.html
app.get("/fetch-multiple-random", (req, res) => {
  res.sendFile(path.join(__dirname, "views/fetch-multiple-random.html"));
});

// Serve gallery.html
app.get("/gallery", (req, res) => {
  res.sendFile(path.join(__dirname, "views/gallery.html"));
});

// Serve gallery-pagination.html
app.get("/gallery-pagination", (req, res) => {
  res.sendFile(path.join(__dirname, "views/gallery-pagination.html"));
});

// Handle 404
app.use((req, res) => {
  res.status(404).send("Route does not exist on our server");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
