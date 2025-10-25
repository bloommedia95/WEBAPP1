import mongoose from 'mongoose';
import dotenv from 'dotenv';
import blogModel from './models/blogModel.js';

dotenv.config();

// High-Quality Blog Articles for E-Commerce Fashion Platform
const qualityBlogs = [
  {
    title: "Top 10 Fashion Trends for 2025: What's Hot This Season",
    bannerImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Fashion_collage.jpg/800px-Fashion_collage.jpg",
    content: `
      <div class="blog-content">
        <p>Fashion is ever-evolving, and 2025 brings exciting new trends that blend comfort with style. From sustainable fashion to tech-integrated clothing, this year promises to revolutionize how we dress and express ourselves.</p>
        
        <h3>🌿 Sustainable Fashion Takes Center Stage</h3>
        <p>Eco-friendly materials and ethical production methods are no longer just trends—they're necessities. Brands are embracing organic cotton, recycled polyester, and innovative fabrics made from algae and mushrooms.</p>
        
        <h3>💎 Maximalist Jewelry</h3>
        <p>Bold, statement jewelry is making a comeback. Think chunky chains, oversized earrings, and layered necklaces that add instant glamour to any outfit.</p>
        
        <h3>🎨 Color Blocking Revolution</h3>
        <p>Vibrant color combinations are dominating runways. Don't be afraid to mix unexpected hues—electric blue with hot pink, or emerald green with sunset orange.</p>
        
        <h3>👗 Versatile Midi Dresses</h3>
        <p>The perfect length for any occasion, midi dresses are becoming wardrobe staples. They're professional enough for work yet stylish enough for weekend brunches.</p>
        
        <h3>🧥 Oversized Blazers</h3>
        <p>Power dressing gets a modern update with oversized blazers. Pair them with fitted pants or flowing skirts for a balanced silhouette.</p>
      </div>
    `,
    extraSections: [
      {
        title: "How to Style These Trends",
        content: "Start with one trend at a time. If you're new to color blocking, begin with neutral bases and add one bold accent piece. For sustainable fashion, invest in quality pieces that will last for years.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Sustainable_fashion.jpg/400px-Sustainable_fashion.jpg"]
      },
      {
        title: "Shopping Tips",
        content: "Always check fabric composition and care instructions. Invest in versatile pieces that can be styled multiple ways. Consider renting high-end pieces for special occasions.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Shopping_fashion.jpg/400px-Shopping_fashion.jpg"]
      }
    ]
  },
  
  {
    title: "The Ultimate Guide to Building a Capsule Wardrobe",
    bannerImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Minimal_wardrobe.jpg/800px-Minimal_wardrobe.jpg",
    content: `
      <div class="blog-content">
        <p>A capsule wardrobe is a curated collection of essential clothing items that don't go out of style. These pieces can be mixed and matched to create numerous outfits, making getting dressed both simple and stylish.</p>
        
        <h3>✨ What is a Capsule Wardrobe?</h3>
        <p>Originating in the 1970s, the concept involves having 30-40 pieces (including shoes and accessories) that work together harmoniously. The goal is quality over quantity.</p>
        
        <h3>🎯 Essential Pieces Every Capsule Needs</h3>
        <ul>
          <li><strong>Classic White Shirt:</strong> Perfect for layering and professional looks</li>
          <li><strong>Well-Fitted Jeans:</strong> Your go-to for casual occasions</li>
          <li><strong>Little Black Dress:</strong> Versatile for day-to-night transitions</li>
          <li><strong>Neutral Blazer:</strong> Instantly elevates any outfit</li>
          <li><strong>Quality Trench Coat:</strong> Timeless outerwear for any season</li>
        </ul>
        
        <h3>🎨 Choosing Your Color Palette</h3>
        <p>Select 2-3 neutral colors as your base (black, white, navy, or beige) and add 1-2 accent colors that complement your skin tone. This ensures everything coordinates effortlessly.</p>
        
        <h3>💰 Budget-Friendly Building Tips</h3>
        <p>Start with basics and build gradually. Invest in quality foundation pieces first—shoes, outerwear, and undergarments. Add trendy pieces sparingly and choose versatile options.</p>
      </div>
    `,
    extraSections: [
      {
        title: "Seasonal Adjustments",
        content: "Your capsule wardrobe should adapt to seasons. Store off-season items and rotate in weather-appropriate pieces. Focus on layering techniques to maximize outfit options.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Seasonal_clothes.jpg/400px-Seasonal_clothes.jpg"]
      },
      {
        title: "Maintenance and Care",
        content: "Proper care extends the life of your capsule pieces. Follow care labels, invest in quality hangers, and schedule regular closet audits to remove worn items.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Clothes_care.jpg/400px-Clothes_care.jpg"]
      }
    ]
  },

  {
    title: "Sustainable Fashion: How to Shop Ethically Without Breaking the Bank",
    bannerImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Eco_fashion.jpg/800px-Eco_fashion.jpg",
    content: `
      <div class="blog-content">
        <p>Sustainable fashion doesn't have to be expensive or boring. With the right strategies, you can build an eco-friendly wardrobe that's both stylish and affordable while supporting ethical brands and practices.</p>
        
        <h3>🌍 Why Sustainable Fashion Matters</h3>
        <p>The fashion industry is the second-largest polluter globally. By choosing sustainable options, you're reducing water waste, chemical pollution, and supporting fair labor practices.</p>
        
        <h3>💡 Smart Shopping Strategies</h3>
        <h4>1. Quality Over Quantity</h4>
        <p>Invest in well-made pieces that last longer. Check stitching, fabric quality, and read reviews before purchasing.</p>
        
        <h4>2. Second-Hand First</h4>
        <p>Thrift stores, consignment shops, and online resale platforms offer designer pieces at fraction of retail prices.</p>
        
        <h4>3. Clothing Swaps</h4>
        <p>Organize swaps with friends or join community events to refresh your wardrobe without spending money.</p>
        
        <h3>🏷️ Identifying Sustainable Brands</h3>
        <p>Look for certifications like GOTS (Global Organic Textile Standard), Fair Trade, or B-Corp status. Check brand websites for transparency about manufacturing processes.</p>
        
        <h3>♻️ Caring for Your Clothes</h3>
        <p>Proper care extends clothing life significantly. Wash in cold water, air dry when possible, and learn basic mending skills for minor repairs.</p>
      </div>
    `,
    extraSections: [
      {
        title: "DIY Fashion Updates",
        content: "Learn simple techniques to refresh old clothes: hemming, dyeing, adding patches, or converting pieces into new styles. YouTube tutorials make learning easy.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/DIY_fashion.jpg/400px-DIY_fashion.jpg"]
      },
      {
        title: "Eco-Friendly Fabrics Guide",
        content: "Choose organic cotton, linen, hemp, Tencel, and recycled materials. Avoid fast fashion synthetics that shed microplastics and don't biodegrade.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Organic_cotton.jpg/400px-Organic_cotton.jpg"]
      }
    ]
  },

  {
    title: "From Day to Night: 5 Outfits That Transition Seamlessly",
    bannerImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Day_to_night_fashion.jpg/800px-Day_to_night_fashion.jpg",
    content: `
      <div class="blog-content">
        <p>Busy schedules demand versatile clothing. Master the art of transitional dressing with these expert tips for taking your look from office-appropriate to evening-ready without a complete outfit change.</p>
        
        <h3>✨ The Foundation: Key Transitional Pieces</h3>
        <p>Success lies in choosing the right base pieces. Look for items that are sophisticated enough for day wear but can be elevated for evening events.</p>
        
        <h3>👔 Outfit 1: The Classic Blazer Look</h3>
        <p><strong>Day:</strong> Navy blazer + white blouse + tailored trousers + pumps</p>
        <p><strong>Night:</strong> Remove blazer, add statement jewelry, swap pumps for heels, add bold lipstick</p>
        
        <h3>👗 Outfit 2: The Versatile Wrap Dress</h3>
        <p><strong>Day:</strong> Midi wrap dress + cardigan + flats + minimal accessories</p>
        <p><strong>Night:</strong> Remove cardigan, add heels, statement earrings, and a clutch</p>
        
        <h3>👚 Outfit 3: The Blouse and Skirt Combo</h3>
        <p><strong>Day:</strong> Silk blouse + pencil skirt + blazer + low heels</p>
        <p><strong>Night:</strong> Tuck blouse differently, remove blazer, add statement belt and higher heels</p>
        
        <h3>🌟 Quick Change Accessories</h3>
        <p>Keep a "night kit" at your office: statement jewelry, bold lipstick, perfume, and a pair of heels. These small changes create dramatic transformations.</p>
      </div>
    `,
    extraSections: [
      {
        title: "Hair and Makeup Transitions",
        content: "Learn quick hairstyle changes: loose bun to flowing waves, sleek ponytail to side-swept style. Master the five-minute smoky eye for instant glamour.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Hair_makeup.jpg/400px-Hair_makeup.jpg"]
      },
      {
        title: "Seasonal Adaptations",
        content: "Adjust your transition techniques for seasons. Summer: light layers and sandals to strappy heels. Winter: blazers to statement coats and boots to ankle boots.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/s/s4/Seasonal_fashion.jpg/400px-Seasonal_fashion.jpg"]
      }
    ]
  },

  {
    title: "Accessory Guide: How Small Details Make Big Style Statements",
    bannerImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Fashion_accessories.jpg/800px-Fashion_accessories.jpg",
    content: `
      <div class="blog-content">
        <p>Accessories are the exclamation points of fashion. They have the power to transform basic outfits into statement looks, express personality, and adapt to different occasions without changing your entire wardrobe.</p>
        
        <h3>💎 The Power of Jewelry</h3>
        <p>Jewelry can instantly change your outfit's vibe. Delicate pieces create elegant, minimalist looks, while bold statement pieces add drama and personality.</p>
        
        <h4>Layering Necklaces</h4>
        <p>Mix different lengths and styles: choker + pendant + long chain. Vary textures and metals for visual interest, but keep a cohesive theme.</p>
        
        <h4>Earring Impact</h4>
        <p>Statement earrings can elevate the simplest outfit. If wearing bold earrings, keep other jewelry minimal to avoid overwhelming your look.</p>
        
        <h3>👜 Bag Selection Strategy</h3>
        <p>Your bag should complement your outfit and serve your needs. A structured tote for work, crossbody for casual outings, and clutch for evening events.</p>
        
        <h3>🧣 Scarves: The Ultimate Versatile Accessory</h3>
        <p>Wear around neck, as headband, belt, or even as a top. Choose silk for elegance, cotton for casual looks, and wool for warmth.</p>
        
        <h3>🕶️ Sunglasses and Belts</h3>
        <p>Sunglasses add instant cool factor and protect your eyes. Belts define waistlines and can make oversized pieces more flattering.</p>
      </div>
    `,
    extraSections: [
      {
        title: "Seasonal Accessory Swaps",
        content: "Update your accessories with seasons: straw hats and canvas bags for summer, leather gloves and wool scarves for winter. This refreshes looks without buying new clothes.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Seasonal_accessories.jpg/400px-Seasonal_accessories.jpg"]
      },
      {
        title: "Investment vs. Trend Pieces",
        content: "Invest in classic accessories: quality leather handbags, pearl earrings, silk scarves. Buy trendy pieces affordably and replace as styles change.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/i/i5/Investment_accessories.jpg/400px-Investment_accessories.jpg"]
      }
    ]
  },

  {
    title: "Color Psychology in Fashion: What Your Outfit Says About You",
    bannerImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Color_wheel_fashion.jpg/800px-Color_wheel_fashion.jpg",
    content: `
      <div class="blog-content">
        <p>Colors communicate before you even speak. Understanding color psychology can help you choose outfits that convey confidence, creativity, or professionalism depending on your goals.</p>
        
        <h3>🔴 Red: Power and Passion</h3>
        <p>Red commands attention and exudes confidence. Perfect for presentations, dates, or when you want to make a memorable impression. Use sparingly for maximum impact.</p>
        
        <h3>💙 Blue: Trust and Stability</h3>
        <p>Navy and royal blue convey professionalism and reliability. Ideal for job interviews, business meetings, or when you want to appear trustworthy and competent.</p>
        
        <h3>🌿 Green: Growth and Harmony</h3>
        <p>Green represents balance and growth. Emerald green suggests luxury, while sage green conveys calmness. Great for creative environments or outdoor events.</p>
        
        <h3>🖤 Black: Sophistication and Power</h3>
        <p>Black is timeless, slimming, and sophisticated. It works for formal events, professional settings, or when you want to appear authoritative and chic.</p>
        
        <h3>🤍 White: Purity and Fresh Starts</h3>
        <p>White suggests cleanliness, simplicity, and new beginnings. Perfect for summer, weddings, or when you want to appear fresh and optimistic.</p>
        
        <h3>💜 Purple: Creativity and Luxury</h3>
        <p>Purple combines red's passion with blue's stability. It suggests creativity, luxury, and individuality. Great for artistic fields or special occasions.</p>
        
        <h3>🎨 Using Color Strategically</h3>
        <p>Consider your goals when choosing colors. Job interview? Stick to blues and grays. Creative presentation? Add pops of purple or orange. First date? Red or pink can be flattering.</p>
      </div>
    `,
    extraSections: [
      {
        title: "Personal Color Analysis",
        content: "Discover your best colors based on skin tone, hair, and eye color. Cool undertones suit blues and purples, warm undertones favor oranges and yellows.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/p/p4/Color_analysis.jpg/400px-Color_analysis.jpg"]
      },
      {
        title: "Cultural Color Considerations",
        content: "Colors have different meanings across cultures. Red is lucky in China but can signify danger in Western cultures. Research color significance when dressing for international events.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/w/w2/Cultural_colors.jpg/400px-Cultural_colors.jpg"]
      }
    ]
  }
];

// Connect to MongoDB and seed blogs
async function seedBlogs() {
  try {
    console.log('📝 Starting blog seeding process...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');

    // Clear existing blogs
    await blogModel.deleteMany({});
    console.log('🗑️ Cleared existing blogs');

    // Insert new quality blogs
    const insertedBlogs = await blogModel.insertMany(qualityBlogs);
    
    console.log(`🎉 Successfully added ${insertedBlogs.length} quality blog articles:`);
    
    insertedBlogs.forEach((blog, index) => {
      console.log(`   ${index + 1}. 📄 ${blog.title}`);
      console.log(`      📅 Created: ${blog.createdAt.toLocaleDateString()}`);
      console.log(`      📝 Content Length: ${blog.content.length} characters`);
      console.log(`      🔗 Sections: ${blog.extraSections.length} additional sections`);
      console.log('');
    });

    console.log('✨ Blog seeding completed successfully!');
    console.log('🚀 Your fashion blog is now ready with high-quality content!');
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('📤 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error seeding blogs:', error);
    process.exit(1);
  }
}

// Run the seeder
console.log('🌟 Bloom E-Commerce Blog Seeder');
console.log('================================');
seedBlogs();