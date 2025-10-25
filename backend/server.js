// ...existing code...

// Core imports
import express from "express";
import path from "path";
import compression from "compression";
import morgan from "morgan";
import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs";
import { fileURLToPath } from 'url';
import multer from "multer";
import dotenv from "dotenv";

// Database and config imports
import connectDB from "./config/db.js";

// Import filterConfig as ES6 module by creating a simple inline config
const filterConfig = {
  clothing: {
    "According to Gender": ["Men", "Women", "Boys", "Girls"],
    "According to Price": ["Rs.500 - Rs.1500", "Rs.1500 - Rs.2500", "Rs.2500 - Rs.3500", "Rs.3500 - Rs.4500", "Rs.4500 - & above"],
    "According to Brand": ["H&M", "Calvin Kellin", "Max", "Allen Solly", "Denim"],
    "According to Categories": ["Tops", "Suits", "Jeans", "Dresses", "Jackets"],
    "According to Size": ["XS", "S", "M", "L", "XL", "XXL"],
    "According to Color": ["Black", "White", "Red", "Pink", "Green", "Navy Blue"],
  },
  footwear: {
    "According to Gender": ["Men", "Women", "Boys", "Girls"],
    "According to Price": ["Rs.500 - Rs.1500", "Rs.1500 - Rs.2500", "Rs.2500 - Rs.3500", "Rs.3500 - Rs.4500", "Rs.4500 - & above"],
    "According to Brand": ["H&M", "Calvin Kellin", "Max", "Bata", "Sketchers"],
    "According to Categories": ["Heels", "Flip Flop", "Bellies", "Sandales", "Shoes"],
    "According to Size": ["36", "37", "38", "39", "40"],
    "According to Color": ["Black", "White", "Red", "Pink", "Green", "Navy Blue"],
  },
  bags: {
    "According to Gender": ["Men", "Women", "Boys", "Girls"],
    "According to Price": ["Rs.500 - Rs.1500", "Rs.1500 - Rs.2500", "Rs.2500 - Rs.3500", "Rs.3500 - Rs.4500", "Rs.4500 - & above"],
    "According to Brand": ["Lavie", "Lavie Luxe", "Gusses", "H&M", "Calvin Kellin"],
    "According to Categories": ["Sling Bag", "Tote Bag", "Short Shoulder Bag", "Shoulder Bag", "Backpack"],
    "According to Size": ["Small", "Medium", "Large"],
    "According to Color": ["Black", "White", "Red", "Pink", "Green", "Navy Blue"],
  },
  cosmetic: {
    "According to Gender": ["Men", "Women", "Boys", "Girls"],
    "According to Price": ["Rs.500 - Rs.1500", "Rs.1500 - Rs.2500", "Rs.2500 - Rs.3500", "Rs.3500 - Rs.4500", "Rs.4500 - & above"],
    "According to Brand": ["Dot&Key", "Plum", "Guess", "Mars", "Lakme"],
    "According to Categories": ["Lipstick", "Toner", "Foundation", "Serum", "Eyeshadow"],
    "According to Color": ["Black", "White", "Red", "Pink", "Green", "Navy Blue"],
  },
  accessories: {
    "According to Gender": ["Men", "Women", "Boys", "Girls"],
    "According to Price": ["Rs.500 - Rs.1500", "Rs.1500 - Rs.2500", "Rs.2500 - Rs.3500", "Rs.3500 - Rs.4500", "Rs.4500 - & above"],
    "According to Material": ["Leather", "Fabric", "Metal"],
    "According to Brand": ["Titan", "Giva", "French Connection", "Fossil", "H&M"],
    "According to Categories": ["Watch", "Sunglasses", "Jewellery", "Belt", "Wallet"],
    "According to Color": ["Black", "White", "Red", "Pink", "Green", "Navy Blue"],
  }
};

// Model imports
import Category from "./models/Category.js";
import Product from "./models/Product.js";
import Invoice from "./models/Invoice.js";
import Account from "./models/Account.js";
import Offer from "./models/Offer.js";


import Attribute from "./models/Attribute.js";
import Coupon from "./models/Coupon.js";
import Order from './models/Order.js';
import Customer from "./models/Customer.js";
import Media from "./models/Media.js";
import Staff from "./models/Staff.js";
import Setting from "./models/Setting.js";
import Language from "./models/Language.js";
import Currency from "./models/Currency.js";
import AuthUser from "./models/AuthUser.js";
import About from "./models/About.js";
import Cart from "./models/cart.js";
import profileuser from "./models/profileuser.js";
import Transaction from "./models/Transaction.js";
import Permission from "./models/Permission.js";

// Route imports
import signupRouter from "./routes/signup.js";
import userRouter from "./routes/user.js";
import blogRouter from "./routes/blog.js";
import blogAdminRouter from "./routes/blog-admin.js";
import otpRouter from "./routes/otp.js";
import ordersRouter from "./routes/orders.js";
import addressesRouter from "./routes/addresses.js";
import paymentsRouter from "./routes/payments.js";
import themesRouter from "./routes/themes.js";
import couponsRouter from "./routes/coupons.js";
import rolesRouter from "./routes/roles.js";
import offerRouter from "./routes/offer.js";


// Additional model imports
import BlogModel from "./models/blogModel.js";




dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




const app = express();
// Enable CORS for frontend (React) - MUST be first middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
  optionsSuccessStatus: 200
}));
// Ensure body parsers are registered before any routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Register offer routes after app is initialized
app.use("/api/offers", offerRouter);

// Enhanced request logging middleware (must be placed after CORS)
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`\n🔍 [${timestamp}] ${req.method} ${req.originalUrl}`);
  console.log('📡 Headers:', JSON.stringify(req.headers, null, 2));
  console.log('🌐 Origin:', req.get('origin'));
  console.log('📍 User-Agent:', req.get('user-agent'));
  
  next();
});

// Session middleware (required for admin login)
app.use(session({
  secret: "yourSecretKey",
  resave: false,
  saveUninitialized: true
}));

// Add user permissions to all routes
app.use(addUserPermissions);

// Parse application/x-www-form-urlencoded (for form POST requests)
app.use(express.urlencoded({ extended: true }));

// Admin panel login (form-based)
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  console.log('🔐 Login attempt:', email);
  
  try {
    // Special handling for superadmin (hardcoded for security)
    if (email === "superadmin@gmail.com" && password === "admin") {
      req.session.isAuth = true;
      req.session.user = {
        email: email,
        role: 'superadmin'
      };
      req.session.hasFullAccess = true;
      console.log('✅ Superadmin logged in:', email);
      return res.redirect("/dashboard");
    }
    
    // Special handling for basic admin (hardcoded fallback)
    if (email === "admin@gmail.com" && password === "admin") {
      req.session.isAuth = true;
      req.session.user = {
        email: email,
        role: 'admin'
      };
      req.session.hasFullAccess = false;
      console.log('✅ Admin logged in:', email);
      return res.redirect("/dashboard");
    }
    
    // Check in Permission database for other users
    const userPermission = await Permission.findOne({ 
      email: email, 
      password: password,
      isTemplate: false 
    });
    
    if (userPermission) {
      // Set session for authenticated user
      req.session.isAuth = true;
      req.session.user = {
        email: email,
        role: userPermission.role
      };
      
      // Set access level based on role
      req.session.hasFullAccess = (userPermission.role === 'superadmin');
      
      console.log(`✅ ${userPermission.role} logged in:`, email);
      
      // All users go to dashboard regardless of role
      res.redirect("/dashboard");
    } else {
      console.log('❌ Invalid login attempt:', email);
      res.render("login", { title: "Login", error: "Invalid credentials! Please check your email and password." });
    }
  } catch (error) {
    console.error('🚨 Login error:', error);
    res.render("login", { title: "Login", error: "Login system error. Please try again." });
  }
});
const PORT = process.env.PORT || 5000;
const router = express.Router();

app.use(express.json()); 

