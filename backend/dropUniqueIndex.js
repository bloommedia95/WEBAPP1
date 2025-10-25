import mongoose from "mongoose";

// Connect to MongoDB
await mongoose.connect("mongodb://localhost:27017/dashtar");

console.log("🔗 Connected to MongoDB");

try {
  // Drop the unique index on name field
  const db = mongoose.connection.db;
  const collection = db.collection('products');
  
  console.log("🗑️ Dropping unique index on 'name' field...");
  
  // Check existing indexes
  const indexes = await collection.indexes();
  console.log("📋 Current indexes:", indexes.map(idx => ({ name: idx.name, key: idx.key })));
  
  // Drop the name_1 index if it exists
  try {
    await collection.dropIndex("name_1");
    console.log("✅ Successfully dropped 'name_1' unique index");
  } catch (dropErr) {
    if (dropErr.code === 27) {
      console.log("ℹ️ Index 'name_1' does not exist (already dropped)");
    } else {
      console.error("❌ Error dropping index:", dropErr.message);
    }
  }
  
  // Check indexes after dropping
  const newIndexes = await collection.indexes();
  console.log("📋 Indexes after drop:", newIndexes.map(idx => ({ name: idx.name, key: idx.key })));
  
  console.log("\n🎉 Database index cleanup completed!");
  console.log("✅ You can now add products with duplicate names");
  
} catch (error) {
  console.error("❌ Error:", error);
} finally {
  mongoose.connection.close();
  console.log("🔒 Database connection closed");
}