
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   POST api/users/register
// @desc    Enregistrer un utilisateur
// @access  Public
router.post('/register', [
  check('name', 'Le nom est requis').not().isEmpty(),
  check('email', 'Veuillez inclure un email valide').isEmail(),
  check('password', 'Veuillez entrer un mot de passe avec 6 caractères ou plus').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'Cet e-mail est déjà utilisé' });
    }

    // Créer un nouvel utilisateur
    user = new User({
      name,
      email,
      password
    });

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Créer et retourner le JWT
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      }
    );
  } catch (err) {
    console.error('Erreur lors de l\'inscription:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   POST api/users/login
// @desc    Authentifier un utilisateur et obtenir un token
// @access  Public
router.post('/login', [
  check('email', 'Veuillez inclure un email valide').isEmail(),
  check('password', 'Le mot de passe est requis').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier si l'utilisateur est bloqué
    if (user.blocked) {
      return res.status(403).json({ message: 'Votre compte a été bloqué. Veuillez contacter l\'administrateur.' });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Créer et retourner le JWT
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      }
    );
  } catch (err) {
    console.error('Erreur lors de la connexion:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   GET api/users/me
// @desc    Obtenir les infos de l'utilisateur connecté
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error('Erreur lors de la récupération des données utilisateur:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