// Body logging middleware (after JSON parsing)
app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('📋 Parsed Request Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

app.use("/api", router); 

app.use("/api/auth", signupRouter);
app.use("/api/user", userRouter);
app.use("/api/blog", blogRouter);
app.use("/api/otp", otpRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/addresses", addressesRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/themes", themesRouter);
app.use("/api/coupons", couponsRouter);
app.use("/api/roles", rolesRouter);
app.use(blogAdminRouter);

// Simple profile endpoints as backup
app.get("/api/profile", async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }
  
  try {
    const user = await profileuser.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    const { name, contactNumber, gender, birthday, alternateNumber, fullName } = user;
    res.json({ 
      success: true,
      user: { 
        name, 
        email: user.email, 
        contactNumber, 
        gender: gender || "", 
        birthday: birthday || "", 
        alternateNumber: alternateNumber || "",
        fullName: fullName || name || ""
      } 
    });
  } catch (error) {
    console.error("Profile GET error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.put("/api/profile", async (req, res) => {
  const { currentEmail, name, email, contactNumber, gender, birthday, alternateNumber } = req.body;
  
  if (!currentEmail) {
    return res.status(400).json({ success: false, message: "Current email is required" });
  }

  try {
    const user = await profileuser.findOne({ email: currentEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update user fields
    if (name) user.name = name;
    if (email && email !== currentEmail) {
      const existingUser = await profileuser.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: "Email already exists" });
      }
      user.email = email;
    }
    if (contactNumber) user.contactNumber = contactNumber;
    if (gender !== undefined) user.gender = gender;
    if (birthday !== undefined) user.birthday = birthday;
    if (alternateNumber !== undefined) user.alternateNumber = alternateNumber;

    await user.save();

    res.json({ 
      success: true, 
      message: "Profile updated successfully",
      user: {
        name: user.name,
        email: user.email,
        contactNumber: user.contactNumber,
        gender: user.gender,
        birthday: user.birthday,
        alternateNumber: user.alternateNumber
      }
    });

  } catch (error) {
    console.error("Profile PUT error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


app.post("/api/auth/login", async (req, res) => {
  const { emailOrNumber, password } = req.body;
  try {
    // Find user by email or contact number
    const user = await profileuser.findOne({
      $or: [
        { email: emailOrNumber },
        { contactNumber: emailOrNumber }
      ]
    });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    // Check password
    const bcrypt = await import('bcrypt');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Return user info (excluding password)
    const { name, contactNumber, email } = user;
    res.status(200).json({ message: "Login successful", user: { name, contactNumber, email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});








// Folder for uploaded avatars
const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "public/uploads/avatars");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: avatarStorage });
app.post("/update-profile", upload.single("avatar"), (req, res) => {
  // your code to handle profile update
});


// ========== Multer Storage Config ==========
// ✅ Coupon image storage setup

// Serve static files - both uploads directories
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/public/uploads", express.static(path.join(__dirname, "public/uploads")));

// ---------- Middlewares ----------

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// EJS admin offer management page (must be after view engine setup)
app.get('/admin/offers', (req, res) => {
  res.render('offer-admin');
});



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(compression());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());






// ---------- Fake Data ----------
const state = {
  stats: [
    { label: "Total Sales", value: "$84,230", delta: "+12.4%" },
    { label: "Orders", value: "1,298", delta: "+3.1%" },
    { label: "Customers", value: "5,431", delta: "+7.8%" },
    { label: "Refunds", value: "$1,245", delta: "-1.6%" },
  ],
  topProducts: [
    { id: 101, name: "Wireless Headphones", sku: "WH-1000", sales: 1234, revenue: 24560, imageUrl: "/images/headphone.jpg" },
    { id: 102, name: "Smart Watch", sku: "SW-900", sales: 987, revenue: 19740, imageUrl: "/images/watch.jpg" },
  ],
  recentOrders: [
    { id: "ORD-10021", customer: "Aarav Patel", total: 256.9, status: "Paid", date: "2025-08-18" },
    { id: "ORD-10020", customer: "Ishita Gupta", total: 98.5, status: "Shipped", date: "2025-08-18" },
  ],
};

// ✅ Categories Array
let categories = [
  { id: 1, name: "Electronics", imageUrl: "/images/machine.png" },
  { id: 2, name: "Fashion", imageUrl: "/images/fashion.png" },
  { id: 3, name: "Home & Kitchen", imageUrl: "/images/kitchen.png" },
];

// Extra Data
const weeklySales = 25678.5;
const weeklySalesChange = "+12.4%";
const bestSelling = [
  { name: "Wireless Headphones", sales: 1234, imageUrl: "/images/headphone.jpg" },
  { name: "Smart Watch", sales: 987, imageUrl: "/images/watch.jpg" },
];

// Customers
const customers = [
  { id: 1, name: "Aarav Patel", email: "aarav@example.com", phone: "+91-9876543210", orders: 5, status: "Active" },
  { id: 2, name: "Neha Sharma", email: "neha@example.com", phone: "+91-9123456780", orders: 2, status: "Inactive" },
];

// ---------- Auth Middleware ----------
function requireAuth(req, res, next) {
  if (req.session.isAuth) next();
  else res.redirect("/login");
}

// Permission checking middleware
function checkPermission(module, action) {
  return async (req, res, next) => {
    try {
      // Super admin has full access
      if (req.session?.user?.role === 'superadmin') {
        return next();
      }
      
      // superadmin@gmail.com has full access
      if (req.session?.hasFullAccess) {
        return next();
      }
      
      // Check permission for limited access users
      const userEmail = req.session?.user?.email;
      let userPermissions = await Permission.findOne({ userId: userEmail });
      
      // If no permissions found, create default ones
      if (!userPermissions) {
        userPermissions = new Permission({ userId: userEmail });
        await userPermissions.save();
      }
      
      // Check if user has permission for this module and action
      if (userPermissions.permissions[module] && userPermissions.permissions[module][action]) {
        return next();
      }
      
      // Permission denied
      return res.status(403).render("error", { 
        title: "Access Denied", 
        message: `You don't have permission to ${action} ${module}`,
        error: { status: 403 }
      });
      
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).render("error", { 
        title: "Error", 
        message: "Permission checking failed",
        error: { status: 500 }
      });
    }
  };
}

// Get user permissions for template rendering
async function getUserPermissions(userEmail, userRole, hasFullAccess) {
  console.log('🔍 Getting permissions for:', userEmail, 'Role:', userRole, 'HasFullAccess:', hasFullAccess);
  
  // Only superadmin has automatic full access
  if (userRole === 'superadmin') {
    console.log('✅ User has full access - returning all permissions');
    return {
      products: { view: true, create: true, edit: true, delete: true, export: true },
      categories: { view: true, create: true, edit: true, delete: true, export: true },
      attributes: { view: true, create: true, edit: true, delete: true, export: true },
      blogs: { view: true, create: true, edit: true, delete: true, export: true },
      orders: { view: true, create: true, edit: true, delete: true, export: true },
      transactions: { view: true, create: true, edit: true, delete: true, export: true },
      coupons: { view: true, create: true, edit: true, delete: true, export: true },
      customers: { view: true, create: true, edit: true, delete: true, export: true },
      team: { view: true, create: true, edit: true, delete: true, export: true },
      languages: { view: true, create: true, edit: true, delete: true, export: true },
      currencies: { view: true, create: true, edit: true, delete: true, export: true },
      invoice: { view: true, create: true, edit: true, delete: true, export: true },
      media: { view: true, create: true, edit: true, delete: true, export: true },
      reports: { view: true, create: true, edit: true, delete: true, export: true },
      themes: { view: true, create: true, edit: true, delete: true, export: true },
      roles: { view: true, create: true, edit: true, delete: true, export: true }
    };
  }
  
  // Get limited user permissions from database
  console.log('📊 Looking for permissions in database for email:', userEmail);
  try {
    let userPermissions = await Permission.findOne({ 
      email: userEmail, 
      isTemplate: false 
    });
    
    if (!userPermissions) {
      console.log('❌ No permissions found - creating default restricted permissions');
      userPermissions = new Permission({ 
        email: userEmail,
        role: userRole || 'admin',
        isTemplate: false
      });
      await userPermissions.save();
      console.log('💾 Created new permission record for:', userEmail);
    } else {
      console.log('✅ Found permissions in database for:', userEmail);
      console.log('📝 Permission details:', JSON.stringify(userPermissions.permissions, null, 2));
    }
    
    return userPermissions.permissions;
  } catch (error) {
    console.error('❌ Error fetching permissions for', userEmail, ':', error);
    // Return default restricted permissions in case of error
    return {
      products: { view: false, create: false, edit: false, delete: false, export: false },
      categories: { view: false, create: false, edit: false, delete: false, export: false },
      attributes: { view: false, create: false, edit: false, delete: false, export: false },
      blogs: { view: false, create: false, edit: false, delete: false, export: false },
      orders: { view: false, create: false, edit: false, delete: false, export: false },
      transactions: { view: false, create: false, edit: false, delete: false, export: false },
      coupons: { view: false, create: false, edit: false, delete: false, export: false },
      customers: { view: false, create: false, edit: false, delete: false, export: false },
      team: { view: false, create: false, edit: false, delete: false, export: false },
      languages: { view: false, create: false, edit: false, delete: false, export: false },
      currencies: { view: false, create: false, edit: false, delete: false, export: false },
      invoice: { view: false, create: false, edit: false, delete: false, export: false },
      media: { view: false, create: false, edit: false, delete: false, export: false },
      reports: { view: false, create: false, edit: false, delete: false, export: false },
      themes: { view: false, create: false, edit: false, delete: false, export: false },
      roles: { view: false, create: false, edit: false, delete: false, export: false }
    };
  }
}

// Middleware to add user permissions to all authenticated routes
async function addUserPermissions(req, res, next) {
  if (req.session.isAuth) {
    try {
      req.userPermissions = await getUserPermissions(
        req.session?.user?.email, 
        req.session?.user?.role, 
        req.session?.hasFullAccess
      );
      
      // Add user info to res.locals so it's available in all templates
      res.locals.userPermissions = req.userPermissions;
      res.locals.userRole = req.session?.user?.role;
      res.locals.userEmail = req.session?.user?.email;
      res.locals.hasFullAccess = req.session?.hasFullAccess;
    } catch (error) {
      console.error('Error getting user permissions:', error);
      req.userPermissions = {};
      res.locals.userPermissions = {};
    }
  }
  next();
}


// ---------- Routes ----------
app.get("/", (req, res) => res.redirect("/dashboard"));



// server.js

// Role middleware yahi likh do
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).send("Access Denied: Insufficient permissions");
    }
    next();
  };
};
// app.get("/superadmin", authorizeRoles("superadmin"), (req, res) => {
//   res.render("superadmin", { user: req.user });
// });

// app.get("/admin", authorizeRoles("admin", "superadmin"), (req, res) => {
//   res.render("admin", { user: req.user });
// });

// app.get("/editor", authorizeRoles("editor", "admin", "superadmin"), (req, res) => {
//   res.render("editor", { user: req.user });
// });

// Register GET
// app.get("/register", (req, res) => {
//   res.render("register", { error: null, title: "Register" });
// });

// // Register POST
// app.post("/register", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//       return res.render("register", { error: "All fields are required", title: "Register" });
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ email: email.trim() });
//     if (existingUser) {
//       return res.render("register", { error: "Email already registered", title: "Register" });
//     }

//     // Password hash
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Save new user
//     const newUser = new User({
//       name,
//       email: email.trim(),
//       password: hashedPassword
//     });
//     await newUser.save();

//     // Redirect to login after register
//     return res.redirect("/login");

//   } catch (err) {
//     console.error("Register Error:", err);
//     return res.render("register", { error: "Something went wrong", title: "Register" });
//   }
// });

// ================== Invoice Routes ==================
// Routes
// Create invoice page
app.get("/invoice", async (req, res) => {
  const userPermissions = await getUserPermissions(req.session.user.email);
  const userRole = req.session.user.email === 'superadmin@gmail.com' ? 'superadmin' : 'admin';
  const hasFullAccess = userRole === 'superadmin';
  res.render("invoice", { 
    title: "Create Invoice",
    userPermissions,
    userRole,
    hasFullAccess
  });
});

