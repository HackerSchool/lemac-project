const mysql = require('mysql2/promise');

const dbMiddleware = async (req, _res, next) => {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
    timezone: '+00:00',
  });

  await db.connect((err) => {
    if (err) throw err;
  });
  req.db = db;

  //terminate db connection on end of request
  _res.once('finish', () => db.end());

  next();
};

module.exports = {
  dbMiddleware,
};
