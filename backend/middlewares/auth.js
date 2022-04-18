const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

// Gestion des erreurs a l'aide de TRY ET CATCH
module.exports = (req, res, next) => {
  // Recuperer le token dans le headers de la requete 
  // Decoder le token a l'aide de la SECRET_KEY 
  // Recuperer la propriete userId de l'objet obtenu lors du decodage
  // Ajouter une propriete auth == userId a la requete 
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, SECRET_KEY);
    const userId = decodedToken.userId;
    req.auth = { userId };
    if(req.body.userId && req.body.userId !== userId){
      throw'Invalid user ID !';
    } else {
      next();
    }
  } catch(error){
    res.status(400).json({
      error: new Error('Requête non valide !')
    })
  }
};