"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            res.status(401).json({
                success: false,
                message: "Not Authorized. Please log in again.",
            });
            return;
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const isAdmin = decodedToken.email === process.env.ADMIN_EMAIL &&
            decodedToken.password === process.env.ADMIN_PASSWORD;
        if (!isAdmin) {
            res.status(403).json({
                success: false,
                message: "Access Denied. Admin credentials required.",
            });
            return;
        }
        req.body.adminId = decodedToken.id;
        next();
    }
    catch (error) {
        console.error(error);
        res.status(401).json({
            success: false,
            message: "Invalid token. Please log in again.",
        });
        return; // End middleware execution
    }
};
exports.default = adminAuth;
