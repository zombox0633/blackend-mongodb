import express from "express";

import {
  addProduct,
  listProducts,
  removeProduct,
  singleProduct,
} from "../controllers/productController";
import adminAuth from "../middlewares/adminAuth";
import upload from "../middlewares/multer";

const productRouter = express.Router();

productRouter.post(
  "/add",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct
);
productRouter.post("/remove", adminAuth, removeProduct);
productRouter.post("/single", singleProduct);
productRouter.get("/list", listProducts);

export default productRouter;