// Save invoice
app.post("/invoice", async (req, res) => {
  try {
    const data = req.body;

    // Parse products JSON if sent as string
    if (typeof data.products === "string") data.products = JSON.parse(data.products);

    const invoice = new Invoice({
      invoiceNumber: data.invoiceNumber,
      issueDate: data.issueDate,
      dueDate: data.dueDate,
      amount: data.amount,
      status: data.status,
      sender: data.sender,
      issueFrom: data.issueFrom,
      issueFor: data.issueFor,
      products: data.products,
      discount: data.discount,
      estimatedTax: data.estimatedTax,
      grandTotal: data.grandTotal
    });

    await invoice.save();
    res.redirect("/invoices"); // redirect to invoice list page
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});



   
//Login
app.get("/login", (req, res) => {
  res.render("login", { title: "Login", error: null });
});



// // Login GET
// app.get("/login", (req, res) => {
//   res.render("login", { title: "Login", error: null });
// });

// // Login POST
// app.post("/login", (req, res) => {
//   const { email, password } = req.body;

//   // Superadmin
//   if (email === "superadmin@example.com" && password === "1234") {
//     req.session.user = { email, role: "superadmin" };
//     return res.redirect("/superadmin");
//   }

//   // Admin
//   if (email === "admin@example.com" && password === "1234") {
//     req.session.user = { email, role: "admin" };
//     return res.redirect("/admin");
//   }

//   // Editor
//   if (email === "editor@example.com" && password === "1234") {
//     req.session.user = { email, role: "editor" };
//     return res.redirect("/editor");
//   }

//   // Invalid credentials
//   res.render("login", { title: "Login", error: "Invalid credentials!" });
// });



// Dashboard
app.get("/dashboard", requireAuth, async (req, res) => {
  try {
    // Get user permissions for sidebar
    const userPermissions = await getUserPermissions(req.session.user.email);
    const userRole = req.session.user.role;
    const hasFullAccess = req.session.hasFullAccess;
    
    console.log('🎛️ Dashboard - User:', req.session.user.email, 'Role:', userRole);
    console.log('🔑 User Permissions:', userPermissions);
    
    // Get dynamic dashboard data
    const dashboardData = await getDashboardData();
    res.render("dashboard", { 
      title: "Admin Dashboard",
      user: req.session.user, // Pass user session data
      userPermissions, // ✅ Pass permissions for sidebar
      userRole, // ✅ Pass role for sidebar
      hasFullAccess, // ✅ Pass access level for sidebar
      ...dashboardData
    });
  } catch (error) {
    console.error('❌ Dashboard error:', error);
    // Fallback to static data with permissions
    const userPermissions = await getUserPermissions(req.session.user.email);
    res.render("dashboard", { 
      state, 
      weeklySales, 
      weeklySalesChange, 
      bestSelling, 
      title: "Admin Dashboard",
      user: req.session.user, // Pass user session data in fallback too
      userPermissions, // ✅ Pass permissions for sidebar
      userRole: req.session.user.role, // ✅ Pass role for sidebar
      hasFullAccess: req.session.hasFullAccess // ✅ Pass access level for sidebar
    });
  }
});

// Dashboard API for dynamic data
app.get("/api/dashboard/stats", requireAuth, async (req, res) => {
  try {
    const data = await getDashboardData();
    res.json(data);
  } catch (error) {
    console.error('❌ Dashboard API error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Dashboard API for revenue chart data
app.get("/api/dashboard/revenue", requireAuth, async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 12;
    const revenueData = await getRevenueData(months);
    res.json(revenueData);
  } catch (error) {
    console.error('❌ Revenue API error:', error);
    res.status(500).json({ error: 'Failed to fetch revenue data' });
  }
});

// Dashboard API for overview cards - Real Data
app.get("/api/dashboard/overview", requireAuth, async (req, res) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get real orders from database
    const [todayOrders, yesterdayOrders, thisMonthOrders, lastMonthOrders, allTimeOrders] = await Promise.all([
      Order.find({ createdAt: { $gte: todayStart } }),
      Order.find({ 
        createdAt: { 
          $gte: yesterdayStart, 
          $lt: todayStart 
        } 
      }),
      Order.find({ createdAt: { $gte: thisMonthStart } }),
      Order.find({ 
        createdAt: { 
          $gte: lastMonthStart, 
          $lt: lastMonthEnd 
        } 
      }),
      Order.find({})
    ]);

    // Calculate totals and payment breakdowns
    const calculateTotals = (orders) => {
      const totals = { total: 0, cash: 0, card: 0, credit: 0 };
      orders.forEach(order => {
        const amount = order.total || 0;
        totals.total += amount;
        
        switch(order.paymentMethod) {
          case 'cash':
            totals.cash += amount;
            break;
          case 'card':
            totals.card += amount;
            break;
          case 'credit':
            totals.credit += amount;
            break;
          default:
            totals.cash += amount; // Default to cash
        }
      });
      return totals;
    };

    const overview = {
      today: calculateTotals(todayOrders),
      yesterday: calculateTotals(yesterdayOrders),
      thisMonth: thisMonthOrders.reduce((sum, order) => sum + (order.total || 0), 0),
      lastMonth: lastMonthOrders.reduce((sum, order) => sum + (order.total || 0), 0),
      allTime: allTimeOrders.reduce((sum, order) => sum + (order.total || 0), 0)
    };

    console.log('📊 Overview API - Real Data:', {
      today: overview.today.total,
      yesterday: overview.yesterday.total,
      ordersToday: todayOrders.length,
      ordersTotal: allTimeOrders.length
    });

    res.json(overview);
  } catch (error) {
    console.error('❌ Overview API error:', error);
    res.status(500).json({ error: 'Failed to fetch overview data' });
  }
});

// Dashboard API for KPI stats - Real Data  
app.get("/api/dashboard/stats", requireAuth, async (req, res) => {
  try {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get real data from database
    const [currentWeekOrders, lastWeekOrders, totalUsers, recentUsers] = await Promise.all([
      Order.find({ createdAt: { $gte: weekAgo } }),
      Order.find({ 
        createdAt: { 
          $gte: new Date(weekAgo.getTime() - 7 * 24 * 60 * 60 * 1000), 
          $lt: weekAgo 
        } 
      }),
      User.countDocuments({}),
      User.find({ createdAt: { $gte: monthAgo } })
    ]);

    // Calculate metrics
    const currentWeekRevenue = currentWeekOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const lastWeekRevenue = lastWeekOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    
    const revenueChange = lastWeekRevenue > 0 
      ? ((currentWeekRevenue - lastWeekRevenue) / lastWeekRevenue * 100).toFixed(1)
      : '0.0';
    
    const orderChange = lastWeekOrders.length > 0
      ? ((currentWeekOrders.length - lastWeekOrders.length) / lastWeekOrders.length * 100).toFixed(1)
      : '0.0';

    const userChange = '+15.2'; // Can be calculated based on your user growth data
    
    // Better conversion rate calculation
    // Note: For accurate conversion rate, you need website visitor tracking
    // This uses orders vs total users as a proxy metric
    const conversionRate = totalUsers > 0 
      ? ((currentWeekOrders.length / totalUsers) * 100).toFixed(1)
      : '0.0';
    
    // Alternative: If you have visitor data, use this instead:
    // const conversionRate = websiteVisitors > 0 
    //   ? ((currentWeekOrders.length / websiteVisitors) * 100).toFixed(1)
    //   : '0.0';

    const stats = [
      {
        label: 'Total Orders',
        value: currentWeekOrders.length,
        delta: `${orderChange >= 0 ? '+' : ''}${orderChange}%`,
        type: 'orders'
      },
      {
        label: 'Total Revenue', 
        value: currentWeekRevenue,
        delta: `${revenueChange >= 0 ? '+' : ''}${revenueChange}%`,
        type: 'revenue'
      },
      {
        label: 'Active Users',
        value: recentUsers.length,
        delta: `+${userChange}%`,
        type: 'users'
      },
      {
        label: 'Conversion Rate',
        value: `${conversionRate}%`,
        delta: '+0.8%',
        type: 'rate'
      }
    ];

    console.log('📈 KPI API - Real Data:', stats);
    res.json(stats);
  } catch (error) {
    console.error('❌ KPI API error:', error);
    res.status(500).json({ error: 'Failed to fetch KPI data' });
  }
});

// Dashboard API for top products - Real Data
app.get("/api/dashboard/top-products", requireAuth, async (req, res) => {
  try {
    // Get products with order data
    const products = await Product.find({}).limit(10).lean();
    
    const topProducts = await Promise.all(
      products.map(async (product) => {
        // Get orders for this product (you may need to adjust based on your order schema)
        const productOrders = await Order.find({ 
          'items.productId': product._id 
        }).lean();
        
        const sales = productOrders.length;
        const revenue = productOrders.reduce((sum, order) => {
          const item = order.items?.find(item => item.productId?.toString() === product._id.toString());
          return sum + (item ? (item.price * item.quantity) : 0);
        }, 0);

        return {
          name: product.title || product.name || 'Unknown Product',
          sku: product.sku || product._id.toString().slice(-6).toUpperCase(),
          sales: sales,
          revenue: revenue,
          performance: sales > 50 ? 'Excellent' : sales > 20 ? 'Good' : 'Average'
        };
      })
    );

    // Sort by revenue descending
    topProducts.sort((a, b) => b.revenue - a.revenue);

    console.log('🛍️ Top Products API - Real Data:', topProducts.length, 'products');
    res.json(topProducts);
  } catch (error) {
    console.error('❌ Top Products API error:', error);
    res.status(500).json({ error: 'Failed to fetch top products' });
  }
});

// Dashboard API for conversion funnel - Real Data
app.get("/api/dashboard/funnel", requireAuth, async (req, res) => {
  try {
    const funnelData = await getFunnelData();
    console.log('🎯 Funnel API - Real Data:', funnelData);
    res.json(funnelData);
  } catch (error) {
    console.error('❌ Funnel API error:', error);
    res.status(500).json({ error: 'Failed to fetch funnel data' });
  }
});

// Helper function to get dashboard data
async function getDashboardData() {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Try to get real data, fallback to dummy data
    let todayOrders = [], yesterdayOrders = [], thisMonthOrders = [], allTimeOrders = [];
    let topProducts = [];

    try {
      todayOrders = await Order.find({ createdAt: { $gte: todayStart } });
      yesterdayOrders = await Order.find({ createdAt: { $gte: yesterdayStart, $lt: todayStart } });
      thisMonthOrders = await Order.find({ createdAt: { $gte: thisMonthStart } });
      allTimeOrders = await Order.find({});
      topProducts = await getTopProducts();
    } catch (dbError) {
      console.log('📊 Using dummy data for dashboard (DB not available)');
      // Generate dummy data if database is not available
      topProducts = [
        { name: "Premium T-Shirt", sku: "TSH001", sales: 95, revenue: 28500 },
        { name: "Designer Jeans", sku: "JEA002", sales: 87, revenue: 52200 },
        { name: "Casual Sneakers", sku: "SNK003", sales: 76, revenue: 45600 },
        { name: "Summer Dress", sku: "DRS004", sales: 65, revenue: 32500 },
        { name: "Sports Jacket", sku: "JAC005", sales: 54, revenue: 37800 }
      ];
    }

    // Calculate totals
    const todayTotal = todayOrders.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
    const yesterdayTotal = yesterdayOrders.reduce((sum, order) => sum + (order.total || 0), 0) || 2592.40;
    const thisMonthTotal = thisMonthOrders.reduce((sum, order) => sum + (order.total || 0), 0) || 8880.72;
    const lastMonthTotal = 18545.78; // Dummy data
    const allTimeTotal = allTimeOrders.reduce((sum, order) => sum + (order.total || 0), 0) || 1035857.00;

    // Calculate payment method breakdowns
    const todayByPayment = calculatePaymentBreakdown(todayOrders);
    const yesterdayByPayment = { cash: 2592.40, card: 0, credit: 0 }; // Dummy data

    return {
      overview: {
        today: { total: todayTotal, ...todayByPayment },
        yesterday: { total: yesterdayTotal, ...yesterdayByPayment },
        thisMonth: thisMonthTotal,
        lastMonth: lastMonthTotal,
        allTime: allTimeTotal
      },
      stats: [
        { label: "Total Orders", value: allTimeOrders.length || 156, delta: "+5.1%" },
        { label: "Total Revenue", value: `₹${allTimeTotal.toLocaleString('en-IN')}`, delta: "+12.3%" },
        { label: "Active Users", value: 1247, delta: "+8.7%" },
        { label: "Conversion Rate", value: "3.2%", delta: "+0.8%" }
      ],
      topProducts
    };
  } catch (error) {
    console.error('Error in getDashboardData:', error);
    // Return dummy data as fallback
    return {
      overview: {
        today: { total: 0, cash: 0, card: 0, credit: 0 },
        yesterday: { total: 2592.40, cash: 2592.40, card: 0, credit: 0 },
        thisMonth: 8880.72,
        lastMonth: 18545.78,
        allTime: 1035857.00
      },
      stats: [
        { label: "Total Orders", value: 156, delta: "+5.1%" },
        { label: "Total Revenue", value: "₹10,35,857", delta: "+12.3%" },
        { label: "Active Users", value: 1247, delta: "+8.7%" },
        { label: "Conversion Rate", value: "3.2%", delta: "+0.8%" }
      ],
      topProducts: [
        { name: "Premium T-Shirt", sku: "TSH001", sales: 95, revenue: 28500 },
        { name: "Designer Jeans", sku: "JEA002", sales: 87, revenue: 52200 },
        { name: "Casual Sneakers", sku: "SNK003", sales: 76, revenue: 45600 },
        { name: "Summer Dress", sku: "DRS004", sales: 65, revenue: 32500 },
        { name: "Sports Jacket", sku: "JAC005", sales: 54, revenue: 37800 }
      ]
    };
  }
}

// Helper function to get top products
async function getTopProducts() {
  try {
    const products = await Product.find().limit(10).lean();
    return products.map(product => ({
      name: product.title || product.name || 'Unknown Product',
      sku: product.sku || product._id.toString().slice(-6),
      sales: Math.floor(Math.random() * 100) + 10, // Dummy sales data
      revenue: (product.price || 0) * (Math.floor(Math.random() * 100) + 10)
    }));
  } catch (error) {
    console.error('Error getting top products:', error);
    return [];
  }
}

// Helper function to calculate payment breakdown
function calculatePaymentBreakdown(orders) {
  const breakdown = { cash: 0, card: 0, credit: 0 };
  orders.forEach(order => {
    const method = order.paymentMethod || 'cash';
    const amount = order.total || 0;
    if (breakdown[method] !== undefined) {
      breakdown[method] += amount;
    } else {
      breakdown.cash += amount; // Default to cash
    }
  });
  return breakdown;
}

