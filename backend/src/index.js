require('dotenv').config();
const cors = require('cors');

const express = require('express');

const { dbMiddleware } = require('./middleware/database');
const { errorHandler } = require('./middleware/requestHandler');
const { verifyMiddleware } = require('./middleware/verifier');

const api = require('./api');

//enables CORS in dev server
var corsOptions = {
  origin: 'http://localhost:8080',
};

const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use(dbMiddleware);
app.use(errorHandler);
app.use(verifyMiddleware);

api.init(app);

app.get('/', (req, res) => {
  console.log(req.query);

  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
