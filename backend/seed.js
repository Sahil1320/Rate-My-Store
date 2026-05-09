const { sequelize, User, Store, Rating } = require('./models');
require('dotenv').config();

const seed = async () => {
  try {
    await sequelize.sync({ force: true }); // Warning: clears db
    console.log('Database synced (tables recreated).\n');

    // ===== 1. Create Admin User =====
    const admin = await User.create({
      name: 'System Administrator Account',
      email: 'admin@system.com',
      password: 'Admin@123',
      address: 'Admin HQ, Tech City, Bangalore 560001',
      role: 'ADMIN'
    });
    console.log('✅ Admin created: admin@system.com / Admin@123');

    // ===== 2. Create Store Owners =====
    const storeOwner1 = await User.create({
      name: 'Rahul Sharma Store Owner',
      email: 'rahul@stores.com',
      password: 'Rahul@123',
      address: 'MG Road, Bangalore 560001',
      role: 'STORE_OWNER'
    });

    const storeOwner2 = await User.create({
      name: 'Priya Patel Store Owner',
      email: 'priya@stores.com',
      password: 'Priya@123',
      address: 'Koramangala, Bangalore 560034',
      role: 'STORE_OWNER'
    });

    console.log('✅ Store Owner 1: rahul@stores.com / Rahul@123');
    console.log('✅ Store Owner 2: priya@stores.com / Priya@123');

    // ===== 3. Create Normal Users =====
    const user1 = await User.create({
      name: 'Amit Kumar User',
      email: 'amit@user.com',
      password: 'Amit@1234',
      address: 'Indiranagar, Bangalore 560038',
      role: 'NORMAL'
    });

    const user2 = await User.create({
      name: 'Sneha Reddy User',
      email: 'sneha@user.com',
      password: 'Sneha@123',
      address: 'HSR Layout, Bangalore 560102',
      role: 'NORMAL'
    });

    const user3 = await User.create({
      name: 'Vikram Singh User',
      email: 'vikram@user.com',
      password: 'Vikram@12',
      address: 'Whitefield, Bangalore 560066',
      role: 'NORMAL'
    });

    console.log('✅ Normal User 1: amit@user.com / Amit@1234');
    console.log('✅ Normal User 2: sneha@user.com / Sneha@123');
    console.log('✅ Normal User 3: vikram@user.com / Vikram@12');

    // ===== 4. Create Stores =====
    const store1 = await Store.create({
      name: 'TechGadgets Electronics Hub',
      email: 'techgadgets@store.com',
      address: 'Brigade Road, MG Road, Bangalore 560001',
      ownerId: storeOwner1.id
    });

    const store2 = await Store.create({
      name: 'FreshMart Grocery Store',
      email: 'freshmart@store.com',
      address: '4th Block, Koramangala, Bangalore 560034',
      ownerId: storeOwner1.id
    });

    const store3 = await Store.create({
      name: 'StyleZone Fashion Outlet',
      email: 'stylezone@store.com',
      address: '100 Feet Road, Indiranagar, Bangalore 560038',
      ownerId: storeOwner2.id
    });

    const store4 = await Store.create({
      name: 'BookWorm Library Store',
      email: 'bookworm@store.com',
      address: 'Church Street, Bangalore 560001',
      ownerId: storeOwner2.id
    });

    console.log('\n✅ Store 1: TechGadgets Electronics Hub (Owner: Rahul)');
    console.log('✅ Store 2: FreshMart Grocery Store (Owner: Rahul)');
    console.log('✅ Store 3: StyleZone Fashion Outlet (Owner: Priya)');
    console.log('✅ Store 4: BookWorm Library Store (Owner: Priya)');

    // ===== 5. Create Ratings =====
    await Rating.create({ storeId: store1.id, userId: user1.id, rating: 5 });
    await Rating.create({ storeId: store1.id, userId: user2.id, rating: 4 });
    await Rating.create({ storeId: store1.id, userId: user3.id, rating: 4 });

    await Rating.create({ storeId: store2.id, userId: user1.id, rating: 3 });
    await Rating.create({ storeId: store2.id, userId: user2.id, rating: 5 });

    await Rating.create({ storeId: store3.id, userId: user1.id, rating: 4 });
    await Rating.create({ storeId: store3.id, userId: user3.id, rating: 5 });

    await Rating.create({ storeId: store4.id, userId: user2.id, rating: 3 });

    console.log('\n✅ 8 ratings seeded across 4 stores');

    console.log('\n========================================');
    console.log('  Database seeded successfully!');
    console.log('========================================');
    console.log('\nLogin Credentials:');
    console.log('  Admin:       admin@system.com  / Admin@123');
    console.log('  Store Owner: rahul@stores.com  / Rahul@123');
    console.log('  Store Owner: priya@stores.com  / Priya@123');
    console.log('  Normal User: amit@user.com     / Amit@1234');
    console.log('  Normal User: sneha@user.com    / Sneha@123');
    console.log('  Normal User: vikram@user.com   / Vikram@12');
    console.log('========================================\n');

    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();
