import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
  id: string;
  [key: string]: any;
}

const authUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ success: false, message: "Not Authorized. Please log in again." });
    return;
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    req.body.userId = decodedToken.id;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: "Invalid token. Please log in again." });
    return;
  }
};

export default authUser;
