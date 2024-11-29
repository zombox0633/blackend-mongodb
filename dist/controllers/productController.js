"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleProduct = exports.removeProduct = exports.addProduct = exports.listProducts = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
// Function to add a product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller, } = req.body;
        // Extract and validate uploaded images
        // const image1 = (req.files?.image1 as MulterFile[])?.[0];
        // const image2 = (req.files?.image2 as MulterFile[])?.[0];
        // const image3 = (req.files?.image3 as MulterFile[])?.[0];
        // const image4 = (req.files?.image4 as MulterFile[])?.[0];
        // const images = [image1, image2, image3, image4].filter(
        //   (item): item is MulterFile => item !== undefined
        // );
        // Upload images to Cloudinary
        // const imagesUrl = await Promise.all(
        //   images.map(async (item) => {
        //     const result = await cloudinary.uploader.upload(item.path, {
        //       resource_type: "image",
        //     });
        //     return result.secure_url;
        //   })
        // );
        // Prepare product data
        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true",
            sizes: JSON.parse(sizes),
            image: "imagesUrl",
            date: new Date(),
        };
        console.log(productData);
        const product = new productModel_1.default(productData);
        await product.save();
        res.json({ success: true, message: "Product Added" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while adding the product.",
        });
    }
};
exports.addProduct = addProduct;
// Function to list products
const listProducts = async (req, res) => {
    try {
        const products = await productModel_1.default.find({});
        res.json({ success: true, products });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching products.",
        });
    }
};
exports.listProducts = listProducts;
// Function to remove a product
const removeProduct = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            res.status(400).json({ success: false, message: "Product ID is required." });
            return;
        }
        await productModel_1.default.findByIdAndDelete(id);
        res.json({ success: true, message: "Product Removed" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while removing the product.",
        });
    }
};
exports.removeProduct = removeProduct;
// Function for single product info
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            res.status(400).json({ success: false, message: "Product ID is required." });
            return;
        }
        const product = await productModel_1.default.findById(productId);
        if (!product) {
            res.status(404).json({ success: false, message: "Product not found." });
            return;
        }
        res.json({ success: true, product });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching the product.",
        });
    }
};
exports.singleProduct = singleProduct;
