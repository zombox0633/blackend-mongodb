"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLogin = exports.registerUser = exports.loginUser = void 0;
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const createToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};
// Route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, message: "Missing required fields" });
            return;
        }
        const user = await userModel_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ success: false, message: "User doesn't exist" });
            return;
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (isMatch) {
            const token = createToken(user._id.toString());
            res.json({ success: true, token });
        }
        else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "An error occurred during login" });
    }
};
exports.loginUser = loginUser;
// Route for user registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ success: false, message: "Missing required fields" });
            return;
        }
        // Checking if the user already exists
        const exists = await userModel_1.default.findOne({ email });
        if (exists) {
            res.status(409).json({ success: false, message: "User already exists" });
            return;
        }
        // Validating email format & password strength
        if (!validator_1.default.isEmail(email)) {
            res.status(400).json({ success: false, message: "Please enter a valid email" });
            return;
        }
        if (password.length < 8) {
            res.status(400).json({ success: false, message: "Please enter a strong password" });
            return;
        }
        // Hashing the password
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(password, salt);
        const newUser = new userModel_1.default({
            name,
            email,
            password: hashedPassword,
        });
        const user = await newUser.save();
        const token = createToken(user._id.toString());
        res.status(201).json({ success: true, token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "An error occurred during registration" });
    }
};
exports.registerUser = registerUser;
// Route for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, message: "Missing required fields" });
            return;
        }
        if (email === process.env.ADMIN_EMAIL &&
            password === process.env.ADMIN_PASSWORD) {
            const token = jsonwebtoken_1.default.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.json({ success: true, token });
        }
        else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "An error occurred during admin login" });
    }
};
exports.adminLogin = adminLogin;
