"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatus = exports.userOrders = exports.allOrders = exports.placeOrderStripe = exports.verifyStripe = void 0;
const orderModel_1 = __importDefault(require("../models/orderModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const stripe_1 = __importDefault(require("stripe"));
// Global variables
const currency = "thb";
const deliveryCharge = 10;
// Initialize Stripe
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
});
// Placing orders using Stripe
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const origin = req.headers.origin;
        if (!userId || !items || !amount || !address || !origin) {
            res.status(400).json({ success: false, message: "Missing required fields" });
            return;
        }
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            date: new Date(),
        };
        const newOrder = new orderModel_1.default(orderData);
        await newOrder.save();
        const line_items = items.map((item) => ({
            price_data: {
                currency,
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }));
        line_items.push({
            price_data: {
                currency,
                product_data: {
                    name: "Delivery Charges",
                },
                unit_amount: deliveryCharge * 100,
            },
            quantity: 1,
        });
        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: "payment",
        });
        res.json({ success: true, session_url: session.url });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to create order session" });
    }
};
exports.placeOrderStripe = placeOrderStripe;
// Verifying Stripe Payment
const verifyStripe = async (req, res) => {
    try {
        const { orderId, success, userId } = req.body;
        if (!orderId || !success || !userId) {
            res.status(400).json({ success: false, message: "Missing required fields" });
            return;
        }
        if (success === "true") {
            await orderModel_1.default.findByIdAndUpdate(orderId, { payment: true });
            await userModel_1.default.findByIdAndUpdate(userId, { cartData: {} });
            res.json({ success: true, message: "Payment verified and order updated" });
        }
        else {
            await orderModel_1.default.findByIdAndDelete(orderId);
            res.status(400).json({ success: false, message: "Payment failed, order canceled" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to verify payment" });
    }
};
exports.verifyStripe = verifyStripe;
// Fetch all orders (Admin Panel)
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel_1.default.find({});
        res.json({ success: true, orders });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch orders" });
    }
};
exports.allOrders = allOrders;
// Fetch user orders (Frontend)
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            res.status(400).json({ success: false, message: "User ID is required" });
            return;
        }
        const orders = await orderModel_1.default.find({ userId });
        res.json({ success: true, orders });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch user orders" });
    }
};
exports.userOrders = userOrders;
// Update order status (Admin Panel)
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        if (!orderId || !status) {
            res.status(400).json({ success: false, message: "Order ID and status are required" });
            return;
        }
        await orderModel_1.default.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: "Order status updated" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to update order status" });
    }
};
exports.updateStatus = updateStatus;
