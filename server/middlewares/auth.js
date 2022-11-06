const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const { JWT_KEY } = process.env;
    const decodedToken = jwt.verify(token, JWT_KEY);
    const userId = decodedToken.userId;

    req.auth = {
      userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
