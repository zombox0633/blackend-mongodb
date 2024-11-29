"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const mongodb_1 = __importDefault(require("./config/mongodb"));
const conenctCloudinary_1 = __importDefault(require("./config/conenctCloudinary"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
(0, mongodb_1.default)();
(0, conenctCloudinary_1.default)();
const allowedOrigins = [
    "https://artnakkk-frontend-admin.vercel.app",
    "http://localhost:5175", // For local development
    "http://localhost:5176", // For local development
];
// Configure CORS
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g., mobile apps or curl)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true); // Allow the origin
        }
        else {
            callback(new Error("Not allowed by CORS")); // Block the origin
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow cookies or Authorization headers
}));
app.get("/", (req, res) => {
    res.send("API Working");
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
