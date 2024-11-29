import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
  id: string;
  email: string;
  [key: string]: any;
}

const adminAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({
        success: false,
        message: "Not Authorized. Please log in again.",
      });
      return;
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    const isAdmin =
      decodedToken.email === process.env.ADMIN_EMAIL &&
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
  } catch (error) {
    console.error(error);
    res.status(401).json({
      success: false,
      message: "Invalid token. Please log in again.",
    });
    return; // End middleware execution
  }
};

export default adminAuth;
