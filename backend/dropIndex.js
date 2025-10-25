import mongoose from 'mongoose';

async function dropIndex() {
  try {
    console.log('🔧 Connecting to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/bloom-ecommerce-persistent');
    console.log('✅ Connected to MongoDB');
    
    // Get the permissions collection
    const db = mongoose.connection.db;
    const collection = db.collection('permissions');
    
    console.log('📋 Checking existing indexes...');
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes.map(idx => idx.name));
    
    console.log('🗑️ Dropping userId_1 index...');
    try {
      await collection.dropIndex('userId_1');
      console.log('✅ Successfully dropped userId_1 index');
    } catch (error) {
      if (error.message.includes('index not found')) {
        console.log('ℹ️ Index userId_1 does not exist');
      } else {
        console.error('❌ Error dropping index:', error.message);
      }
    }
    
    console.log('📋 Final indexes after cleanup:');
    const finalIndexes = await collection.indexes();
    console.log('Final indexes:', finalIndexes.map(idx => idx.name));
    
    console.log('✅ Index cleanup completed!');
    
  } catch (error) {
    console.error('❌ Error in index cleanup:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
    process.exit(0);
  }
}

dropIndex();