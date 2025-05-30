const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Memory = require('./models/memory');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://harsh:1234@cluster0.pgs0axv.mongodb.net/calculator', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB error:", err));

let memoryDoc;

app.listen(3000, async () => {
  memoryDoc = await Memory.findOne();
  if (!memoryDoc) {
    memoryDoc = new Memory({ value: "" });
    await memoryDoc.save();
  }
  console.log('Server running on http://localhost:3000');
});

app.get('/memory', async (req, res) => {
  memoryDoc = await Memory.findOne();
  res.json({ memory: memoryDoc.value });
});

app.post('/memory', async (req, res) => {
  const { value } = req.body;
  memoryDoc.value = value;
  await memoryDoc.save();
  res.json({ status: 'Memory updated', memory: value });
});

app.post('/memory/clear', async (req, res) => {
  memoryDoc.value = '';
  await memoryDoc.save();
  res.json({ status: 'Memory cleared' });
});
