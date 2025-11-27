import express from 'express';
import fs from 'fs/promises';
import cors from 'cors';
import multer from "multer";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = './characters.json';

async function readData() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Could not read data', err);
    return {};
  }
}
async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// List all
app.get('/api/characters', async (req, res) => {
  const data = await readData();
  res.json(data);
});

// Add new (assuming data is an array, or keyed object)
app.post('/api/upload', upload.single('image'), (req, res) => {
  const type = req.body.type; // e.g., "char_img" or "char_img_full"
  const folder = type === "full" ? "./public/char_img_full" : "./public/char_img";

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, folder),
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + '-' + file.originalname;
      cb(null, uniqueName);
    }
  });

  const upload = multer({ storage }).single('image');

  upload(req, res, function(err) {
    if (err) return res.status(500).json({ error: "Upload failed" });
    res.json({ url: `/${folder.replace('./public/', '')}/${req.file.filename}` });
  });
});

// Update
app.put('/api/characters/:id', async (req, res) => {
  const data = await readData();
  const id = req.params.id;
  if (!data[id]) {
    return res.status(404).json({ error: 'Not found' });
  }
  data[id] = { ...data[id], ...req.body };
  await writeData(data);
  res.json({ success: true, character: data[id] });
});

// Delete
app.delete('/api/characters/:id', async (req, res) => {
  const data = await readData();
  const id = req.params.id;
  if (!data[id]) {
    return res.status(404).json({ error: 'Not found' });
  }
  delete data[id];
  await writeData(data);
  res.json({ success: true });
});

/*const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads'); // folder to store uploaded images
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});*/

app.listen(3001, () => console.log('Server running on port 3001'));