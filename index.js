const { initialization } = require("./db/db.connect");
const { Cache } = require("./models/cache.model");
require("dotenv").config({ path: ".env" });

initialization();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const corsOptions = {
  origin: "*",
  credentials: true,
  openSuccessStatus: 200,
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Server Started");
});

const maxSize = process.env.MAX_SIZE || 9;

// POST
app.post("/post/cache", async (req, res) => {
  const { key, value } = req.body;

  try {
    const allCacheVal = await Cache.find();

    if (allCacheVal.length > maxSize) {
      return res
        .status(404)
        .json({ message: "Cannot store more than 10 values" });
    }

    const alreadyCache = await Cache.findOne({ key });

    if (alreadyCache) {
      const updatedCache = await Cache.findOneAndUpdate(
        { key },
        { value },
        { new: true }
      );

      return res
        .status(200)
        .json({ message: "Value got updated", updatedCache });
    }

    const newCacheValue = new Cache({ key, value });
    const savedCacheVal = await newCacheValue.save();

    if (savedCacheVal) {
      return res
        .status(200)
        .json({ message: "Cache saved suucessfully", savedCacheVal });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// GET
app.get("/get/all/cache", async (req, res) => {
  try {
    const allCacheVal = await Cache.find();

    if (!allCacheVal) {
      return res.status(404).json({ message: "Cannot find all cache values" });
    }

    return res
      .status(200)
      .json({ message: "Found all cache values", allCacheVal });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// GET Single Cache
app.get("/get/single/cache/:id", async (req, res) => {
  const cacheId = req.params.id;

  try {
    const singleCache = await Cache.findById(cacheId);

    if (!singleCache) {
      return res.status(404).json({ message: "Cannot find the desired cache" });
    }

    return res
      .status(200)
      .json({ message: "Found the desired cache details", singleCache });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE
app.delete("/delete/cache/:id", async (req, res) => {
  const cacheId = req.params.id;

  try {
    const foundCache = await Cache.findByIdAndDelete(cacheId);

    if (!foundCache) {
      return res.status(404).json({ message: "Cannot delete Cache value" });
    }

    return res.status(200).json({ message: "Cache got deleted", foundCache });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
