"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    name: { type: String, require: true },
    description: { type: String, required: true },
    price: { type: Number, require: true },
    image: { type: Array, require: true },
    category: { type: String, require: true },
    subCategory: { type: String, require: true },
    sizes: { type: Array, require: true },
    bestseller: { type: Boolean },
    date: { type: Number, require: true },
});
const productModel = mongoose_1.default.models.product || mongoose_1.default.model("product", productSchema);
exports.default = productModel;
