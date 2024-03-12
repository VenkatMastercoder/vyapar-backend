import { Request, Response, NextFunction } from "express";

export const sampleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json({ message: "Sample Message from Venkat Starter Template from Service - 2" });
  } catch (error) {
    next(error);
  }
};