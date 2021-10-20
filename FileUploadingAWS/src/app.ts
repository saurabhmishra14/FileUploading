import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import multer from "multer";
import AWS from "aws-sdk";
import multerS3 from "multer-s3";

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const storage = multerS3({
  s3: s3,
  bucket: "fileuploading12",
  metadata: (_req: Request, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req: Request, file, cb) => {
    const user = req.body.user;
    cb(null, user + Date.now().toString() + path.extname(file.originalname));
  }
});

const fileUpload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000, // 1000000 Bytes = 1 MB
  },
  fileFilter: (_req: Request, file, cb) => {
    if (!file.originalname.match(/\.(png|jpg|jpeg|pdf)$/)) { 
      // upload only png and jpg format
      return cb(new Error('Please upload a Image with extension png OR jpg OR jpeg'))
    }
  cb(null, true)
}
  }
);

app.post("/uploadImage", fileUpload.single('avatar') , (req: Request, res: Response) => {
  try {
    res.send(req.file);
  } catch (error) {
    res.send(error);
  }
});

app.listen(port, () => {
  console.log(`Listening on PORT: ${port}`);
});
