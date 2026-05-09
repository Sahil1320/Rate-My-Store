const express = require('express');
const router = express.Router();
const { Rating } = require('../models');
const { protect, authorize } = require('../middleware/authMiddleware');

// @desc    Submit a new rating
// @route   POST /api/ratings
// @access  Normal User
router.post('/', protect, authorize('NORMAL'), async (req, res) => {
  const { storeId, rating } = req.body;
  
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    // Check if rating already exists
    const existingRating = await Rating.findOne({
      where: { storeId, userId: req.user.id }
    });

    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this store. Please modify your existing rating instead.' });
    }

    const newRating = await Rating.create({
      storeId,
      userId: req.user.id,
      rating
    });

    res.status(201).json(newRating);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Modify a rating
// @route   PUT /api/ratings/:id
// @access  Normal User
router.put('/:id', protect, authorize('NORMAL'), async (req, res) => {
  const { rating } = req.body;
  
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    const existingRating = await Rating.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!existingRating) {
      return res.status(404).json({ message: 'Rating not found or unauthorized' });
    }

    existingRating.rating = rating;
    await existingRating.save();

    res.json(existingRating);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
