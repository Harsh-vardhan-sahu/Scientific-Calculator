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

app.get('/memory/:slot', async (req, res) => {
  const slot = req.params.slot;
  memoryDoc = await Memory.findOne();

  if (!memoryDoc) return res.json({ memory: "" });

  const value = slot === '1' ? memoryDoc.slot1 : memoryDoc.slot2;
  res.json({ memory: value });
});


app.post('/memory', async (req, res) => {
  const { value, slot } = req.body;
  if (!memoryDoc) {
    memoryDoc = await Memory.findOne() || new Memory();
  }

  if (slot === '1') memoryDoc.slot1 = value;
  else if (slot === '2') memoryDoc.slot2 = value;

  await memoryDoc.save();
  res.json({ message: 'Saved' });
});

app.post('/memory/clear/:slot', async (req, res) => {
  const slot = req.params.slot;
  if (!memoryDoc) {
    memoryDoc = await Memory.findOne() || new Memory();
  }

  if (slot === '1') memoryDoc.slot1 = "";
  else if (slot === '2') memoryDoc.slot2 = "";

  await memoryDoc.save();
  res.json({ message: 'Cleared' });
});

