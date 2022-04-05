const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    req.auth = { userId };
    if(req.body.userId && req.body.userId !== userId){
      throw'Ivalid user ID !';
    } else {
      next();
    }
  } catch(error){
    res.status(400).json({
      error: new Error('Requête non valide !')
    })
  }
};