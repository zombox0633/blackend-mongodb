import { Request, Response } from "express";
import userModel from "../models/userModel";

interface CartData {
  [itemId: string]: {
    [size: string]: number;
  };
}

// Add products to the user's cart
const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, itemId, size } = req.body;

    if (!userId || !itemId || !size) {
      res.status(400).json({ success: false, message: "Missing required fields" });
      return;
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const cartData: CartData = userData.cartData || {};

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = { [size]: 1 };
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred while adding to cart" });
  }
};

// Update user cart
const updateCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, itemId, size, quantity } = req.body;

    if (!userId || !itemId || !size || quantity === undefined) {
      res.status(400).json({ success: false, message: "Missing required fields" });
      return;
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const cartData: CartData = userData.cartData || {};

    if (cartData[itemId]) {
      cartData[itemId][size] = quantity;
    } else {
      res.status(400).json({ success: false, message: "Item not found in cart" });
      return;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Missing required fields" });
  }
};

// Get user cart data
const getUserCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ success: false, message: "Missing required fields" });
      return;
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const cartData: CartData = userData.cartData || {};
    res.json({ success: true, cartData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred while fetching the cart data" });
  }
};

export { addToCart, updateCart, getUserCart };
