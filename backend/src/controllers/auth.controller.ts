import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";

const authService = new AuthService();

export class AuthController {
    async register(req: Request, res: Response) {
        const { name, email, password } = registerSchema.parse(req.body);

        const user = await authService.register(name, email, password);
        
        return res.status(201).json(user);
    };

    async login(req: Request, res: Response) {
        const { email, password } = loginSchema.parse(req.body);

        const result = await authService.login(email, password);

        return res.json(result);
    }
}