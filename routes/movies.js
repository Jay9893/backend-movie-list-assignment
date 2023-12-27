const express = require("express");
const multer = require("multer");
const fs = require("fs");
const Movie = require("../models/Movie");

const router = express.Router();

const upload = require("../middlewares/multer");

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, publishingYear } = req.body;
    const imageBuffer = req.file.buffer;

    if (!title || !publishingYear) {
      return res
        .status(400)
        .json({ error: "Title and publishingYear are required" });
    }

    const newMovie = new Movie({
      image: {
        data: imageBuffer,
        contentType: req.file.mimetype,
      },
      title,
      publishingYear,
    });

    await newMovie.save();

    return res.status(201).json({ success: true, result: newMovie });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;
    const totalCount = await Movie.countDocuments();
    const result = await Movie.find().select("-image").skip(skip).limit(limit);

    return res.status(200).json({
      success: true,
      result,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, publishingYear } = req.body;
    const imageBuffer = req.file.buffer;

    if (!title || !publishingYear) {
      return res
        .status(400)
        .json({ error: "Title and publishingYear are required" });
    }

    const { id } = req.params;

    const fileExtension = req.file.mimetype;
    const newMovie = {
      image: {
        data: imageBuffer,
        contentType: fileExtension,
      },
      title,
      publishingYear,
    };

    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      { $set: newMovie },
      { new: true }
    );

    if (!updatedMovie) {
      return res
        .status(404)
        .json({ success: false, message: "Movie not found" });
    }

    return res.status(200).json({ success: true, data: updatedMovie });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Movie.findOne({ _id: id });

    if (!result) {
      return res.status(404).json({ success: false, error: "Movie not found" });
    }

    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
});

router.get('/image/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Movie.findById(id);

    if (!result) {
      return res.status(404).json({ success: false, error: 'Movie not found' });
    }

    res.setHeader('Content-Type', result.image.contentType);
    res.send(result.image.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

module.exports = router;
