module.exports = (validator) => {
  return async (req, res, next) => {
    try {
      await validator.validate(req.body);
    } catch (err) {
      return res.status(400).json({ errors: err.errors });
    }
    next()
  };
};
