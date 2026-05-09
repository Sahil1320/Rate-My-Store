const express = require('express');
const router = express.Router();
const { Store, User, Rating, sequelize } = require('../models');
const { protect, authorize } = require('../middleware/authMiddleware');
const { Op } = require('sequelize');

// @desc    Create new store
// @route   POST /api/stores
// @access  Admin
router.post('/', protect, authorize('ADMIN'), async (req, res) => {
  const { name, email, address, ownerId } = req.body;
  try {
    const store = await Store.create({ name, email, address, ownerId });
    res.status(201).json(store);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Server error' });
  }
});

// @desc    Get all stores (Admin and Normal users)
// @route   GET /api/stores
// @access  Admin / Normal User
router.get('/', protect, async (req, res) => {
  try {
    const { name, address, email, sortField, sortOrder } = req.query;
    let whereClause = {};

    if (name) whereClause.name = { [Op.like]: `%${name}%` };
    if (address) whereClause.address = { [Op.like]: `%${address}%` };
    if (email) whereClause.email = { [Op.like]: `%${email}%` }; // Used by admin

    let orderClause = [['createdAt', 'DESC']];
    if (sortField && ['name', 'email', 'address'].includes(sortField)) {
      orderClause = [[sortField, sortOrder === 'asc' ? 'ASC' : 'DESC']];
    }

    const stores = await Store.findAll({
      where: whereClause,
      order: orderClause,
      include: [
        { model: Rating, as: 'ratings' },
        { model: User, as: 'owner', attributes: ['id', 'name', 'email'] }
      ]
    });

    const storesWithRatings = stores.map(store => {
      const storeJSON = store.toJSON();
      let totalRating = 0;
      storeJSON.ratings.forEach(r => totalRating += r.rating);
      storeJSON.overallRating = storeJSON.ratings.length > 0 ? (totalRating / storeJSON.ratings.length).toFixed(2) : 0;
      
      // If normal user, find their submitted rating
      if (req.user.role === 'NORMAL') {
        const userRating = storeJSON.ratings.find(r => r.userId === req.user.id);
        storeJSON.myRating = userRating ? userRating.rating : null;
        storeJSON.myRatingId = userRating ? userRating.id : null;
      }
      
      delete storeJSON.ratings;
      return storeJSON;
    });

    res.json(storesWithRatings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get store owner dashboard (My stores and their ratings/users)
// @route   GET /api/stores/my-stores
// @access  Store Owner
router.get('/my-stores', protect, authorize('STORE_OWNER'), async (req, res) => {
  try {
    const stores = await Store.findAll({
      where: { ownerId: req.user.id },
      include: [
        { 
          model: Rating, 
          as: 'ratings',
          include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }]
        }
      ]
    });

    const storesWithStats = stores.map(store => {
      const storeJSON = store.toJSON();
      let totalRating = 0;
      storeJSON.ratings.forEach(r => totalRating += r.rating);
      storeJSON.averageRating = storeJSON.ratings.length > 0 ? (totalRating / storeJSON.ratings.length).toFixed(2) : 0;
      return storeJSON;
    });

    res.json(storesWithStats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
