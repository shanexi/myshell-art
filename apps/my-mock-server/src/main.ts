/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import multer from 'multer';
import * as fs from 'fs';
import cors from 'cors';

const app = express();

app.use(cors());

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({ storage: storage });

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/uploads', express.static(uploadsDir));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to my-mock-server!' });
});

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: '没有文件被上传' });
  }
  // await sleep(3000);

  // 模仿 python 上传返回
  res.send({
    message: '文件上传成功',
    // file: {
    //   filename: req.file.filename,
    //   originalname: req.file.originalname,
    //   size: req.file.size,
    //   mimetype: req.file.mimetype,
    //   url: `/uploads/${req.file.filename}`,
    // },
    data: {
      file_path: `/uploads/${req.file.filename}`,
    },
    success: true,
    code: 200,
  });
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
