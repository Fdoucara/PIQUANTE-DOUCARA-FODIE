const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  // Définir ou les fichiers devront etre enregistrés
  destination: (req, file, callback) => {
    // null signifie pas d'erreur
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    // Créer un filename unique
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');