// Helper function to get revenue data for charts
async function getRevenueData(months = 12) {
  try {
    const dataPoints = [];
    const now = new Date();
    
    if (months === 1) {
      // For 1 month, show daily data for current month
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      
      for (let day = 1; day <= daysInMonth; day++) {
        const dayStart = new Date(now.getFullYear(), now.getMonth(), day);
        const dayEnd = new Date(now.getFullYear(), now.getMonth(), day + 1);
        
        let orders = [];
        try {
          orders = await Order.find({
            createdAt: { $gte: dayStart, $lt: dayEnd }
          });
        } catch (dbError) {
          console.log('📊 Using dummy daily revenue data for day:', day);
        }
        
        const revenue = orders.reduce((sum, order) => sum + (order.total || 0), 0) || 
                       (Math.random() * 5000 + 1000); // Daily dummy data between 1k-6k
        
        dataPoints.push({
          month: `Day ${day}`,
          revenue: Math.round(revenue),
          orders: orders.length || Math.floor(Math.random() * 10 + 1)
        });
      }
    } else {
      // For multiple months, show monthly data
      for (let i = months - 1; i >= 0; i--) {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
        
        let orders = [];
        try {
          orders = await Order.find({
            createdAt: { $gte: monthStart, $lte: monthEnd }
          });
        } catch (dbError) {
          console.log('📊 Using dummy revenue data for month:', monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
        }
        
        const revenue = orders.reduce((sum, order) => sum + (order.total || 0), 0) || 
                       (Math.random() * 50000 + 20000); // Monthly dummy data between 20k-70k
        
        dataPoints.push({
          month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          revenue: Math.round(revenue),
          orders: orders.length || Math.floor(Math.random() * 50 + 10)
        });
      }
    }
    
    return dataPoints;
  } catch (error) {
    console.error('Error in getRevenueData:', error);
    // Return dummy data as fallback
    const dataPoints = [];
    const now = new Date();
    
    if (months === 1) {
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        dataPoints.push({
          month: `Day ${day}`,
          revenue: Math.floor(Math.random() * 5000 + 1000),
          orders: Math.floor(Math.random() * 10 + 1)
        });
      }
    } else {
      for (let i = months - 1; i >= 0; i--) {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        dataPoints.push({
          month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          revenue: Math.floor(Math.random() * 50000 + 20000),
          orders: Math.floor(Math.random() * 50 + 10)
        });
      }
    }
    
    return dataPoints;
  }
}

// Helper function to get funnel data
async function getFunnelData() {
  try {
    let totalUsers = 0;
    let totalOrders = 0;
    let totalRevenue = 0;
    
    try {
      totalUsers = await profileuser.countDocuments();
      totalOrders = await Order.countDocuments();
      const revenueData = await Order.aggregate([
        { $group: { _id: null, total: { $sum: "$total" } } }
      ]);
      totalRevenue = revenueData[0]?.total || 0;
    } catch (dbError) {
      console.log('📊 Using dummy funnel data');
      // Generate realistic dummy data with clear differences
      totalUsers = Math.floor(Math.random() * 300 + 150);     // 150-450 users
      totalOrders = Math.floor(Math.random() * 80 + 40);      // 40-120 orders  
      totalRevenue = Math.floor(Math.random() * 75000 + 25000); // 25k-100k revenue
    }
    
    return {
      visitors: totalUsers + Math.floor(Math.random() * 800 + 500), // Much higher visitors (500-1300 more)
      users: totalUsers,
      orders: totalOrders,
      revenue: totalRevenue
    };
  } catch (error) {
    console.error('Error in getFunnelData:', error);
    // Return dummy data as fallback with clear differences
    const totalUsers = Math.floor(Math.random() * 300 + 150);     // 150-450 users
    const totalOrders = Math.floor(Math.random() * 80 + 40);      // 40-120 orders
    const visitors = totalUsers + Math.floor(Math.random() * 800 + 500); // Much higher visitors
    
    return {
      visitors: visitors,
      users: totalUsers,
      orders: totalOrders,
      revenue: Math.floor(Math.random() * 75000 + 25000) // 25k-100k revenue
    };
  }
}

// Theme Manager
app.get("/theme-manager", requireAuth, async (req, res) => {
  const userPermissions = await getUserPermissions(req.session.user.email);
  const userRole = req.session.user.email === 'superadmin@gmail.com' ? 'superadmin' : 'admin';
  const hasFullAccess = userRole === 'superadmin';
  res.render("theme-manager", { 
    title: "Theme Manager",
    userPermissions,
    userRole,
    hasFullAccess
  });
});

// Role Management
app.get("/role-management", requireAuth, async (req, res) => {
  try {
    console.log('🎭 Role Management route accessed by:', req.session.user?.email);
    console.log('📧 Session user object:', req.session.user);
    console.log('🔑 Session data:', req.session);
    
    const userPermissions = await getUserPermissions(req.session.user.email);
    const userRole = req.session.user.email === 'superadmin@gmail.com' ? 'superadmin' : 'admin';
    const hasFullAccess = userRole === 'superadmin';
    
    console.log('User role:', userRole, 'Has full access:', hasFullAccess);
    
    // Only superadmin can access role management
    if (!hasFullAccess) {
      console.log('Access denied - redirecting to dashboard');
      return res.redirect("/dashboard");
    }
    
    // Get all existing roles from Permission collection
    const existingRoles = await Permission.distinct('role');
    console.log('Existing roles:', existingRoles);
    
    // Get all users with their roles (only entries with email addresses)
    const usersWithRoles = await Permission.find({ 
      isTemplate: { $ne: true },
      email: { $exists: true, $ne: null, $ne: '' }
    }).lean();
    console.log('Raw users with roles from DB:', usersWithRoles);
    
    // Add manual entries for known users
    const allUsers = [...usersWithRoles];
    
    // Always ensure superadmin entry exists
    const superadminExists = usersWithRoles.find(user => user.email === 'superadmin@gmail.com');
    if (!superadminExists) {
      allUsers.push({
        email: 'superadmin@gmail.com',
        role: 'superadmin',
        password: 'admin', // Set actual password
        createdAt: new Date('2025-10-07'),
        permissions: ['all']
      });
    }
    
    // Always ensure admin entry exists
    const adminExists = usersWithRoles.find(user => user.email === 'admin@gmail.com');
    if (!adminExists) {
      allUsers.push({
        email: 'admin@gmail.com',
        role: 'admin',
        password: 'admin', // Set actual password
        createdAt: new Date('2025-10-06'),
        permissions: ['limited']
      });
    }
    
    // Also add current session user if different from above
    if (req.session.user?.email && 
        req.session.user.email !== 'superadmin@gmail.com' && 
        req.session.user.email !== 'admin@gmail.com') {
      const currentUserExists = usersWithRoles.find(user => user.email === req.session.user.email);
      if (!currentUserExists) {
        allUsers.push({
          email: req.session.user.email,
          role: 'admin',
          createdAt: new Date('2025-10-06'),
          permissions: ['limited']
        });
      }
    }
    
    console.log('Final users list:', allUsers);
    
    res.render("role-management-fixed", { 
      title: "Role Management",
      userPermissions,
      userRole,
      hasFullAccess,
      existingRoles: existingRoles || [],
      usersWithRoles: allUsers || []
    });
  } catch (error) {
    console.error('❌ Error loading role management:', error);
    res.status(500).send('Error loading role management: ' + error.message);
  }
});

// API to create new role
app.post("/api/roles/create", requireAuth, async (req, res) => {
  try {
    const userRole = req.session.user.email === 'superadmin@gmail.com' ? 'superadmin' : 'admin';
    
    // Only superadmin can create roles
    if (userRole !== 'superadmin') {
      return res.status(403).json({ error: 'Access denied. Only superadmin can create roles.' });
    }
    
    const { roleName, permissions } = req.body;
    
    if (!roleName || !permissions) {
      return res.status(400).json({ error: 'Role name and permissions are required' });
    }
    
    // Check if role already exists
    const existingRole = await Permission.findOne({ role: roleName, isTemplate: true });
    if (existingRole) {
      return res.status(400).json({ error: 'Role already exists' });
    }
    
    // Create new role template (without email, just for permissions storage)
    const newRole = new Permission({
      role: roleName,
      permissions: permissions,
      createdBy: req.session.user.email,
      isTemplate: true // Mark as role template
    });
    
    await newRole.save();
    
    res.json({ 
      success: true, 
      message: `Role '${roleName}' created successfully`,
      role: newRole
    });
    
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ error: 'Failed to create role' });
  }
});

// API to assign role to user
app.post("/api/roles/assign", requireAuth, async (req, res) => {
  try {
    console.log('🎯 Role assignment request received');
    console.log('Session user:', req.session.user?.email);
    console.log('Request body:', req.body);
    
    const userRole = req.session.user.email === 'superadmin@gmail.com' ? 'superadmin' : 'admin';
    console.log('User role:', userRole);
    
    if (userRole !== 'superadmin') {
      console.log('❌ Access denied - not superadmin');
      return res.status(403).json({ error: 'Access denied. Only superadmin can assign roles.' });
    }
    
    const { userEmail, userPassword, roleName } = req.body;
    console.log('Assigning role:', roleName, 'to email:', userEmail);
    
    if (!userEmail || !roleName) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ error: 'User email and role name are required' });
    }
    
    // Get role template
    const roleTemplate = await Permission.findOne({ role: roleName, isTemplate: true });
    console.log('Role template found:', roleTemplate ? 'Yes' : 'No');
    
    if (!roleTemplate) {
      console.log('❌ Role template not found for role:', roleName);
      return res.status(400).json({ error: 'Role template not found' });
    }
    
    // Check if user already has permissions (by email, not userId)
    const existingPermission = await Permission.findOne({ email: userEmail });
    console.log('Existing permission found:', existingPermission ? 'Yes' : 'No');
    
    if (existingPermission && !existingPermission.isTemplate) {
      // Update existing permissions
      existingPermission.role = roleName;
      existingPermission.permissions = roleTemplate.permissions;
      if (userPassword) {
        existingPermission.password = userPassword; // Store password if provided
      }
      await existingPermission.save();
      console.log('✅ Updated existing permission');
    } else {
      // Create new permission for user (without userId to avoid duplicate key error)
      const newPermission = new Permission({
        email: userEmail,
        role: roleName,
        permissions: roleTemplate.permissions,
        password: userPassword || 'defaultPassword123',
        assignedBy: req.session.user.email,
        isTemplate: false
      });
      
      try {
        await newPermission.save();
        console.log('✅ Created new permission');
      } catch (saveError) {
        console.error('❌ Error saving new permission:', saveError);
        if (saveError.code === 11000) {
          // Handle duplicate key error by updating instead
          const updateResult = await Permission.findOneAndUpdate(
            { email: userEmail },
            {
              role: roleName,
              permissions: roleTemplate.permissions,
              password: userPassword || 'defaultPassword123',
              assignedBy: req.session.user.email,
              isTemplate: false
            },
            { upsert: true, new: true }
          );
          console.log('✅ Updated existing user via upsert');
        } else {
          throw saveError;
        }
      }
    }
    
    console.log('✅ Role assignment successful');
    res.json({ 
      success: true, 
      message: `Role '${roleName}' assigned to ${userEmail} successfully`
    });
    
  } catch (error) {
    console.error('❌ Error assigning role:', error);
    res.status(500).json({ error: 'Failed to assign role: ' + error.message });
  }
});

