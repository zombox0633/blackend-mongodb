"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authUser = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(401).json({ success: false, message: "Not Authorized. Please log in again." });
        return;
    }
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.body.userId = decodedToken.id;
        next();
    }
    catch (error) {
        console.error(error);
        res.status(401).json({ success: false, message: "Invalid token. Please log in again." });
        return;
    }
};
exports.default = authUser;
