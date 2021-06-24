if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const mongo = process.env.MONGO_DB;
const mongoUrl = `mongodb://${mongo}/cars`;

let Attribute, Dropdown;

const attributSchema = new mongoose.Schema(
  {
    attrId: Number,
    attrTyp: String,
    datentyp: String,
    attributNameExt: String,
  },
  { timestamps: true }
);

const dropdownSchema = new mongoose.Schema(
  {
    wibId: Number,
    attrId: Number,
    attrTyp: String,
    value: String,
  },
  { timestamps: true }
);

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post(`/rimp/attribute`, async (req, res) => {
  try {
    let data = req.body;
    let query = await new Attribute(data).save();
    res.json(query);
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.post(`/rimp/dropdown`, async (req, res) => {
  try {
    let data = req.body;
    let query = await new Dropdown(data).save();
    res.json(query);
  } catch (error) {
    res.status(500).json({ error });
  }
});

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

mongoose.connection.on('connected', async (err) => {
  console.log(`Connected to MongoDB`);
  Attribute = mongoose.model('Attribute', attributSchema);
  Dropdown = mongoose.model('Dropdown', dropdownSchema);
  app.listen(3333, () => console.log(`Listening on port 3333`));
});
