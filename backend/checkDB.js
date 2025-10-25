import mongoose from 'mongoose';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/dashtar')
  .then(() => {
    console.log('✅ Connected to MongoDB');
    return checkUsers();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  });

async function checkUsers() {
  try {
    // Get all collections in the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📋 Available collections:');
    collections.forEach(col => console.log(' -', col.name));
    
    // Check users collection
    console.log('\n👥 Checking users collection:');
    const usersCollection = mongoose.connection.db.collection('users');
    const users = await usersCollection.find({}).toArray();
    console.log('Users found:', users.length);
    users.forEach((user, index) => {
      console.log(`User ${index + 1}:`, {
        name: user.name,
        email: user.email,
        contactNumber: user.contactNumber,
        createdAt: user.createdAt
      });
    });

    // Also check profileusers collection (as the model name suggests this might be the collection)
    console.log('\n👤 Checking profileusers collection:');
    const profileUsersCollection = mongoose.connection.db.collection('profileusers');
    const profileUsers = await profileUsersCollection.find({}).toArray();
    console.log('Profile users found:', profileUsers.length);
    profileUsers.forEach((user, index) => {
      console.log(`Profile User ${index + 1}:`, {
        name: user.name,
        email: user.email,
        contactNumber: user.contactNumber,
        createdAt: user.createdAt
      });
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking database:', error);
    process.exit(1);
  }
}