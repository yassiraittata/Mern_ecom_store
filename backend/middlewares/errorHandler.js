const errorHandler = (err, req, res, next) => {
  const statusCode = err.status ?? constants.SERVER_ERROR;

  res.status(statusCode);

  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      res.json({
        success: false,
        title: "Validation Failed",
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    case constants.NOT_FOUND:
      res.json({
        success: false,
        title: "Not Found",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case constants.CONFLICT:
      res.json({
        success: false,
        title: "Conflict",
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    case constants.UNAUTHORIZED:
      res.json({
        success: false,
        title: "Unauthorized",
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    case constants.FORBIDDEN:
      res.json({
        success: false,
        title: "Forbidden",
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    case constants.SERVER_ERROR:
    default:
      res.json({
        success: false,
        title: "Server Error",
        message: err.message,
        stackTrace:
          process.env.NODE_ENV === "production" ? undefined : err.stack,
      });
      break;
  }
};

export default errorHandler;
