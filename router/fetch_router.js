const express = require("express");
const router = express.Router();
const File = require("../models/file");

// Fetch single random file
router.get("/", async (req, res) => {
  try {
    const file = await File.aggregate([{ $sample: { size: 1 } }]);
    if (!file.length) {
      return res.status(404).send("No file found.");
    }
    const formattedFile = {
      filename: file[0].filename,
      contentType: file[0].contentType,
      imageBuffer: file[0].imageBufferThumbnail
        ? file[0].imageBufferThumbnail.toString("base64")
        : file[0].imageBuffer.toString("base64"),
    };
    res.json(formattedFile);
  } catch (error) {
    console.error("Error finding document:", error);
    res.status(500).send("Error fetching file.");
  }
});

// Fetch multiple files
router.get("/multiple", async (req, res) => {
  const count = parseInt(req.query.count, 10) || 2;
  try {
    const files = await File.aggregate([{ $sample: { size: count } }]);
    const formattedFiles = files.map((file) => ({
      filename: file.filename,
      contentType: file.contentType,
      imageBuffer: file.imageBufferThumbnail
        ? file.imageBufferThumbnail.toString("base64")
        : file.imageBuffer.toString("base64"),
    }));
    res.json(formattedFiles);
  } catch (error) {
    console.error("Error finding documents:", error);
    res.status(500).send("Error fetching files.");
  }
});

module.exports = router;
