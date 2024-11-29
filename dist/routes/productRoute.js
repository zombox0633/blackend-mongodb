"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_js_1 = require("../controllers/productController.js");
const adminAuth_js_1 = __importDefault(require("../middlewares/adminAuth.js"));
const multer_js_1 = __importDefault(require("../middlewares/multer.js"));
const productRouter = express_1.default.Router();
productRouter.post("/add", adminAuth_js_1.default, multer_js_1.default.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
]), productController_js_1.addProduct);
productRouter.post("/remove", adminAuth_js_1.default, productController_js_1.removeProduct);
productRouter.post("/single", productController_js_1.singleProduct);
productRouter.get("/list", productController_js_1.listProducts);
exports.default = productRouter;