// API to get all roles
app.get("/api/roles", requireAuth, async (req, res) => {
  try {
    const userRole = req.session.user.email === 'superadmin@gmail.com' ? 'superadmin' : 'admin';
    
    if (userRole !== 'superadmin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const roles = await Permission.find({ isTemplate: true }).lean();
    const userRoles = await Permission.find({ isTemplate: { $ne: true } }).lean();
    
    res.json({ 
      roleTemplates: roles,
      userRoles: userRoles
    });
    
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
});

// Roles Management (Legacy route - redirect to new route)
app.get("/roles", requireAuth, (req, res) => {
  res.redirect("/role-management");
});

// Admin Panel Route
app.get("/admin", requireAuth, async (req, res) => {
  try {
    // Fetch statistics for the admin dashboard
    const totalUsers = await profileuser.countDocuments();
    // Since Admin model is not defined, skip this for now
    const totalAdmins = 1; // Default value
    // For active sessions, we'll use a simple count since session tracking isn't implemented
    const activeSessions = req.sessionStore ? Object.keys(req.sessionStore.sessions || {}).length : 0;
    
    const stats = {
      totalUsers,
      totalAdmins,
      activeSessions
    };
    
    // Get user permissions for menu rendering
    const userEmail = req.session?.user?.email || 'unknown';
    const userRole = req.session?.user?.role || 'guest';
    const hasFullAccess = userRole === 'superadmin';
    
    console.log('🎯 Admin route - Debug Session Values:');
    console.log('  userEmail:', userEmail);
    console.log('  userRole:', userRole);
    console.log('  hasFullAccess:', hasFullAccess);
    
    const userPermissions = await getUserPermissions(userEmail, userRole, hasFullAccess);
    
    console.log('🎯 Admin route - userPermissions being passed to template:', JSON.stringify(userPermissions, null, 2));
    
    res.render("admin", { 
      title: "Admin Panel",
      stats,
      userPermissions,
      userRole: userRole,
      userEmail: userEmail,
      hasFullAccess: hasFullAccess
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    // Still try to get permissions even if stats fail
    let userPermissions = {};
    try {
      userPermissions = await getUserPermissions(
        req.session.userEmail, 
        req.session.userRole, 
        req.session.hasFullAccess
      );
      console.log('🎯 Admin route ERROR case - userPermissions:', JSON.stringify(userPermissions, null, 2));
    } catch (permError) {
      console.error('Error getting permissions in error case:', permError);
    }
    
    // Provide default stats in case of error
    const stats = {
      totalUsers: 0,
      totalAdmins: 0,
      activeSessions: 0
    };
    
    res.render("admin", { 
      title: "Admin Panel",
      stats,
      userPermissions,
      userRole: req.session.userRole,
      userEmail: req.session.userEmail,
      hasFullAccess: req.session.hasFullAccess
    });
  }
});


// My Account route - Dynamic based on logged in user
app.get("/my-account", requireAuth, async (req, res) => {
  try {
    const userEmail = req.session?.user?.email;
    const userRole = req.session?.user?.role;
    const userName = req.session?.user?.name;
    
    let user = {};
    
    if (userEmail === 'superadmin@gmail.com') {
      // Superadmin user
      user = {
        name: "Super Admin",
        email: userEmail,
        role: "superadmin"
      };
    } else {
      // Get user data from permissions collection
      const userData = await Permission.findOne({ userId: userEmail });
      
      if (userData) {
        user = {
          name: userData.name,
          email: userData.userId,
          role: userData.role
        };
      } else {
        // Fallback if user not found
        user = {
          name: userName || "Unknown User",
          email: userEmail || "unknown@example.com",
          role: userRole || "guest"
        };
      }
    }
    
    console.log('👤 My Account - User data:', user);
    
    res.render("my-account", { 
      title: "My Account",  
      user 
    });
  } catch (error) {
    console.error('❌ Error loading my account:', error);
    
    // Fallback user data
    const user = {
      name: req.session?.user?.name || "Unknown User",
      email: req.session?.user?.email || "unknown@example.com",
      role: req.session?.user?.role || "guest"
    };
    
    res.render("my-account", { 
      title: "My Account",  
      user 
    });
  }
});
// Update profile route removed - profile is now read-only


// // 404 Page handler
// app.use((req, res) => {
//   res.status(404).render("404");
// });

// Get all orders (show in orders.ejs)
app.get("/orders", requireAuth, checkPermission('orders', 'view'), async (req, res) => {
  const orders = await Order.find().sort({ date: -1 });
  const userPermissions = await getUserPermissions(req.session.user.email);
  const userRole = req.session.user.email === 'superadmin@gmail.com' ? 'superadmin' : 'admin';
  const hasFullAccess = userRole === 'superadmin';
  res.render("orders", { title: "Orders Page", orders, userPermissions, userRole, hasFullAccess });
});

// Save new order
app.post("/orders", async (req, res) => {
  try {
    const { name, email, products } = req.body;

    const total = products.reduce((sum, p) => sum + p.quantity * 50, 0); // Example: 50 per item

    const newOrder = new Order({
      name,
      email,
      products,
      total,
      status: "Pending"
    });

    const savedOrder = await newOrder.save();
    res.json(savedOrder); // yaha JSON return karo
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error saving order" });
  }
});



// // Login or Signup route
// router.post("/login", async (req, res) => {
//   try {
//     const { name, phone } = req.body;

//     if (!name || !phone) {
//       return res.json({ success: false, message: "Name & Phone required" });
//     }

//     // Check if user already exists
//     let user = await User.findOne({ phone });

//     if (!user) {
//       // New user create
//       user = new User({ name, phone });
//       await user.save();
//     }

//     res.json({ success: true, user });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });




// // Signup (save to DB)
// app.post("/signup", async (req, res) => {
//   try {
//     const { name, phone, email, password } = req.body;

//     // Check if user exists
//     const existing = await User.findOne({ email });
//     if (existing) return res.status(400).json({ message: "User already exists" });

//     const user = new User({ name, phone, email, password });
//     await user.save();

//     res.status(201).json({ message: "User created", user });
//   } catch (err) {
//     res.status(500).json({ message: "Error signing up", error: err.message });
//   }
// });

// // Login (check credentials)
// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email, password }); // (NOTE: Use bcrypt in real apps)
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     res.json({ message: "Login successful", user });
//   } catch (err) {
//     res.status(500).json({ message: "Error logging in", error: err.message });
//   }
// });


//   cart data save karne ke liye

// app.use("/api/cart", cartRoutes);

// app.post("/api/cart", async (req, res) => {
//   console.log("Incoming cart data:", req.body); // check what frontend is sending
//   try {
//     const newCart = new Cart(req.body);
//     await newCart.save();
//     console.log("Saved cart:", newCart);
//     res.status(201).json({ message: "Cart saved successfully" });
//   } catch (err) {
//     console.error("Cart save error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });


// // Home redirect
// app.get("/", (req, res) => {
//   res.redirect("/orders");
// });

// ✅ GET products page with data
// ✅ Products Page
// ---------------- MULTER SETUP ----------------
// dynamic storage (category-wise folder)
const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Debug multer destination
    console.log('🔧 MULTER DEBUG - req.body:', req.body);
    console.log('🔧 MULTER DEBUG - req.body.category:', req.body.category);
    
    const category = req.body.category || "general"; // fallback
    const uploadDir = path.join(__dirname, "public/uploads", category);
    
    console.log('🔧 MULTER DEBUG - uploadDir:', uploadDir);

    if (!fs.existsSync(uploadDir)) {
      console.log('🔧 MULTER DEBUG - Creating directory:', uploadDir);
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + "-" + file.originalname;
    console.log('🔧 MULTER DEBUG - Generated filename:', filename);
    cb(null, filename);
  },
});

const uploadProduct = multer({
  storage: productStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max for any file
});











// ---------------- ROUTES ----------------



// API: Get product by ID (for React ProductDetail)
app.get("/api/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product" });
  }
});

// API: Get products by category
app.get("/api/products/:category", async (req, res) => {
  try {
    const catName = req.params.category;
    const products = await Product.find({ category: catName });

    const formattedProducts = products.map((p) => ({
      _id: p._id,
      name: p.name,
      sku: p.sku,
      category: p.category,
      subcategory: p.subcategory,
      price: p.price,
      stock: p.stock,
      status: p.status,
      gender: p.gender,
      brand: p.brand,
      size: p.size,
      color: p.color,
      material: p.material,
      description: p.description,
      imageUrl: p.imageUrl || null,
    }));

    res.json(formattedProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching products" });
  }
});

// Render products page (EJS)
app.get("/products", requireAuth, checkPermission('products', 'view'), async (req, res) => {
  try {
    const categories = await Category.find();
    const products = await Product.find();
    
    // Debug logging
    console.log("🔍 Backend Products Debug:");
    console.log(`Total products: ${products.length}`);
    products.forEach((product, index) => {
      if (index < 3) { // Log first 3 products
        console.log(`Product ${index + 1}:`);
        console.log(`  Name: ${product.name}`);
        console.log(`  ImageUrl: ${product.imageUrl}`);
        console.log(`  Images: ${product.images ? JSON.stringify(product.images) : 'undefined'}`);
      }
    });
    
    res.render("products", {
      title: "Products",
      categories,
      products,
       filterConfig,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching products");
  }
});

// Add new product with proper category handling
app.post("/products", (req, res) => {
  // Use a temporary storage first, then move files to correct category folder
  const tempUpload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        const tempDir = path.join(__dirname, "public/uploads/temp");
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true });
        }
        cb(null, tempDir);
      },
      filename: function (req, file, cb) {
        const filename = Date.now() + "-" + Math.random().toString(36).substring(7) + "-" + file.originalname;
        cb(null, filename);
      },
    }),
    limits: { fileSize: 2 * 1024 * 1024 },
  }).fields([
    { name: "imageFiles", maxCount: 4 },
    { name: "videoFile", maxCount: 1 },
  ]);

  tempUpload(req, res, async function (err) {
    if (err) {
      console.error('❌ Upload error:', err);
      return res.status(500).send('Upload failed');
    }

    try {
      console.log('\n🔍 === PRODUCT ADD DEBUG ===');
      console.log('📋 req.body:', req.body);
      console.log('📁 req.files:', req.files);
      
      const category = req.body.category || "general";
      console.log('📂 Category from form:', category);
      
      // Create category directory
      const categoryDir = path.join(__dirname, "public/uploads", category);
      if (!fs.existsSync(categoryDir)) {
        console.log('📁 Creating category directory:', categoryDir);
        fs.mkdirSync(categoryDir, { recursive: true });
      }
      
      // Process image files
      let images = [];
      if (req.files && req.files.imageFiles) {
        console.log('📸 Found imageFiles:', req.files.imageFiles.length);
        
        for (let file of req.files.imageFiles) {
          // Generate unique filename to prevent conflicts
          const newFilename = Date.now() + "-" + Math.random().toString(36).substring(7) + "-" + file.originalname;
          const tempPath = file.path;
          const finalPath = path.join(categoryDir, newFilename);
          
          console.log('🔄 Moving file from:', tempPath);
          console.log('🔄 Moving file to:', finalPath);
          
          // Move file from temp to category directory
          fs.renameSync(tempPath, finalPath);
          
          const imagePath = `/uploads/${category}/${newFilename}`;
          images.push(imagePath);
          console.log('✅ Created image path:', imagePath);
        }
      } else {
        console.log('❌ No imageFiles found in req.files');
      }
      
      // Process video file
      let video = "";
      if (req.files && req.files.videoFile && req.files.videoFile[0]) {
        const file = req.files.videoFile[0];
        const newFilename = Date.now() + "-" + Math.random().toString(36).substring(7) + "-" + file.originalname;
        const tempPath = file.path;
        const finalPath = path.join(categoryDir, newFilename);
        
        fs.renameSync(tempPath, finalPath);
        video = `/uploads/${category}/${newFilename}`;
        console.log('🎥 Created video path:', video);
      }

      const product = new Product({
        name: req.body.name,
        sku: req.body.sku,
        category: category,
        subcategory: req.body.subcategory,
        price: req.body.price,
        stock: req.body.stock,
        gender: req.body.gender,
        brand: req.body.brand,
        size: req.body.size,
        color: req.body.color,
        material: req.body.material,
        description: req.body.description,
        status: req.body.status,
        images: images,
        video: video,
        imageUrl: images[0] || "", // for backward compatibility
      });
      
      console.log('💾 Final product imageUrl:', product.imageUrl);
      console.log('📊 Final product images:', product.images);
      console.log('🔗 Unique product identifier:', product._id);

      await product.save();
      
      // Clean up temp directory
      const tempDir = path.join(__dirname, "public/uploads/temp");
      if (fs.existsSync(tempDir)) {
        const tempFiles = fs.readdirSync(tempDir);
        tempFiles.forEach(file => {
          const filePath = path.join(tempDir, file);
          if (fs.statSync(filePath).isFile()) {
            fs.unlinkSync(filePath);
          }
        });
      }
      
      console.log('✅ Product saved successfully!');
      res.redirect("/products");
    } catch (err) {
      console.error("❌ Error saving product:", err);
      console.error("❌ Error details:", {
        message: err.message,
        code: err.code,
        name: err.name
      });
      
      // Clean up any uploaded files if there was an error
      try {
        const tempDir = path.join(__dirname, "public/uploads/temp");
        if (fs.existsSync(tempDir)) {
          const tempFiles = fs.readdirSync(tempDir);
          tempFiles.forEach(file => {
            const filePath = path.join(tempDir, file);
            if (fs.statSync(filePath).isFile()) {
              fs.unlinkSync(filePath);
            }
          });
        }
      } catch (cleanupErr) {
        console.error("❌ Error cleaning up temp files:", cleanupErr);
      }
      
      // Handle specific MongoDB errors
      if (err.code === 11000) {
        // Duplicate key error
        const duplicateField = Object.keys(err.keyValue)[0];
        const duplicateValue = err.keyValue[duplicateField];
        
        // Redirect back to products with error message
        return res.redirect("/products?error=duplicate&name=" + encodeURIComponent(duplicateValue));
      }
      
      // For other errors, redirect with generic error
      res.redirect("/products?error=general");
    }
  });
});


