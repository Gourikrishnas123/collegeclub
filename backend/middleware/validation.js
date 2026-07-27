const { AppError } = require('./errorHandler');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      return next(new AppError(JSON.stringify(messages), 400));
    }

    req.validated = value;
    next();
  };
};

module.exports = { validateRequest };
