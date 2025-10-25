import mongoose from "mongoose";
import Product from "./models/Product.js";

// Connect to MongoDB
await mongoose.connect("mongodb://localhost:27017/dashtar");

console.log("🔗 Connected to MongoDB");

try {
  console.log("🧪 Testing duplicate name products...");
  
  // Test 1: Add first "test product"
  const product1 = new Product({
    name: "test product",
    sku: "TEST001",
    category: "clothing",
    price: 500,
    stock: 10
  });
  
  await product1.save();
  console.log("✅ Product 1 saved: 'test product' with SKU: TEST001");
  
  // Test 2: Add second "test product" (same name!)
  const product2 = new Product({
    name: "test product", // SAME NAME!
    sku: "TEST002",       // Different SKU
    category: "clothing", 
    price: 750,
    stock: 15
  });
  
  await product2.save();
  console.log("✅ Product 2 saved: 'test product' with SKU: TEST002");
  
  // Test 3: Add third "test product" (same name again!)
  const product3 = new Product({
    name: "test product", // SAME NAME AGAIN!
    sku: "TEST003",
    category: "footwear",
    price: 1200,
    stock: 5
  });
  
  await product3.save();
  console.log("✅ Product 3 saved: 'test product' with SKU: TEST003");
  
  console.log("\n🎉 SUCCESS! Multiple products with same name saved!");
  console.log("✅ Duplicate names are now fully allowed");
  
  // Verify by counting
  const count = await Product.countDocuments({ name: "test product" });
  console.log(`📊 Total products with name "test product": ${count}`);
  
} catch (error) {
  console.error("❌ Error:", error.message);
  if (error.code === 11000) {
    console.error("🚫 Duplicate key error still exists - need more cleanup");
  }
} finally {
  mongoose.connection.close();
  console.log("🔒 Database connection closed");
}