import express from "express";
import { allOrders, placeOrderStripe, updateStatus, userOrders, verifyStripe } from "../controllers/orderController";
import adminAuth from "../middlewares/adminAuth";
import authUser from "../middlewares/auth";



const orderRouter = express.Router();

// Admin Features
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);

// Payment Features
orderRouter.post("/stripe", authUser, placeOrderStripe);

// User Feature
orderRouter.post("/userorders", authUser, userOrders);

// verify payment
orderRouter.post("/verifyStripe", authUser, verifyStripe);

export default orderRouter;