// Edit product page
app.get("/products/edit/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    const categories = await Category.find().lean();
    if (!product) return res.redirect("/products");

    res.render("editProduct", { title: "Edit Product", product, categories });
  } catch (err) {
    console.error(err);
    res.redirect("/products");
  }
});

// Update product
app.post("/products/edit/:id", uploadProduct.single("imageFile"), async (req, res) => {
  try {
    const category = req.body.category || "general";

    let updateData = {
      name: req.body.name,
      sku: req.body.sku,
      category,
      subcategory,
      price: req.body.price,
      stock: req.body.stock,
      status: req.body.status,
      description: req.body.description,
      gender: req.body.gender,
      brand: req.body.brand,
      size: req.body.size,
      color: req.body.color,
      material: req.body.material,
    };

    if (req.file) {
      updateData.imageUrl = `/uploads/${category}/${req.file.filename}`;
    }

    await Product.findByIdAndUpdate(req.params.id, updateData);
    res.redirect("/products");
  } catch (err) {
    console.error(err);
    res.redirect("/products");
  }
});

// Delete product
app.post("/products/delete/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/products");
  } catch (err) {
    console.error(err);
    res.redirect("/products");
  }
});

// Filter products by category (EJS)
app.get("/products/category/:catName", async (req, res) => {
  try {
    const categories = await Category.find();
    const products = await Product.find({ category: req.params.catName });
    res.render("products", {
      title: req.params.catName + " Products",
      categories,
      products,
    });
  } catch (error) {
    res.status(500).send("Error filtering products");
  }
});

// Category Routes

// ---------- Multer Setup (for category images) ----------
// ---------- Upload Folder Setup ----------
const categoryStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "public/uploads/categories");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const uploadCategory = multer({ storage: categoryStorage });

// ---------- Category Routes ----------

// GET all categories
// ✅ API route for frontend (React)
// Admin Panel ke liye (EJS render)
// React frontend ke liye (JSON API)
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await Category.find().lean();
    res.json(categories);   // sirf JSON bhejna
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: "Error fetching categories" });
  }
});

// ================== FilterConfig API Route ==================
app.get("/api/filterconfig", (req, res) => {
  try {
    const { category } = req.query;
    
    if (category) {
      // Get filter options for specific category
      const categoryOptions = filterConfig.getFilterOptions(category);
      res.json({
        success: true,
        category: category,
        filters: categoryOptions
      });
    } else {
      // Get all filter configurations
      res.json({
        success: true,
        categories: filterConfig.getAllCategories(),
        allFilters: filterConfig.filterConfig
      });
    }
  } catch (err) {
    console.error("Error fetching filter config:", err);
    res.status(500).json({ 
      success: false,
      error: "Error fetching filter configuration" 
    });
  }
});

// ================== Search API Route ==================
app.get("/api/search", async (req, res) => {
  try {
    const query = req.query.q;
    if (!query || query.trim().length === 0) {
      return res.json([]);
    }

    const searchTerm = query.trim().toLowerCase();
    const results = [];

    // Popular search suggestions based on common queries
    const popularSuggestions = [
      { name: 'Mens Shirt', type: 'category', route: '/categories/Clothing', description: 'Browse mens shirts and tops' },
      { name: 'Mens Jeans', type: 'category', route: '/categories/Clothing', description: 'Stylish jeans for men' },
      { name: 'Womens Dress', type: 'category', route: '/categories/Clothing', description: 'Beautiful dresses for women' },
      { name: 'Mens Shoes', type: 'category', route: '/categories/Footwear', description: 'Comfortable shoes for men' },
      { name: 'Womens Shoes', type: 'category', route: '/categories/Footwear', description: 'Trendy footwear for women' },
      { name: 'T-Shirt', type: 'category', route: '/categories/Clothing', description: 'Casual t-shirts for all' },
      { name: 'Jacket', type: 'category', route: '/categories/Clothing', description: 'Stylish jackets and outerwear' },
      { name: 'Sneakers', type: 'category', route: '/categories/Footwear', description: 'Comfortable sneakers' },
      { name: 'Handbag', type: 'category', route: '/categories/Bags', description: 'Fashionable handbags' },
      { name: 'Skincare', type: 'category', route: '/categories/Cosmetic', description: 'Beauty and skincare products' }
    ];

    // Add popular suggestions that match the search term
    popularSuggestions.forEach(suggestion => {
      if (suggestion.name.toLowerCase().includes(searchTerm)) {
        results.push({
          _id: suggestion.route,
          name: suggestion.name,
          title: suggestion.name,
          type: suggestion.type,
          route: suggestion.route,
          description: suggestion.description
        });
      }
    });

    // Search in Categories
    try {
      const categories = await Category.find({
        name: { $regex: searchTerm, $options: "i" }
      }).limit(3);
      categories.forEach(cat => {
        results.push({
          _id: cat._id,
          name: cat.name,
          title: cat.name,
          type: 'category',
          route: `/categories/${encodeURIComponent(cat.name)}`,
          description: `Browse ${cat.name} products`
        });
      });
    } catch (err) {
      console.error("Error searching categories:", err);
    }

    // Search in Products
    try {
      const products = await Product.find({
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } },
          { category: { $regex: searchTerm, $options: "i" } },
          { brand: { $regex: searchTerm, $options: "i" } }
        ]
      }).limit(5);
      products.forEach(product => {
        results.push({
          _id: product._id,
          name: product.name,
          title: product.name,
          type: 'product',
          description: product.description || `${product.category} - ₹${product.price}`,
          price: product.price,
          category: product.category
        });
      });
    } catch (err) {
      console.error("Error searching products:", err);
    }

    // Search in Blog Articles
    try {
      const blogs = await BlogModel.find({
        $or: [
          { title: { $regex: searchTerm, $options: "i" } },
          { content: { $regex: searchTerm, $options: "i" } },
          { categories: { $in: [new RegExp(searchTerm, 'i')] } }
        ]
      }).limit(3);
      blogs.forEach(blog => {
        results.push({
          _id: blog._id,
          title: blog.title,
          type: 'blog',
          description: blog.content ? blog.content.substring(0, 100) + '...' : 'Blog article'
        });
      });
    } catch (err) {
      console.error("Error searching blogs:", err);
    }

    // Add static page suggestions
    const staticPages = [
      { name: 'Home', route: '/', type: 'page', description: 'Go to homepage' },
      { name: 'About Us', route: '/about', type: 'page', description: 'Learn about us' },
      { name: 'Contact', route: '/contact', type: 'page', description: 'Get in touch' },
      { name: 'FAQ', route: '/faq', type: 'page', description: 'Frequently asked questions' },
      { name: 'Blog', route: '/blog', type: 'page', description: 'Read our blog posts' }
    ];

    staticPages.forEach(page => {
      if (page.name.toLowerCase().includes(searchTerm)) {
        results.push({
          _id: page.route,
          name: page.name,
          title: page.name,
          type: page.type,
          route: page.route,
          description: page.description
        });
      }
    });

    // Remove duplicates and limit total results to 8
    const uniqueResults = results.filter((item, index, self) => 
      index === self.findIndex(t => t._id === item._id && t.type === item.type)
    );

    res.json(uniqueResults.slice(0, 8));
  } catch (error) {
    console.error("Search API Error:", error);
    res.status(500).json({ error: "Search failed" });
  }
});

app.get("/category", requireAuth, checkPermission('categories', 'view'), async (req, res) => {
  try {
    const categories = await Category.find().lean();
    const userPermissions = await getUserPermissions(req.session.user.email);
    const userRole = req.session.user.email === 'superadmin@gmail.com' ? 'superadmin' : 'admin';
    const hasFullAccess = userRole === 'superadmin';
    res.render("category", {
      title: "Categories",
      categories,
      userPermissions,
      userRole,
      hasFullAccess
    });
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).send("Error fetching categories");
  }
});

app.post("/category", uploadCategory.single("imageFile"), async (req, res) => {
  try {
    const { name } = req.body;
    const imageUrl = req.file ? `/uploads/categories/${req.file.filename}` : "";
    const newCategory = new Category({ name, imageUrl });
    await newCategory.save();
    res.redirect("/category");
  } catch (err) {
    console.error("Error saving category:", err.message);
    res.status(500).send("Error saving category");
  }
});

app.get("/category/delete/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.redirect("/category");
  } catch (err) {
    console.error("Error deleting category:", err.message);
    res.status(500).send("Error deleting category");
  }
});

