import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const paymentRouter = express.Router();

// Check if environment variables are loaded
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error('Razorpay credentials not found in environment variables');
    throw new Error('Razorpay credentials are required');
}

// Initialize Razorpay with explicit string values
const razorpay = new Razorpay({
    key_id: String(process.env.RAZORPAY_KEY_ID),
    key_secret: String(process.env.RAZORPAY_KEY_SECRET)
});

paymentRouter.post('/create-order', async (req, res) => {
    try {
        const { amount } = req.body;
        
        if (!amount) {
            return res.status(400).json({
                success: false,
                error: "Amount is required"
            });
        }

        const options = {
            amount: Math.round(amount * 100), // Convert to paise and ensure it's an integer
            currency: "INR",
            receipt: `order_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        
        res.json({
            success: true,
            order,
            key_id: process.env.RAZORPAY_KEY_ID // Send key_id to frontend
        });
    } catch (error) {
        console.error("Payment creation error:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Payment creation failed"
        });
    }
});

paymentRouter.post('/verify', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(sign.toString())
        .digest("hex");
        
    if (razorpay_signature === expectedSign) {
        res.json({success: true, message: "Payment verified successfully"});
    } else {
        res.json({success: false, message: "Invalid payment signature"});
    }
});

export default paymentRouter;
