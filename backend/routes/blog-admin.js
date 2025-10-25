import express from 'express';
import Blog from '../models/blogModel.js';
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// Multer storage for blog images
const blogImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../public/uploads/blog");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Configure multer to handle multiple file fields
const uploadFields = multer({ storage: blogImageStorage }).fields([
  { name: 'bannerImage', maxCount: 1 },
  { name: 'extraImages1', maxCount: 2 },
  { name: 'extraImages2', maxCount: 2 },
  { name: 'extraImages3', maxCount: 2 }
]);

// Authentication middleware
function requireAuth(req, res, next) {
  if (req.session && req.session.isAuth) next();
  else res.redirect("/login");
}

// Combined blog add/list page
router.get("/admin/blog", requireAuth, async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.render("blogs", { title: "Blog Articles", blogs, editBlog: null });
});

// Also handle /blogs route for the admin panel
router.get("/blogs", requireAuth, async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.render("blogs", { title: "Blog Articles", blogs, editBlog: null });
});

// Blog create handler (same page)
router.post("/blogs", requireAuth, uploadFields, async (req, res) => {
  try {
    const { title, content, extraTitle1, extraContent1, extraTitle2, extraContent2, extraTitle3, extraContent3 } = req.body;
    
    console.log("Files received:", req.files);
    console.log("Body received:", req.body);
    
    let bannerImage = "";
    if (req.files && req.files.bannerImage && req.files.bannerImage[0]) {
      bannerImage = "/uploads/blog/" + req.files.bannerImage[0].filename;
    }
    
    // Handle extra sections
    let extraSections = [];
    
    // Extra Section 1
    if (extraTitle1 || extraContent1) {
      let section1Images = [];
      if (req.files && req.files.extraImages1) {
        section1Images = req.files.extraImages1.map(file => "/uploads/blog/" + file.filename);
      }
      
      extraSections.push({
        title: extraTitle1 || '',
        content: extraContent1 || '',
        images: section1Images
      });
    }
    
    // Extra Section 2
    if (extraTitle2 || extraContent2) {
      let section2Images = [];
      if (req.files && req.files.extraImages2) {
        section2Images = req.files.extraImages2.map(file => "/uploads/blog/" + file.filename);
      }
      
      extraSections.push({
        title: extraTitle2 || '',
        content: extraContent2 || '',
        images: section2Images
      });
    }
    
    // Extra Section 3
    if (extraTitle3 || extraContent3) {
      let section3Images = [];
      if (req.files && req.files.extraImages3) {
        section3Images = req.files.extraImages3.map(file => "/uploads/blog/" + file.filename);
      }
      
      extraSections.push({
        title: extraTitle3 || '',
        content: extraContent3 || '',
        images: section3Images
      });
    }
    
    const blogData = {
      title,
      bannerImage,
      content: content || '',
      extraSections
    };
    
    await Blog.create(blogData);
    console.log("Blog created successfully with data:", blogData);
    
    res.redirect("/blogs");
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).send("Error creating blog: " + error.message);
  }
});

// Blog delete handler
router.post("/blogs/delete/:id", requireAuth, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect("/blogs");
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.redirect("/blogs");
  }
});

// Edit blog routes
router.get("/blogs/edit/:id", requireAuth, async (req, res) => {
  try {
    const editBlog = await Blog.findById(req.params.id);
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.render("blogs", { title: "Edit Blog", blogs, editBlog });
  } catch (error) {
    console.error("Error fetching blog for edit:", error);
    res.redirect("/blogs");
  }
});

router.post("/blogs/edit/:id", requireAuth, uploadFields, async (req, res) => {
  try {
    const { title, content, extraTitle1, extraContent1, extraTitle2, extraContent2, extraTitle3, extraContent3 } = req.body;
    const updateData = { title, content };
    
    if (req.files && req.files.bannerImage && req.files.bannerImage[0]) {
      updateData.bannerImage = "/uploads/blog/" + req.files.bannerImage[0].filename;
    }
    
    // Handle extra sections update
    let extraSections = [];
    
    // Extra Section 1
    if (extraTitle1 || extraContent1) {
      let section1Images = [];
      if (req.files && req.files.extraImages1) {
        section1Images = req.files.extraImages1.map(file => "/uploads/blog/" + file.filename);
      }
      
      extraSections.push({
        title: extraTitle1 || '',
        content: extraContent1 || '',
        images: section1Images
      });
    }
    
    // Extra Section 2
    if (extraTitle2 || extraContent2) {
      let section2Images = [];
      if (req.files && req.files.extraImages2) {
        section2Images = req.files.extraImages2.map(file => "/uploads/blog/" + file.filename);
      }
      
      extraSections.push({
        title: extraTitle2 || '',
        content: extraContent2 || '',
        images: section2Images
      });
    }
    
    // Extra Section 3
    if (extraTitle3 || extraContent3) {
      let section3Images = [];
      if (req.files && req.files.extraImages3) {
        section3Images = req.files.extraImages3.map(file => "/uploads/blog/" + file.filename);
      }
      
      extraSections.push({
        title: extraTitle3 || '',
        content: extraContent3 || '',
        images: section3Images
      });
    }
    
    if (extraSections.length > 0) {
      updateData.extraSections = extraSections;
    }
    
    await Blog.findByIdAndUpdate(req.params.id, updateData);
    res.redirect("/blogs");
  } catch (error) {
    console.error("Error updating blog:", error);
    res.redirect("/blogs");
  }
});

export default router;
