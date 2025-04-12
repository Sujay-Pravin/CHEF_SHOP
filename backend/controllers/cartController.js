import userModel from "../models/userModel.js"
import jwt from 'jsonwebtoken'

const addToCart = async (req,res) => {
    try {
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        let userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({success: false, message: "User not found"});
        }

        let cartData = userData.cartData || {};
        if(!cartData[req.body.itemId]){
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }

        await userModel.findByIdAndUpdate(userId, {cartData})
        res.json({success: true, message: "Added to cart"})
    } catch (error) {
        console.error("Add to cart error:", error);
        res.json({success: false, message: "Can't add to cart"})
    }
}

const removeFromCart = async (req,res) => {
    try {
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        let userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({success: false, message: "User not found"});
        }

        let cartData = userData.cartData || {};
        if(cartData[req.body.itemId] > 0){
            cartData[req.body.itemId] -= 1;
        }

        await userModel.findByIdAndUpdate(userId, {cartData});
        res.json({success: true, message: "Removed from cart"})
    } catch (error) {
        console.error("Remove from cart error:", error);
        res.json({success: false, message: "Unable to remove from cart"})
    }
}

const getCart = async (req,res) => {
    try {
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        let userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({success: false, message: "User not found"});
        }

        let cartData = userData.cartData || {};
        res.json({success: true, cartData})
    } catch (error) {
        console.error("Get cart error:", error);
        res.json({success: false, message: "Unable to get the cart"})
    }
}

export {addToCart, removeFromCart, getCart}
