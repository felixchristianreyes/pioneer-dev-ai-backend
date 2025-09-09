// middleware to check for a code

import { NextFunction, Request, Response } from "express";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const code = req.query.code as string;
  if (code !== process.env.PIONEER_DEV_AI_CODE) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};
