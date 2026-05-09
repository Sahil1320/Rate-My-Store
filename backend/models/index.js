const sequelize = require('../config/db');
const User = require('./User');
const Store = require('./Store');
const Rating = require('./Rating');

// Relationships

// A user can own many stores (if STORE_OWNER)
User.hasMany(Store, { foreignKey: 'ownerId', as: 'stores' });
Store.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// A user can submit many ratings
User.hasMany(Rating, { foreignKey: 'userId', as: 'ratings' });
Rating.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// A store can receive many ratings
Store.hasMany(Rating, { foreignKey: 'storeId', as: 'ratings' });
Rating.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

// Optional: sync function if needed to be called
const syncDB = async () => {
  await sequelize.sync({ alter: true });
  console.log('Database synced');
};

module.exports = {
  sequelize,
  User,
  Store,
  Rating,
  syncDB
};