// =================== Super Admin Panel Routes ===================
// Routes (same as before)
app.get("/superadmin", requireAuth, async (req, res) => {
  // Check if user has superadmin access (only superadmin@gmail.com)
  if (req.session?.user?.email !== 'superadmin@gmail.com') {
    return res.status(403).render("error", { 
      title: "Access Denied", 
      message: "You don't have permission to access the Super Admin panel",
      error: { status: 403 }
    });
  }
  
  try {
    const accounts = await Account.find().lean();
    
    // Get all existing roles from Permission collection (actual users, not templates)
    const existingRoles = await Permission.distinct('role', { isTemplate: false });
    console.log('Available roles for superadmin:', existingRoles);
    
    // Get URL parameter for pre-selected role
    const preSelectedRole = req.query.role || null;
    console.log('Pre-selected role from URL:', preSelectedRole);

    // Example stats
    const stats = {
      totalUsers: accounts.length,
      totalAdmins: accounts.filter(u => u.role === "admin").length,
      activeSessions: accounts.filter(u => u.status === "Active").length
    };

    // Dummy workspace list (avoid error if no model yet)
     const workspaces = [
      { _id: "analytics", name: "Analytics" },
      { _id: "mail", name: "Mail" },
      { _id: "meet", name: "Meet" },
      { _id: "slack", name: "Slack" },
      { _id: "stripe", name: "Stripe" }
    ];

    res.render("superadmin", { 
       title: "Super Admin Panel",
      users: accounts, 
      roles: accounts, 
      workspaces,    // ✅ ensure always defined
      stats,
      availableRoles: existingRoles || [], // ✅ Pass actual roles from database
      preSelectedRole: preSelectedRole // ✅ Pass URL parameter for auto-selection
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading superadmin panel");
  }
});


app.post('/superadmin/users', async (req, res) => {
  try {
    console.log('📝 Creating new user with data:', req.body);
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await Account.findOne({ email });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    const account = new Account({ name, email, password, role });
    const savedAccount = await account.save();
    console.log('✅ User created successfully:', savedAccount);
    
    res.json(savedAccount);
  } catch (err) {
    console.error('❌ Error creating user:', err);
    res.status(500).json({ error: 'Failed to create account', details: err.message });
  }
});

app.delete('/superadmin/users/:id', async (req, res) => {
  try {
    await Account.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// Save role permissions from superadmin panel
app.post('/superadmin/permissions', async (req, res) => {
  try {
    const { roleName, permissions } = req.body;
    
    console.log('💾 Saving permissions for role:', roleName);
    console.log('📋 Permissions:', permissions);
    
    // Find existing role template or create new one
    let roleTemplate = await Permission.findOne({ role: roleName, isTemplate: true });
    
    if (roleTemplate) {
      // Update existing permissions
      roleTemplate.permissions = permissions;
      await roleTemplate.save();
      console.log('✅ Updated existing role template permissions');
    } else {
      // Create new role template
      roleTemplate = new Permission({
        role: roleName,
        permissions,
        isTemplate: true,
        createdBy: 'superadmin@gmail.com'
      });
      await roleTemplate.save();
      console.log('✅ Created new role template');
    }
    
    // Also update all users with this role
    const usersWithRole = await Permission.find({ role: roleName, isTemplate: false });
    console.log(`🔄 Updating ${usersWithRole.length} users with role ${roleName}`);
    
    for (let user of usersWithRole) {
      user.permissions = permissions;
      await user.save();
    }
    
    res.json({ success: true, message: `Permissions updated for role: ${roleName}` });
  } catch (error) {
    console.error('Error saving permissions:', error);
    res.status(500).json({ error: 'Failed to save permissions' });
  }
});

// Get role permissions for superadmin panel
app.get('/superadmin/permissions/:roleName', async (req, res) => {
  try {
    const { roleName } = req.params;
    console.log('📖 Loading permissions for role:', roleName);
    
    let roleTemplate = await Permission.findOne({ role: roleName, isTemplate: true });
    
    if (!roleTemplate) {
      console.log('⚠️ No permissions found for role:', roleName);
      // Return default empty permissions
      const defaultPermissions = {
        products: { view: false, create: false, edit: false, delete: false, export: false },
        categories: { view: false, create: false, edit: false, delete: false, export: false },
        attributes: { view: false, create: false, edit: false, delete: false, export: false },
        blogs: { view: false, create: false, edit: false, delete: false, export: false },
        orders: { view: false, create: false, edit: false, delete: false, export: false },
        transactions: { view: false, create: false, edit: false, delete: false, export: false },
        customers: { view: false, create: false, edit: false, delete: false, export: false },
        team: { view: false, create: false, edit: false, delete: false, export: false },
        coupons: { view: false, create: false, edit: false, delete: false, export: false },
        languages: { view: false, create: false, edit: false, delete: false, export: false },
        currencies: { view: false, create: false, edit: false, delete: false, export: false },
        themes: { view: false, create: false, edit: false, delete: false, export: false }
      };
      return res.json(defaultPermissions);
    }
    
    console.log('✅ Found permissions for role:', roleName);
    res.json(roleTemplate.permissions);
  } catch (error) {
    console.error('Error loading permissions:', error);
    res.status(500).json({ error: 'Failed to load permissions' });
  }
});

// Duplicate route - commenting out to avoid conflicts
/*
// Show SuperAdmin Panel (List Accounts / Roles)
app.get("/superadmin", async (req, res) => {
  try {
    const accounts = await Account.find().lean();

    // Example stats
    const stats = {
      totalUsers: accounts.length,
      totalAdmins: accounts.filter(u => u.role === "admin").length,
     
      activeSessions: accounts.filter(u => u.status === "Active").length
    };

    // Dummy workspace list (if you don’t have a separate model yet)
    const workspaces = [
      { _id: "1", name: "Workspace A" },
      { _id: "2", name: "Workspace B" }
    ];

    res.render("superadmin", { 
      users: accounts, 
      roles: accounts, 
      workspaces, 
      stats 
    });
  } catch (err) {
    res.status(500).send("Error loading superadmin panel");
  }
});

/*
// Create new Account / Role
app.post("/superadmin/roles", async (req, res) => {
  try {
    const { name, email, password, role, roleName, workspace, tag, status } = req.body;

    const newAccount = await Account.create({
      name,
      email,
      password,
      role,
      roleName,
      workspace,
      tag,
      status
    });

    res.json(newAccount);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create role" });
  }
});

// Delete Account / Role
app.delete("/superadmin/roles/:id", async (req, res) => {
  try {
    await Account.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete role" });
  }
});
*/


// /categories route removed - using /category route instead

// Team members page route
app.get("/team", requireAuth, async (req, res) => {
  try {
    const teamMembers = await Staff.find().lean();
    const userPermissions = await getUserPermissions(req.session.user.email);
    const userRole = req.session.user.email === 'superadmin@gmail.com' ? 'superadmin' : 'admin';
    const hasFullAccess = userRole === 'superadmin';
    res.render("team", {
      title: "Team Members",
      teamMembers,
      userPermissions,
      userRole,
      hasFullAccess
    });
  } catch (error) {
    console.error("Error fetching team members:", error);
    res.status(500).send("Error loading team members");
  }
});

// Coupons page route
app.get("/coupons", requireAuth, checkPermission('coupons', 'view'), async (req, res) => {
  try {
    const coupons = await Coupon.find().lean();
    const userPermissions = await getUserPermissions(req.session.user.email);
    const userRole = req.session.user.email === 'superadmin@gmail.com' ? 'superadmin' : 'admin';
    const hasFullAccess = userRole === 'superadmin';
    res.render("coupons", {
      title: "Manage Coupons",
      coupons,
      userPermissions,
      userRole,
      hasFullAccess
    });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    res.status(500).send("Error loading coupons");
  }
});

// Show attributes page
app.get("/attributes", async (req, res) => {
  try{
    const attributes = await Attribute.find().lean();
    const userPermissions = await getUserPermissions(req.session.user.email);
    const userRole = req.session.user.email === 'superadmin@gmail.com' ? 'superadmin' : 'admin';
    const hasFullAccess = userRole === 'superadmin';
    res.render("attributes", {
      title: "Manage Attributes", 
      attributes,
      userPermissions,
      userRole,
      hasFullAccess
    });
  } catch(error){
    console.error(error);
    res.status(500).send("Error fetching attributes");
  }
});


// Add attribute
app.post("/attributes/add", async (req, res) => {
  const { name, displayName, option } = req.body;
  await Attribute.create({ name, displayName, option });
  res.redirect("/attributes");
});

// Delete attribute
app.post("/attributes/delete/:id", async (req, res) => {
  await Attribute.findByIdAndDelete(req.params.id);
  res.redirect("/attributes");
});


// // ✅ Correct (use app instead of router)
// app.get("/coupons/create", (req, res) => {
//   res.render("coupon-create");
// });

// app.post("/coupons/create", async (req, res) => {
//   try {
//     const { title, code, discount, expiry, status } = req.body;
//     const coupon = new Coupon({ title, code, discount, expiry, status });
//     await coupon.save();
//     res.redirect("/coupons/list");
//   } catch (err) {
//     res.status(500).send("Error creating coupon: " + err.message);
//   }
// });

// app.get("/coupons/list", async (req, res) => {
//   const coupons = await Coupon.find();
//   res.render("coupons-list", { coupons });
// });


// app.use("/coupons", couponRoutes);

// app.get("/", (req, res) => res.redirect("/coupons/create"));     


// ================== Coupon API Routes ==================

// Get all coupons
// ================== Coupon API Routes ==================

// Get all coupons


const couponStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "uploads/coupons");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// ✅ Multer instance for coupons
const uploadCoupon = multer({ storage: couponStorage });




app.get("/api/coupons", async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (err) {
    console.error("Error fetching coupons:", err);
    res.status(500).json({ error: "Error fetching coupons" });
  }
});

// Add new coupon WITH IMAGE
app.post("/api/coupons", uploadCoupon.single("img"), async (req, res) => {
  try {
    const {
      title,
      code,
      startDate,
      endDate,
      discountType,
      discount,
      minPurchase,
      maxDiscount,
      firstOrderOnly,
      status,
      editId
    } = req.body;

    const couponData = {
      title,
      code,
      discountType,
      discount: discount ? Number(discount) : 0,
      minPurchase: minPurchase ? Number(minPurchase) : 0,
      maxDiscount: maxDiscount ? Number(maxDiscount) : 0,
      firstOrderOnly: firstOrderOnly === "true",
      startDate: startDate || null,
      endDate: endDate || null,
      status: status || "Inactive"
    };

    // Add image if uploaded
    if (req.file) {
      couponData.img = `/uploads/coupons/${req.file.filename}`;
    }

    if (editId) {
      // Update existing coupon
      const updatedCoupon = await Coupon.findByIdAndUpdate(editId, couponData, { new: true });
      if (!updatedCoupon) {
        return res.status(404).send("Coupon not found");
      }
      res.redirect("/coupon-create?updated=true");
    } else {
      // Create new coupon
      const coupon = new Coupon(couponData);
      await coupon.save();
      res.redirect("/coupon-create?created=true");
    }
  } catch (err) {
    console.error("Error saving/updating coupon:", err);
    res.status(500).send("Error processing coupon");
  }
});

// Delete coupon (form submission)
app.post("/coupons/delete/:id", async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.redirect("/coupon-list?deleted=true");
  } catch (err) {
    console.error("Error deleting coupon:", err);
    res.redirect("/coupon-list?error=delete_failed");
  }
});

// Delete coupon
app.delete("/api/coupons/:id", async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting coupon:", err);
    res.status(500).json({ error: "Error deleting coupon" });
  }
});

// Get single coupon by ID
app.get("/api/coupons/:id", async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }
    res.json(coupon);
  } catch (err) {
    console.error("Error fetching coupon:", err);
    res.status(500).json({ error: "Error fetching coupon" });
  }
});

// Update coupon
app.put("/api/coupons/:id", uploadCoupon.single("img"), async (req, res) => {
  try {
    const {
      title,
      code,
      startDate,
      endDate,
      discountType,
      discount,
      minPurchase,
      maxDiscount,
      firstOrderOnly,
      status
    } = req.body;

    const updateData = {
      title,
      code,
      discountType,
      discount: discount ? Number(discount) : 0,
      minPurchase: minPurchase ? Number(minPurchase) : 0,
      maxDiscount: maxDiscount ? Number(maxDiscount) : 0,
      firstOrderOnly: firstOrderOnly === "true",
      startDate: startDate || null,
      endDate: endDate || null,
      status: status || "Inactive"
    };

    // Only update image if new file is uploaded
    if (req.file) {
      updateData.img = `/uploads/coupons/${req.file.filename}`;
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedCoupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    res.redirect("/coupon-create?updated=true");
  } catch (err) {
    console.error("Error updating coupon:", err);
    res.status(500).send("Error updating coupon");
  }
});

// Toggle coupon status
app.patch("/api/coupons/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    
    if (!updatedCoupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }
    
    res.json({ success: true, coupon: updatedCoupon });
  } catch (err) {
    console.error("Error updating coupon status:", err);
    res.status(500).json({ error: "Error updating coupon status" });
  }
});

