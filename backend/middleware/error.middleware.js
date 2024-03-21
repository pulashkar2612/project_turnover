const errorHandlerMiddleware = (err, req, res, next) => {
  const status = res.statusCode || 500;

  res.json({
    errorCode: status,
    errorMessage: err.message,
  });
};

module.exports = errorHandlerMiddleware;
