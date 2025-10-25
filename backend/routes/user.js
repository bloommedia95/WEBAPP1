import express from "express";
import profileuser from "../models/profileuser.js";

const router = express.Router();

// Middleware to get user by email or contactNumber (from req.body or req.query)
async function getUser(req, res, next) {
  const { email, contactNumber } = req.body.email ? req.body : req.query;
  if (!email && !contactNumber) {
    return res.status(400).json({ message: "Email or contactNumber required" });
  }
  try {
    const user = await profileuser.findOne({
      $or: [
        { email },
        { contactNumber }
      ]
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// GET user cart, wishlist, address
router.get("/data", getUser, (req, res) => {
  const { cart = [], wishlist = [], address = [] } = req.user;
  res.json({ cart, wishlist, address });
});

// POST add to cart
router.post("/cart", getUser, async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  if (!productId) return res.status(400).json({ message: "productId required" });
  const cart = req.user.cart || [];
  const existing = cart.find(item => item.productId.toString() === productId);
  if (existing) existing.quantity += quantity;
  else cart.push({ productId, quantity });
  req.user.cart = cart;
  await req.user.save();
  res.json({ cart });
});

// POST remove from cart
router.post("/cart/remove", getUser, async (req, res) => {
  const { productId } = req.body;
  req.user.cart = (req.user.cart || []).filter(item => item.productId.toString() !== productId);
  await req.user.save();
  res.json({ cart: req.user.cart });
});

// POST add to wishlist
router.post("/wishlist", getUser, async (req, res) => {
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ message: "productId required" });
  const wishlist = req.user.wishlist || [];
  if (!wishlist.some(item => item.productId.toString() === productId)) {
    wishlist.push({ productId });
  }
  req.user.wishlist = wishlist;
  await req.user.save();
  res.json({ wishlist });
});

// POST remove from wishlist
router.post("/wishlist/remove", getUser, async (req, res) => {
  const { productId } = req.body;
  req.user.wishlist = (req.user.wishlist || []).filter(item => item.productId.toString() !== productId);
  await req.user.save();
  res.json({ wishlist: req.user.wishlist });
});

// POST add/update address
router.post("/address", getUser, async (req, res) => {
  const { address } = req.body;
  if (!address) return res.status(400).json({ message: "address required" });
  req.user.address = address; // address should be an array
  await req.user.save();
  res.json({ address });
});

// POST remove address (by index)
router.post("/address/remove", getUser, async (req, res) => {
  const { index } = req.body;
  if (typeof index !== "number") return res.status(400).json({ message: "index required" });
  req.user.address = (req.user.address || []);
  req.user.address.splice(index, 1);
  await req.user.save();
  res.json({ address: req.user.address });
});

export default router;
