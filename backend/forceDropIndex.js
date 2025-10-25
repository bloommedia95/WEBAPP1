import mongoose from "mongoose";

// Connect to MongoDB  
await mongoose.connect("mongodb://localhost:27017/dashtar");

console.log("🔗 Connected to MongoDB");

try {
  const db = mongoose.connection.db;
  const collection = db.collection('products');
  
  console.log("🔍 Checking current indexes...");
  
  // List all indexes
  const indexes = await collection.indexes();
  console.log("📋 Current indexes:");
  indexes.forEach(idx => {
    console.log(`   - ${idx.name}: ${JSON.stringify(idx.key)}`);
    if (idx.unique) {
      console.log(`     ⚠️ UNIQUE constraint: ${idx.unique}`);
    }
  });
  
  // Try to drop name_1 index if it exists
  console.log("\n🗑️ Attempting to drop name_1 index...");
  
  try {
    await collection.dropIndex("name_1");
    console.log("✅ Successfully dropped name_1 index");
  } catch (dropErr) {
    if (dropErr.code === 27) {
      console.log("ℹ️ Index name_1 does not exist");
    } else {
      console.log("❌ Error dropping index:", dropErr.message);
    }
  }
  
  // Also try dropping any other name-related indexes
  try {
    const nameIndexes = indexes.filter(idx => 
      JSON.stringify(idx.key).includes('name') && idx.name !== '_id_'
    );
    
    for (const idx of nameIndexes) {
      if (idx.name !== '_id_') {
        console.log(`🗑️ Dropping index: ${idx.name}`);
        try {
          await collection.dropIndex(idx.name);
          console.log(`✅ Dropped ${idx.name}`);
        } catch (err) {
          console.log(`❌ Failed to drop ${idx.name}:`, err.message);
        }
      }
    }
  } catch (err) {
    console.log("❌ Error in bulk index drop:", err.message);
  }
  
  // Verify final state
  console.log("\n📋 Final indexes:");
  const finalIndexes = await collection.indexes();
  finalIndexes.forEach(idx => {
    console.log(`   - ${idx.name}: ${JSON.stringify(idx.key)}`);
  });
  
  console.log("\n🎉 Index cleanup completed!");
  console.log("✅ You can now add products with duplicate names");
  
} catch (error) {
  console.error("❌ Error:", error);
} finally {
  mongoose.connection.close();
  console.log("🔒 Database connection closed");
}