import promoModel from "../models/promoModel.js";

export const createPromo = async (req, res) => {
    try {
        const { code, discount } = req.body;
        
        // Check if promo code already exists
        const existing = await promoModel.findOne({ code: code.toUpperCase() });
        if (existing) {
            return res.json({ success: false, message: "Promo code already exists" });
        }

        const newPromo = new promoModel({
            code: code.toUpperCase(),
            discount
        });

        await newPromo.save();
        res.json({ success: true, message: "Promo code created successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const listPromos = async (req, res) => {
    try {
        const promos = await promoModel.find().sort({ createdAt: -1 });
        res.json({ success: true, data: promos });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const deletePromo = async (req, res) => {
    try {
        await promoModel.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Promo code deleted successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const validatePromo = async (req, res) => {
    try {
        const promo = await promoModel.findOne({ code: req.body.code.toUpperCase() });
        if (!promo) {
            return res.json({ success: false, message: "Invalid promo code" });
        }
        res.json({ success: true, data: promo });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
