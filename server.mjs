import express from 'express';
import fs from 'fs';

const app = express();

app.use(express.json());

// Read JSON data
app.get('/api/data', (req, res) => {
  const data = JSON.parse(fs.readFileSync('./src/json/tdoll_data.json'));
  res.json(data);
});

// Write JSON data
app.post('/api/data', (req, res) => {
  const newData = req.body;
  fs.writeFileSync('./src/json/tdoll_data.json', JSON.stringify(newData, null, 2));
  res.json(newData);
});

app.listen(3001, () => {
  console.log('JSON server is running on http://localhost:3001');
});