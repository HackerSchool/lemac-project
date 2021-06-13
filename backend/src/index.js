require('dotenv').config();

const express = require('express');

const { dbMiddleware } = require('./middleware/database');
const { errorHandler } = require('./middleware/requestHandler');

const port = process.env.PORT || 5000;

const app = express();
const api = require('./api');
api.init(app);

app.use(dbMiddleware);
app.use(errorHandler);

app.get('/', (req, res) => {
  console.log(req.query);

  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});