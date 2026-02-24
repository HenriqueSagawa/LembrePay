import type { Request, Response, NextFunction } from "express"

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err)

  return res.status(400).json({
    message: err.message || "Internal server error"
  })
}