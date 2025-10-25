import mongoose from "mongoose";
import Product from "./models/Product.js";

// Connect to MongoDB
await mongoose.connect("mongodb://localhost:27017/dashtar");

console.log("🔗 Connected to MongoDB");

// Update products with realistic image paths based on existing folders
const imageUpdates = [
  // Clothing products
  {
    sku: "CL001",
    images: [
      "/uploads/Clothing/clothing_img1.jpg",
      "/uploads/Clothing/clothing_img2.jpg", 
      "/uploads/Clothing/clothing_img3.jpg",
      "/uploads/Clothing/clothing_img4.jpg"
    ],
    imageUrl: "/uploads/Clothing/clothing_img1.jpg"
  },
  {
    sku: "CL002",
    images: [
      "/uploads/Clothing/clothing_img5.jpg",
      "/uploads/Clothing/clothing_img6.jpg",
      "/uploads/Clothing/clothing_img7.jpg",
      "/uploads/Clothing/clothing_img8.jpg"
    ],
    imageUrl: "/uploads/Clothing/clothing_img5.jpg"
  },
  {
    sku: "CL003",
    images: [
      "/uploads/Clothing/clothing_img9.jpg",
      "/uploads/Clothing/clothing_img10.jpg",
      "/uploads/Clothing/clothing_img11.jpg",
      "/uploads/Clothing/clothing_img12.jpg"
    ],
    imageUrl: "/uploads/Clothing/clothing_img9.jpg"
  },
  {
    sku: "CL004",
    images: [
      "/uploads/Clothing/clothing_img13.jpg",
      "/uploads/Clothing/clothing_img14.jpg",
      "/uploads/Clothing/clothing_img15.jpg",
      "/uploads/Clothing/clothing_img16.jpg"
    ],
    imageUrl: "/uploads/Clothing/clothing_img13.jpg"
  },
  {
    sku: "CL005",
    images: [
      "/uploads/Clothing/clothing_img17.jpg",
      "/uploads/Clothing/clothing_img18.jpg",
      "/uploads/Clothing/clothing_img19.jpg",
      "/uploads/Clothing/clothing_img20.jpg"
    ],
    imageUrl: "/uploads/Clothing/clothing_img17.jpg"
  },

  // Footwear products
  {
    sku: "FW001",
    images: [
      "/uploads/Footwear/footwear_img1.jpg",
      "/uploads/Footwear/footwear_img2.jpg",
      "/uploads/Footwear/footwear_img3.jpg",
      "/uploads/Footwear/footwear_img4.jpg"
    ],
    imageUrl: "/uploads/Footwear/footwear_img1.jpg"
  },
  {
    sku: "FW002",
    images: [
      "/uploads/Footwear/footwear_img5.jpg",
      "/uploads/Footwear/footwear_img6.jpg",
      "/uploads/Footwear/footwear_img7.jpg",
      "/uploads/Footwear/footwear_img8.jpg"
    ],
    imageUrl: "/uploads/Footwear/footwear_img5.jpg"
  },
  {
    sku: "FW003",
    images: [
      "/uploads/Footwear/footwear_img9.jpg",
      "/uploads/Footwear/footwear_img10.jpg",
      "/uploads/Footwear/footwear_img11.jpg",
      "/uploads/Footwear/footwear_img12.jpg"
    ],
    imageUrl: "/uploads/Footwear/footwear_img9.jpg"
  },
  {
    sku: "FW004",
    images: [
      "/uploads/Footwear/footwear_img13.jpg",
      "/uploads/Footwear/footwear_img14.jpg",
      "/uploads/Footwear/footwear_img15.jpg",
      "/uploads/Footwear/footwear_img16.jpg"
    ],
    imageUrl: "/uploads/Footwear/footwear_img13.jpg"
  },
  {
    sku: "FW005",
    images: [
      "/uploads/Footwear/footwear_img17.jpg",
      "/uploads/Footwear/footwear_img18.jpg",
      "/uploads/Footwear/footwear_img19.jpg",
      "/uploads/Footwear/footwear_img20.jpg"
    ],
    imageUrl: "/uploads/Footwear/footwear_img17.jpg"
  },

  // Bags products  
  {
    sku: "BG001",
    images: [
      "/uploads/products/bags_img1.jpg",
      "/uploads/products/bags_img2.jpg",
      "/uploads/products/bags_img3.jpg",
      "/uploads/products/bags_img4.jpg"
    ],
    imageUrl: "/uploads/products/bags_img1.jpg"
  },
  {
    sku: "BG002",
    images: [
      "/uploads/products/bags_img5.jpg",
      "/uploads/products/bags_img6.jpg",
      "/uploads/products/bags_img7.jpg",
      "/uploads/products/bags_img8.jpg"
    ],
    imageUrl: "/uploads/products/bags_img5.jpg"
  },
  {
    sku: "BG003",
    images: [
      "/uploads/products/bags_img9.jpg",
      "/uploads/products/bags_img10.jpg",
      "/uploads/products/bags_img11.jpg",
      "/uploads/products/bags_img12.jpg"
    ],
    imageUrl: "/uploads/products/bags_img9.jpg"
  },
  {
    sku: "BG004",
    images: [
      "/uploads/products/bags_img13.jpg",
      "/uploads/products/bags_img14.jpg",
      "/uploads/products/bags_img15.jpg",
      "/uploads/products/bags_img16.jpg"
    ],
    imageUrl: "/uploads/products/bags_img13.jpg"
  },
  {
    sku: "BG005",
    images: [
      "/uploads/products/bags_img17.jpg",
      "/uploads/products/bags_img18.jpg",
      "/uploads/products/bags_img19.jpg",
      "/uploads/products/bags_img20.jpg"
    ],
    imageUrl: "/uploads/products/bags_img17.jpg"
  },

  // Cosmetic products
  {
    sku: "CS001",
    images: [
      "/uploads/Cosmetic/cosmetic_img1.jpg",
      "/uploads/Cosmetic/cosmetic_img2.jpg",
      "/uploads/Cosmetic/cosmetic_img3.jpg",
      "/uploads/Cosmetic/cosmetic_img4.jpg"
    ],
    imageUrl: "/uploads/Cosmetic/cosmetic_img1.jpg"
  },
  {
    sku: "CS002",
    images: [
      "/uploads/Cosmetic/cosmetic_img5.jpg",
      "/uploads/Cosmetic/cosmetic_img6.jpg",
      "/uploads/Cosmetic/cosmetic_img7.jpg",
      "/uploads/Cosmetic/cosmetic_img8.jpg"
    ],
    imageUrl: "/uploads/Cosmetic/cosmetic_img5.jpg"
  },
  {
    sku: "CS003",
    images: [
      "/uploads/Cosmetic/cosmetic_img9.jpg",
      "/uploads/Cosmetic/cosmetic_img10.jpg",
      "/uploads/Cosmetic/cosmetic_img11.jpg",
      "/uploads/Cosmetic/cosmetic_img12.jpg"
    ],
    imageUrl: "/uploads/Cosmetic/cosmetic_img9.jpg"
  },
  {
    sku: "CS004",
    images: [
      "/uploads/Cosmetic/cosmetic_img13.jpg",
      "/uploads/Cosmetic/cosmetic_img14.jpg",
      "/uploads/Cosmetic/cosmetic_img15.jpg",
      "/uploads/Cosmetic/cosmetic_img16.jpg"
    ],
    imageUrl: "/uploads/Cosmetic/cosmetic_img13.jpg"
  },
  {
    sku: "CS005",
    images: [
      "/uploads/Cosmetic/cosmetic_img17.jpg",
      "/uploads/Cosmetic/cosmetic_img18.jpg",
      "/uploads/Cosmetic/cosmetic_img19.jpg",
      "/uploads/Cosmetic/cosmetic_img20.jpg"
    ],
    imageUrl: "/uploads/Cosmetic/cosmetic_img17.jpg"
  },

  // Accessories products
  {
    sku: "AC001",
    images: [
      "/uploads/Acessiories/accessories_img1.jpg",
      "/uploads/Acessiories/accessories_img2.jpg",
      "/uploads/Acessiories/accessories_img3.jpg",
      "/uploads/Acessiories/accessories_img4.jpg"
    ],
    imageUrl: "/uploads/Acessiories/accessories_img1.jpg"
  },
  {
    sku: "AC002",
    images: [
      "/uploads/Acessiories/accessories_img5.jpg",
      "/uploads/Acessiories/accessories_img6.jpg",
      "/uploads/Acessiories/accessories_img7.jpg",
      "/uploads/Acessiories/accessories_img8.jpg"
    ],
    imageUrl: "/uploads/Acessiories/accessories_img5.jpg"
  },
  {
    sku: "AC003",
    images: [
      "/uploads/Acessiories/accessories_img9.jpg",
      "/uploads/Acessiories/accessories_img10.jpg",
      "/uploads/Acessiories/accessories_img11.jpg",
      "/uploads/Acessiories/accessories_img12.jpg"
    ],
    imageUrl: "/uploads/Acessiories/accessories_img9.jpg"
  },
  {
    sku: "AC004",
    images: [
      "/uploads/Acessiories/accessories_img13.jpg",
      "/uploads/Acessiories/accessories_img14.jpg",
      "/uploads/Acessiories/accessories_img15.jpg",
      "/uploads/Acessiories/accessories_img16.jpg"
    ],
    imageUrl: "/uploads/Acessiories/accessories_img13.jpg"
  },
  {
    sku: "AC005",
    images: [
      "/uploads/Acessiories/accessories_img17.jpg",
      "/uploads/Acessiories/accessories_img18.jpg",
      "/uploads/Acessiories/accessories_img19.jpg",
      "/uploads/Acessiories/accessories_img20.jpg"
    ],
    imageUrl: "/uploads/Acessiories/accessories_img17.jpg"
  }
];

console.log("🖼️ Updating product images...");

try {
  let updatedCount = 0;
  
  for (const update of imageUpdates) {
    const result = await Product.updateOne(
      { sku: update.sku },
      { 
        $set: { 
          images: update.images,
          imageUrl: update.imageUrl 
        }
      }
    );
    
    if (result.modifiedCount > 0) {
      updatedCount++;
      console.log(`✅ Updated images for product: ${update.sku}`);
    } else {
      console.log(`⚠️ Product not found: ${update.sku}`);
    }
  }
  
  console.log(`\n🎉 Successfully updated images for ${updatedCount} products!`);
  
  // Verify the updates
  const sampleProduct = await Product.findOne({ sku: "CL001" });
  if (sampleProduct) {
    console.log("\n📋 Sample product verification:");
    console.log(`   Name: ${sampleProduct.name}`);
    console.log(`   Main Image: ${sampleProduct.imageUrl}`);
    console.log(`   All Images: ${sampleProduct.images.length} images`);
  }

} catch (error) {
  console.error("❌ Error updating product images:", error);
} finally {
  mongoose.connection.close();
  console.log("🔒 Database connection closed");
}