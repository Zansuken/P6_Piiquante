const fs = require("fs");
const Sauce = require("../models/Sauce");

exports.createSauce = (req, res) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  try {
    sauce.save();
    res.status(201).json({ message: "Item created." });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.updateSauce = (req, res) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete sauceObject._userId;

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId !== req.auth.userId) {
        res.status(401).json({ message: "Not authorized." });
      } else {
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Item updated." }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId !== req.auth.userId) {
        res.status(401).json({ message: "Not authorized." });
      } else {
        const fileName = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${fileName}`, () =>
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Item deleted." }))
            .catch((error) => res.status(401).json({ error }))
        );
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.getSauces = (req, res) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

// TODO: Fix the like/dislike controller
exports.updateSauceLikes = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId !== req.auth.userId) {
        res.status(401).json({ message: "Not authorized." });
      } else {
        const updatedSauce = { ...sauce, like: req.body.like };
        Sauce.updateOne(
          { _id: req.params.id },
          { ...updatedSauce, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Item updated." }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ error }));
};
