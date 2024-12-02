import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel";

interface MulterFile {
  path: string;
}

const addProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    // Type assertion for req.files
    const files = req.files as { [fieldname: string]: MulterFile[] };

    // Extract and validate uploaded images
    const image1 = files?.image1?.[0];
    const image2 = files?.image2?.[0];
    const image3 = files?.image3?.[0];
    const image4 = files?.image4?.[0];

    const images = [image1, image2, image3, image4].filter(
      (item): item is MulterFile => item !== undefined
    );

    // Upload images to Cloudinary
    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    // Prepare product data
    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === "true",
      sizes: JSON.parse(sizes),
      image: imagesUrl,
      date: new Date(),
    };

    console.log(productData);

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while adding the product.",
    });
  }
};

// Function to list products
const listProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching products.",
    });
  }
};

// Function to remove a product
const removeProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.body;
    if (!id) {
      res.status(400).json({ success: false, message: "Product ID is required." });
      return;
    }

    await productModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while removing the product.",
    });
  }
};

// Function for single product info
const singleProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.body;
    if (!productId) {
      res.status(400).json({ success: false, message: "Product ID is required." });
      return;
    }

    const product = await productModel.findById(productId);
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found." });
      return;
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the product.",
    });
  }
};

export { listProducts, addProduct, removeProduct, singleProduct };