// Render create coupon page
app.get("/coupon-create", requireAuth, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    const userPermissions = await getUserPermissions(req.session.user.email);
    const userRole = req.session.user.email === 'superadmin@gmail.com' ? 'superadmin' : 'admin';
    const hasFullAccess = userRole === 'superadmin';
    let editCoupon = null;
    let message = null;
    let error = null;

    // Check if editing existing coupon
    if (req.query.edit) {
      editCoupon = await Coupon.findById(req.query.edit);
      if (!editCoupon) {
        error = "Coupon not found for editing";
      }
    }

    // Success messages
    if (req.query.updated) {
      message = "Coupon updated successfully!";
    } else if (req.query.created) {
      message = "Coupon created successfully!";
    }

    res.render("coupon-create", { 
      coupons, 
      editCoupon, 
      message, 
      error, 
      userPermissions,
      userRole,
      hasFullAccess,
      title: editCoupon ? "Edit Coupon" : "Create Coupon" 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading coupon page");
  }
});

// Render coupon list page
app.get("/coupon-list", requireAuth, async (req, res) => {
  try {
    const coupons = await Coupon.find();
    const userPermissions = await getUserPermissions(req.session.user.email);
    const userRole = req.session.user.email === 'superadmin@gmail.com' ? 'superadmin' : 'admin';
    const hasFullAccess = userRole === 'superadmin';
    res.render("coupon-list", { 
      coupons, 
      title: "Coupon List",
      userPermissions,
      userRole,
      hasFullAccess
    });
  } catch (err) {
    console.error("Error fetching coupons:", err);
    res.status(500).send("Error loading coupons");
  }
});







// Customers
// Customers list show karna
// Customers list page
app.get("/customers", async (req, res) => {
  try {
    const customers = await Customer.find().lean(); // sabhi customers fetch
    const userPermissions = await getUserPermissions(req.session.user.email);
    const userRole = req.session.user.email === 'superadmin@gmail.com' ? 'superadmin' : 'admin';
    const hasFullAccess = userRole === 'superadmin';
    res.render("customers", { 
      title: "Manage Customers",
      customers,
      userPermissions,
      userRole,
      hasFullAccess
    });
  } catch (err) {
    console.error("❌ Error fetching customers:", err.message);
    res.status(500).send("Error loading customers");
  }
});

// Customer add karna
app.post("/customers/add", async (req, res) => {
  try {
    const { name, email, phone, status } = req.body;

    const customer = new Customer({
      name,
      email,
      phone,
      status,
      orders: 0 // default orders 0
    });

    await customer.save();
    res.redirect("/customers"); // add ke baad list page me wapas
  } catch (err) {
    console.error("❌ Error adding customer:", err.message);
    res.status(500).send("Error adding customer");
  }
});

// Customer delete
app.get("/customers/delete/:id", async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.redirect("/customers");
  } catch (err) {
    console.error("❌ Error deleting customer:", err.message);
    res.status(500).send("Error deleting customer");
  }
});

// ✅ Staff list
app.get("/our-staff", async (req, res) => {
  try {
    const staff = await Staff.find().sort({ createdAt: -1 });
    const userPermissions = await getUserPermissions(req.session.user.email);
    const userRole = req.session.user.email === 'superadmin@gmail.com' ? 'superadmin' : 'admin';
    const hasFullAccess = userRole === 'superadmin';
    res.render("our-staff", { 
      title: "Our Staff",
      staff,
      userPermissions,
      userRole,
      hasFullAccess
    });
  } catch (err) {
    console.error("❌ Staff load error:", err);
    res.status(500).send("Error loading staff");
  }
});

// ✅ Add staff
app.post("/our-staff/add", async (req, res) => {
  const { name, role, email, status } = req.body;

  const newStaff = new Staff({ name, role, email, status });
  await newStaff.save();

  res.redirect("/our-staff");
});

// ✅ Delete staff
app.post("/our-staff/delete/:id", async (req, res) => {
  await Staff.findByIdAndDelete(req.params.id);
  res.redirect("/our-staff");
});

// ✅ Edit staff
app.post("/our-staff/edit/:id", async (req, res) => {
  const { name, role, email, status } = req.body;

  await Staff.findByIdAndUpdate(req.params.id, { 
    name, 
    role, 
    email, 
    status 
  });

  res.redirect("/our-staff");
});

// ✅ Show Settings Page
app.get("/settings", async (req, res) => {
  let setting = await Setting.findOne();
  if (!setting) {
    setting = new Setting();
    await setting.save();
  }
  res.render("settings", { title: "Global Settings", setting });
});

// ✅ Save/Update Settings
app.post("/settings", async (req, res) => {
  let setting = await Setting.findOne();
  if (setting) {
    await Setting.findByIdAndUpdate(setting._id, {
      ...req.body,
      autoTranslation: req.body.autoTranslation ? true : false,
      enableInvoiceEmail: req.body.enableInvoiceEmail ? true : false
    });
  } else {
    const newSetting = new Setting({
      ...req.body,
      autoTranslation: req.body.autoTranslation ? true : false,
      enableInvoiceEmail: req.body.enableInvoiceEmail ? true : false
    });
    await newSetting.save();
  }
  res.redirect("/settings");
});


// GET all languages
app.get("/languages", async (req, res) => {
  try {
    const languages = await Language.find();
    const userPermissions = await getUserPermissions(req.session.user.email);
    const userRole = req.session.user.email === 'superadmin@gmail.com' ? 'superadmin' : 'admin';
    const hasFullAccess = userRole === 'superadmin';
    res.render("languages", { 
      languages, 
      title: "Languages",
      userPermissions,
      userRole,
      hasFullAccess
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post("/languages/add", async (req, res) => {
  const { name, code } = req.body;
  try {
    await new Language({ name, code }).save();
    res.redirect("/languages");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding language");
  }
});

app.post("/languages/delete/:code", async (req, res) => {
  try {
    await Language.findOneAndDelete({ code: req.params.code });
    res.redirect("/languages");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting language");
  }
});





// ====== GET Currencies page ======
app.get("/currencies", async (req, res) => {
  try {
    const currencies = await Currency.find();
    const userPermissions = await getUserPermissions(req.session.user.email);
    const userRole = req.session.user.email === 'superadmin@gmail.com' ? 'superadmin' : 'admin';
    const hasFullAccess = userRole === 'superadmin';
    res.render("currencies", { 
      currencies, 
      title: "Currencies",
      userPermissions,
      userRole,
      hasFullAccess
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// ====== ADD Currency ======
app.post("/currencies", async (req, res) => {
  const { code, name, symbol, rate } = req.body;
  try {
    const newCurrency = new Currency({ code, name, symbol, rate });
    await newCurrency.save();
    res.redirect("/currencies");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding currency");
  }
});

// ====== Optional: DELETE Currency ======
app.post("/currencies/delete/:id", async (req, res) => {
  try {
    await Currency.findByIdAndDelete(req.params.id);
    res.redirect("/currencies");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting currency");
  }
});

// ✅ List Transactions
app.get("/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find().lean();
    const userPermissions = await getUserPermissions(req.session.user.email);
    const userRole = req.session.user.email === 'superadmin@gmail.com' ? 'superadmin' : 'admin';
    const hasFullAccess = userRole === 'superadmin';
    res.render("transactions", { 
      title: "Transactions", 
      transactions,
      userPermissions,
      userRole,
      hasFullAccess
    }); // 👈 bas "transactions"
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});


// ✅ Delete Transaction
app.post("/transactions/delete/:id", async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.redirect("/transactions");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// ✅ View Transaction
app.get("/transactions/view/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id).lean();
    res.render("transactions/view", { title: "View Transaction", transaction });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});


app.get("/pages", (req, res) => {
  const pages = [
    { id: 1, title: "About Us", slug: "about-us", date: "2025-08-01", status: "Published" },
    { id: 2, title: "Contact", slug: "contact", date: "2025-08-05", status: "Draft" },
    { id: 3, title: "Privacy Policy", slug: "privacy-policy", date: "2025-08-10", status: "Published" },
    { id: 4, title: "Terms & Conditions", slug: "terms-conditions", date: "2025-08-15", status: "Draft" }
  ];

  res.render("pages", { 
    title: "Pages List", 
    pages 
  });
});


// ✅ Media list page
app.get("/media", async (req, res) => {
  try {
    const media = await Media.find().sort({ uploadedAt: -1 });
    const userPermissions = await getUserPermissions(req.session.user.email);
    const userRole = req.session.user.email === 'superadmin@gmail.com' ? 'superadmin' : 'admin';
    const hasFullAccess = userRole === 'superadmin';
    res.render("media", { 
      title: "Media Library", 
      media,
      userPermissions,
      userRole,
      hasFullAccess
    });
  } catch (err) {
    console.error("❌ Media load error:", err);
    res.status(500).send("Server Error while loading media");
  }
});

// ✅ File upload
app.post("/media/upload", upload.single("mediaFile"), async (req, res) => {
  if (!req.file) return res.redirect("/media");

  let fileType = "Document";
  if (req.file.mimetype.startsWith("image")) fileType = "Image";
  else if (req.file.mimetype.startsWith("video")) fileType = "Video";

  const newMedia = new Media({
    filename: req.file.originalname,
    url: "/uploads/" + req.file.filename,
    type: fileType,
    size: (req.file.size / 1024).toFixed(2) + " KB"
  });

  await newMedia.save();
  res.redirect("/media");
});

// ✅ Delete media
app.post("/media/delete/:id", async (req, res) => {
  await Media.findByIdAndDelete(req.params.id);
  res.redirect("/media");
});

// 📢 Notification API routes
app.get("/api/notifications", requireAuth, async (req, res) => {
  try {
    // Get recent orders for notifications
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    
    // Get recent signups
    const recentUsers = await profileuser.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    
    const notifications = [];
    
    // Add order notifications
    recentOrders.forEach(order => {
      const timeDiff = new Date() - new Date(order.createdAt);
      const timeAgo = getTimeAgo(timeDiff);
      
      notifications.push({
        id: order._id,
        type: 'order',
        title: 'New order received',
        message: `Order #${order._id.toString().slice(-6)} - $${order.total || 0}`,
        time: timeAgo,
        link: `/orders/${order._id}`,
        icon: '🛒'
      });
    });
    
    // Add user signup notifications
    recentUsers.forEach(user => {
      const timeDiff = new Date() - new Date(user.createdAt);
      const timeAgo = getTimeAgo(timeDiff);
      
      notifications.push({
        id: user._id,
        type: 'user',
        title: 'New user signed up',
        message: user.name || user.email,
        time: timeAgo,
        link: `/customers`,
        icon: '👤'
      });
    });
    
    // Sort by creation time
    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({
      notifications: notifications.slice(0, 10),
      unreadCount: notifications.length
    });
    
  } catch (error) {
    console.error('❌ Error fetching notifications:', error);
    res.status(500).json({ 
      notifications: [], 
      unreadCount: 0 
    });
  }
});

// Helper function to calculate time ago
function getTimeAgo(timeDiff) {
  const minutes = Math.floor(timeDiff / (1000 * 60));
  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});

// 404
app.use((req, res) => {
  res.status(404).render("404", { title: "404 - Page Not Found" });
});


// About page GET
app.get("/about", async (req, res) => {
  try {
    const aboutData = await About.findOne();
    res.render("about", { about: aboutData });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading About page");
  }
});

// About page POST (save/update)
app.post("/about", async (req, res) => {
  try {
    let aboutData = await About.findOne();
    if (aboutData) {
      // update
      aboutData.title = req.body.title;
      aboutData.subtitle = req.body.subtitle;
      aboutData.description = req.body.description;
      aboutData.mission = req.body.mission;
      aboutData.vision = req.body.vision;
      await aboutData.save();
    } else {
      // create
      await About.create(req.body);
    }
    res.redirect("/about");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving About page");
  }
});



// ---------- Server ----------
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
