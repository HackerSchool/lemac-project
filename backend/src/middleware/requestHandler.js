const errorHandler = (err, _req, res, next) => {
  if (!err) return next();

  console.error(err);
  res.sendStatus(500);
};

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = {
  asyncHandler,
  errorHandler,
};
