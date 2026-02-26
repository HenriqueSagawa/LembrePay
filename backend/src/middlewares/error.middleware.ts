import type { Request, Response, NextFunction } from "express"
import { ZodError } from "zod"

export function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ZodError) {
    return res.status(422).json({
      message: "Dados inválidos",
      errors: err.issues.map((e: { path: any[]; message: any }) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    })
  }

  if (err instanceof Error) {
    console.error(`[AppError] ${err.message}`)

    return res.status(400).json({
      message: err.message,
    })
  }

  console.error("[UnknownError]", err)

  return res.status(500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Erro interno do servidor"
        : String(err),
  })
}