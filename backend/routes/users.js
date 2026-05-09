const express = require('express');
const router = express.Router();
const { User, Store, Rating, sequelize } = require('../models');
const { protect, authorize } = require('../middleware/authMiddleware');
const { Op } = require('sequelize');

// @desc    Get dashboard stats
// @route   GET /api/users/dashboard
// @access  Admin
router.get('/dashboard', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get all users (Normal, Admin, Store Owner)
// @route   GET /api/users
// @access  Admin
router.get('/', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const { name, email, address, role, sortField, sortOrder } = req.query;
    let whereClause = {};

    if (name) whereClause.name = { [Op.like]: `%${name}%` };
    if (email) whereClause.email = { [Op.like]: `%${email}%` };
    if (address) whereClause.address = { [Op.like]: `%${address}%` };
    if (role) whereClause.role = role;

    let orderClause = [['createdAt', 'DESC']];
    if (sortField && ['name', 'email', 'role', 'address'].includes(sortField)) {
      orderClause = [[sortField, sortOrder === 'asc' ? 'ASC' : 'DESC']];
    }

    const users = await User.findAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      order: orderClause,
      include: [
        {
          model: Store,
          as: 'stores',
          include: [{ model: Rating, as: 'ratings' }]
        }
      ]
    });

    // Compute average rating for store owners
    const usersWithRatings = users.map(user => {
      const userJSON = user.toJSON();
      if (user.role === 'STORE_OWNER') {
        let totalRating = 0;
        let count = 0;
        userJSON.stores.forEach(store => {
          store.ratings.forEach(r => {
            totalRating += r.rating;
            count++;
          });
        });
        userJSON.averageStoreRating = count > 0 ? (totalRating / count).toFixed(2) : 0;
      }
      delete userJSON.stores; // hide stores detail if not needed, or keep it
      return userJSON;
    });

    res.json(usersWithRatings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create new user
// @route   POST /api/users
// @access  Admin
router.post('/', protect, authorize('ADMIN'), async (req, res) => {
  const { name, email, password, address, role } = req.body;
  try {
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*]).{8,16}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        message: 'Password must be 8-16 characters, include at least one uppercase letter and one special character.' 
      });
    }

    const userRole = role || 'NORMAL';
    const user = await User.create({
      name, email, password, address, role: userRole
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Server error' });
  }
});

module.exports = router;
