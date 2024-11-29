"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
    userId: { type: String, require: true },
    items: { type: Array, required: true },
    amount: { type: Number, require: true },
    address: { type: Object, require: true },
    status: { type: String, require: true, default: "Order Placed" },
    paymentMethod: { type: String, require: true },
    payment: { type: Boolean, require: true, default: false },
    date: { type: Number, require: true },
});
const orderModel = mongoose_1.default.models.order || mongoose_1.default.model("order", orderSchema);
exports.default = orderModel;
