import { prisma } from "../config/prisma.js";
import type { Prisma } from "../generated/prisma/client.js";

export class UserRepository {
    async findByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email }
        });
    };

    async findById(id: string) {
        return prisma.user.findUnique({
            where: { id }
        });
    };

    async create(data: Prisma.UserCreateInput) {
        return prisma.user.create({
            data
        });
    };
}