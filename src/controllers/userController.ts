import { Request, Response } from "express";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel";

const createToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: "1h" });
};

// Route for user login
const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: "Missing required fields" });
      return;
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(404).json({ success: false, message: "User doesn't exist" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = createToken(user._id.toString());
      res.json({ success: true, token });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred during login" });
  }
};

// Route for user registration
const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: "Missing required fields" });
      return;
    }

    // Checking if the user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      res.status(409).json({ success: false, message: "User already exists" });
      return;
    }

    // Validating email format & password strength
    if (!validator.isEmail(email)) {
      res.status(400).json({ success: false, message: "Please enter a valid email" });
      return;
    }
    if (password.length < 8) {
      res.status(400).json({ success: false, message: "Please enter a strong password" });
      return;
    }

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });
    const user = await newUser.save();

    const token = createToken(user._id.toString());
    res.status(201).json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred during registration" });
  }
};

// Route for admin login
const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: "Missing required fields" });
      return;
    }

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: "1h" });
      res.json({ success: true, token });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred during admin login" });
  }
};

export { loginUser, registerUser, adminLogin };
