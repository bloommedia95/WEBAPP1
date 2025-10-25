import express from "express";
import Offer from "../models/Offer.js";

const router = express.Router();

// Get all offers
router.get("/", async (req, res) => {
  try {
    const offers = await Offer.find({ status: "Active" });
    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new offer
router.post("/", async (req, res) => {
  try {
    const offer = new Offer(req.body);
    await offer.save();
    res.status(201).json(offer);
  } catch (err) {
    console.error('Offer creation error:', err);
    if (err.errors) {
      Object.keys(err.errors).forEach(key => {
        console.error(`Validation error for ${key}:`, err.errors[key].message);
      });
    }
    res.status(400).json({ message: err.message, errors: err.errors });
  }
});

// Update an offer
router.put("/:id", async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!offer) return res.status(404).json({ message: "Offer not found" });
    res.json(offer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an offer
router.delete("/:id", async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) return res.status(404).json({ message: "Offer not found" });
    res.json({ message: "Offer deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
