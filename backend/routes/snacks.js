
const express = require('express');
const router = express.Router();
const Snack = require('../models/Snack');
const adminAuth = require('../middleware/adminAuth');

// @route   GET api/snacks
// @desc    Obtenir tous les snacks
// @access  Public
router.get('/', async (req, res) => {
  try {
    const snacks = await Snack.find();
    res.json(snacks);
  } catch (err) {
    console.error('Erreur lors de la récupération des snacks:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   GET api/snacks/:id
// @desc    Obtenir un snack par son ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const snack = await Snack.findById(req.params.id);
    if (!snack) {
      return res.status(404).json({ message: 'Snack non trouvé' });
    }
    res.json(snack);
  } catch (err) {
    console.error('Erreur lors de la récupération du snack:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Routes pour l'administration des snacks
// @route   POST api/snacks
// @desc    Ajouter un nouveau snack
// @access  Private/Admin
router.post('/', adminAuth, async (req, res) => {
  try {
    const newSnack = new Snack(req.body);
    const snack = await newSnack.save();
    res.json(snack);
  } catch (err) {
    console.error('Erreur lors de l\'ajout du snack:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   PUT api/snacks/:id
// @desc    Mettre à jour un snack
// @access  Private/Admin
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const snack = await Snack.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!snack) {
      return res.status(404).json({ message: 'Snack non trouvé' });
    }
    res.json(snack);
  } catch (err) {
    console.error('Erreur lors de la mise à jour du snack:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   DELETE api/snacks/:id
// @desc    Supprimer un snack
// @access  Private/Admin
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const snack = await Snack.findById(req.params.id);
    if (!snack) {
      return res.status(404).json({ message: 'Snack non trouvé' });
    }
    await snack.deleteOne();
    res.json({ message: 'Snack supprimé' });
  } catch (err) {
    console.error('Erreur lors de la suppression du snack:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
