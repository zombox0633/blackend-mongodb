"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserCart = exports.updateCart = exports.addToCart = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
// Add products to the user's cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size } = req.body;
        if (!userId || !itemId || !size) {
            res.status(400).json({ success: false, message: "Missing required fields" });
            return;
        }
        const userData = await userModel_1.default.findById(userId);
        if (!userData) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        const cartData = userData.cartData || {};
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            }
            else {
                cartData[itemId][size] = 1;
            }
        }
        else {
            cartData[itemId] = { [size]: 1 };
        }
        await userModel_1.default.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Added To Cart" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "An error occurred while adding to cart" });
    }
};
exports.addToCart = addToCart;
// Update user cart
const updateCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity } = req.body;
        if (!userId || !itemId || !size || quantity === undefined) {
            res.status(400).json({ success: false, message: "Missing required fields" });
            return;
        }
        const userData = await userModel_1.default.findById(userId);
        if (!userData) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        const cartData = userData.cartData || {};
        if (cartData[itemId]) {
            cartData[itemId][size] = quantity;
        }
        else {
            res.status(400).json({ success: false, message: "Item not found in cart" });
            return;
        }
        await userModel_1.default.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Cart Updated" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Missing required fields" });
    }
};
exports.updateCart = updateCart;
// Get user cart data
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            res.status(400).json({ success: false, message: "Missing required fields" });
            return;
        }
        const userData = await userModel_1.default.findById(userId);
        if (!userData) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        const cartData = userData.cartData || {};
        res.json({ success: true, cartData });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "An error occurred while fetching the cart data" });
    }
};
exports.getUserCart = getUserCart;
