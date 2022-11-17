const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_KEY } = process.env;
const validator = require("validator");

const { isEmail, isStrongPassword } = validator;

exports.signup = (req, res) => {
  if (!isEmail(req.body.email)) {
    return res.status(400).json({ message: "Not a valid email address." });
  }
  if (!isStrongPassword(req.body.password)) {
    return res.status(400).json({ message: "Not a strong password." });
  }
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "User created!" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        res.status(401).json({ error });
      } else {
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              return res.status(401).json({ message: "Not authorized." });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign({ userId: user._id }, JWT_KEY, {
                expiresIn: "24h",
              }),
            });
          })
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
