const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauces = (req, res, next) => {
  const saucesObject = JSON.parse(req.body.sauce);
  delete saucesObject._id;
  const sauce = new Sauce({
    ...saucesObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  })
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce créée !' }))
    .catch(error => res.status(400).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status().json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status().json({ error }));
};

exports.updateOneSauce = (req, res, next) => {
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : req.body;

  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée ! ' }))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        res.status(404).json({
          error: new Error('Sauce non trouvéé !')
        });
      }
      if (sauce.userId !== req.auth.userId) {
        res.status(401).json({
          error: new Error('Requête non autorisée !')
        });
      }
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce suppriméé !' }))
          .catch(error => res.status(400).json({ error }));
      })
    })
    .catch(error => res.status().json({ error }));
};

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {

      let like = req.body.like;

      // Ajout like si userId n'est pas dans [usersLiked] et que req.body.like == 1
      if (!sauce.usersLiked.includes(req.body.userId) && like === 1) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { likes: 1 },
            $push: { usersLiked: req.body.userId }
          },
          { _id: req.params.id })
          .then(sauce => res.status(200).json({ message: 'Liked !' }))
          .catch(error => res.status(400).json({ error }));
      }

      // Ajout dislike si userId n'est pas dans [usersDisiked] et que req.body.like == -1
      if (!sauce.usersDisliked.includes(req.body.userId) && like === -1) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { dislikes: 1 },
            $push: { usersDisliked: req.body.userId }
          },
          { _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Disliked!' }))
          .catch(error => res.status(400).json({ error }));
      }

      // Suppression du like si userId est dans [usersLiked] et que req.body.like == 0
      if (sauce.usersLiked.includes(req.body.userId) && like === 0) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { likes: -1 },
            $pull: { usersLiked: req.body.userId }
          },
          { _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Like removed !' }))
          .catch(error => res.status(400).json({ error }));
      }

      // Suppression du dislike si userId est dans [usersDisliked] et que req.body.like == 0
      if (sauce.usersDisliked.includes(req.body.userId) && like === 0) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { dislikes: -1 },
            $pull: { usersDisliked: req.body.userId }
          },
          { _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Dislike removed !' }))
          .catch(error => res.status(400).json({ error }));
      }
    })
    .catch(error => res.status(404).json({ error }));
};

