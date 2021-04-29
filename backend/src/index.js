require('dotenv').config();

const express = require('express');
const app = express();

const { dbMiddleware } = require('./middleware/database');

port = process.env.PORT || 5000;

app.use(dbMiddleware);

app.get('/', (req, res) => {
  console.log(req.query);

  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
