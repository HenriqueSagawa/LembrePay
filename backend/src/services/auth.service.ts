import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository.js";
import type { Prisma } from "../generated/prisma/client.js";

const userRepository = new UserRepository();

export class AuthService {
  async register(name: string, email: string, password: string) {
    const userExists = await userRepository.findByEmail(email);

    if (userExists) {
      throw new Error("Esse email já exister");
    }

    const hashPasword = await bcrypt.hash(password, 10);

    const user = await userRepository.create({
      name: name,
      email: email,
      password: hashPasword,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Credenciais inválidas");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Credenciais inválidas");
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" },
    );

    return {
      token,
    };
  }
}
