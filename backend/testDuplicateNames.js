import mongoose from "mongoose";
import Product from "./models/Product.js";

// Connect to MongoDB
await mongoose.connect("mongodb://localhost:27017/dashtar");

console.log("🔗 Connected to MongoDB");

try {
  // Test adding multiple products with same name
  console.log("🧪 Testing duplicate name products...");
  
  const testProducts = [
    {
      name: "Test Top",
      sku: "TEST001",
      category: "clothing",
      price: 999,
      stock: 10,
      description: "First test top"
    },
    {
      name: "Test Top", // Same name!
      sku: "TEST002", 
      category: "clothing",
      price: 1299,
      stock: 15,
      description: "Second test top with same name"
    }
  ];
  
  for (let i = 0; i < testProducts.length; i++) {
    const product = new Product(testProducts[i]);
    const saved = await product.save();
    console.log(`✅ Product ${i + 1} saved:`, saved.name, "- SKU:", saved.sku);
  }
  
  console.log("\n🎉 Success! Duplicate names are now allowed!");
  
} catch (error) {
  console.error("❌ Error:", error.message);
} finally {
  mongoose.connection.close();
  console.log("🔒 Database connection closed");
}