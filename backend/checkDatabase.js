import mongoose from "mongoose";
import Product from "./models/Product.js";

// Connect to MongoDB
await mongoose.connect("mongodb://localhost:27017/dashtar");

console.log("🔗 Connected to MongoDB");

try {
  // Get current product count
  const totalProducts = await Product.countDocuments();
  console.log(`📊 Current products in database: ${totalProducts}`);
  
  // Get last 5 products
  const recentProducts = await Product.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .select('name sku category price createdAt');
    
  console.log("\n📋 Last 5 products:");
  recentProducts.forEach((product, index) => {
    console.log(`${index + 1}. ${product.name} (${product.sku}) - ₹${product.price} - ${product.category}`);
    console.log(`   Created: ${product.createdAt}`);
  });
  
  console.log("\n✅ Database check completed");
  
} catch (error) {
  console.error("❌ Error:", error);
} finally {
  mongoose.connection.close();
  console.log("🔒 Database connection closed");
}