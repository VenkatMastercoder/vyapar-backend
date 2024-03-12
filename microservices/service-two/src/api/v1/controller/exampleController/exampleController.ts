import { Request, Response, NextFunction } from "express";

export const exampleController = async (
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    next(error);
  }
};