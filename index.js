require("dotenv").config();

const cloudinaryStorage = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary");
const Vibrant = require('node-vibrant');
const express = require("express");
const multer = require("multer");
const path = require("path");
// const upload = multer();
const app = express();
const port = process.env.PORT || 5000;

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "paletteGenerator",
  allowedFormats: ["jpg", "png", "bmp"]
});

const parser = multer({ storage: storage });

// APP CONFIG
app.use(express.static(path.join(__dirname, "client/build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// UPLOAD AN IMAGE

// SERVER GETS PALETTE DATA FROM IMAGE
//
app.get("/api/palette/image=:imageUrl", (req, res) => {
  // TODO: Error checking for bad url or bad file (unable to be read by getPalettes function)
//   [hex, hex, hex... (6 times)]
// let encodedUrl = encodeURIComponent(req.params.imageUrl)

Vibrant.from(req.params.imageUrl).getPalette()
    .then(palette => {
        // console.log(palette)
        res.json(palette);
    })
    .catch(err => {
        console.log(err);
        res.send(err);
    })
})


// let dogUrl = "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/gettyimages-1094874726.png?crop=1.00xw:0.753xh;0,0.161xh&resize=980:*"
// getPalettes(dogUrl);

app.post("/image-upload", parser.single("image"), (req, res) => {
  // console.log(req.file)
  console.log(`Deleting image with id ${req.file.public_id} in 1 hour.`);
  setTimeout(() => {
    cloudinary.uploader.destroy(req.file.public_id, (err, result) => {
      console.log(result);
    });
  }, 3600000); //delete after one hour

  res.json({ url: req.file.url });
});

app.listen(port, () => {
  console.log(`Server started on port ${port} at ${Date(Date.now())}`);
});
