"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const adminAuth_1 = __importDefault(require("../middlewares/adminAuth"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const orderRouter = express_1.default.Router();
// Admin Features
orderRouter.post("/list", adminAuth_1.default, orderController_1.allOrders);
orderRouter.post("/status", adminAuth_1.default, orderController_1.updateStatus);
// Payment Features
orderRouter.post("/stripe", auth_1.default, orderController_1.placeOrderStripe);
// User Feature
orderRouter.post("/userorders", auth_1.default, orderController_1.userOrders);
// verify payment
orderRouter.post("/verifyStripe", auth_1.default, orderController_1.verifyStripe);
exports.default = orderRouter;
