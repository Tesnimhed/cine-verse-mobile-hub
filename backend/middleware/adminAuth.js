
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  // Récupérer le token du header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Accès non autorisé, token requis' });
  }

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Trouver l'utilisateur par ID
    const user = await User.findById(decoded.user.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Token invalide' });
    }

    // Vérifier si l'utilisateur est un administrateur
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé, privilèges administrateur requis' });
    }

    // Ajouter l'utilisateur à la requête
    req.user = user;
    next();
  } catch (err) {
    console.error('Erreur d\'authentification admin:', err.message);
    res.status(401).json({ message: 'Token invalide' });
  }
};
