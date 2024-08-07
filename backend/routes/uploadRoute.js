import path from "path";
import express from "express";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    const randomString = Math.random().toString(36).substring(7);
    const uniqueFilename = `${file.fieldname}-${Date.now()}-${randomString}${extname}`;
    cb(null, uniqueFilename);
  }
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (filetypes.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Images only"), false);
  }
};

const upload = multer({ storage, fileFilter });

const uploadMultipleImages = upload.array("images", 10); // 10 is the maximum number of files

router.post("/", (req, res) => {
  uploadMultipleImages(req, res, (err) => {
    if (err) {
      return res.status(400).send({
        message: err.message
      });
    } else if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map((file) => `/${file.path}`);
      return res.status(200).send({
        message: "Images uploaded successfully",
        imageUrls: imageUrls
      });
    } else {
      return res.status(400).send({
        message: "No images provided"
      });
    }
  });
});

export default router;
