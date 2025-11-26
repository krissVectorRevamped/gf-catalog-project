import express from 'express';
import fs from 'fs/promises';
import cors from 'cors';
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
app.post('/api/characters', async (req, res) => {
  const data = await readData();
  const newChar = req.body;
  // e.g. assign unique id
  newChar.id = Date.now().toString();
  data[newChar.id] = newChar;
  await writeData(data);
  res.json({ success: true, character: newChar });
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

app.listen(3001, () => console.log('Server running on port 3001'));