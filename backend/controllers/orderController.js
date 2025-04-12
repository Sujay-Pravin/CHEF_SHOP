import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import dotenv from 'dotenv';

dotenv.config();

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

//placing an order
const placeOrder = async (req, res) => {
    try {
        const { items, amount, address, paymentDetails } = req.body;
        
        // Create new order
        const newOrder = new orderModel({
            userId: req.body.userId,
            items,
            amount,
            address,
            status: "Order Placed",
            payment: true,
            paymentId: paymentDetails.razorpay_payment_id
        });

        await newOrder.save();
        
        // Clear user's cart
        await userModel.findByIdAndUpdate(req.body.userId, {cartData: {}});

        res.json({
            success: true,
            message: "Order placed successfully",
            orderId: newOrder._id
        });
    } catch (error) {
        console.error("Order placement error:", error);
        res.json({
            success: false,
            message: error.message || "Error placing order"
        });
    }
}

const verifyOrder = async (req,res) => {
    const {orderId,success} = req.body;
    try{
        if(success = "true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:true})
            res.json({success:true,message:"Paid"})
        }
        else{
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false,message:"Not Paid"})
        }

    }
    catch(error){
        console.log(error)
        res.json({success:false,message:"Error"})
    }
}

//user order

const userOrders = async (req,res) => {
    try {
        if (!req.body.userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const orders = await orderModel.find({userId: req.body.userId})
            .sort({date: -1}); // Sort by date descending

        res.json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders"
        });
    }
}

//listening orders for admin

const listOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({ status: { $ne: "Cancelled" } });
        res.json({success: true, data: orders})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: "Error"})
    }
}

//api for updating order status
const updateStatus = async (req,res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.json({success:true,message:"Status updated"})
    } catch (error) {
        console.log(error)        
        res.json({success:false,message:"Error"})

    }
}

const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await orderModel.findById(orderId);
        
        if (!order) {
            return res.json({success: false, message: "Order not found"});
        }

        if (order.status !== "Order Placed") {
            return res.json({success: false, message: "Cannot cancel order at this stage"});
        }

        await orderModel.findByIdAndUpdate(orderId, {status: "Cancelled"});
        res.json({success: true, message: "Order cancelled successfully"});
    } catch (error) {
        console.error("Cancel order error:", error);
        res.json({success: false, message: "Failed to cancel order"});
    }
}

export {placeOrder, verifyOrder, userOrders, listOrders, updateStatus, cancelOrder}