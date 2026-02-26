import type { Request, Response } from "express";
import { SubscriptionService } from "../services/subscription.service.js";
import { createSubscriptionSchema } from "../schemas/subscription.schema.js";

const service = new SubscriptionService();

export class SubscriptionController {
  async create(req: Request, res: Response) {
    const data = createSubscriptionSchema.parse(req.body);

    const subscription = await service.create(req.userId!, data);

    return res.status(201).json(subscription);
  }

  async list(req: Request, res: Response) {
    const page = Math.max(1, Number(req.query["page"]) || 1);
    const pageSize = Math.min(
      100,
      Math.max(1, Number(req.query["pageSize"]) || 20),
    );
    const result = await service.list(req.userId!, page, pageSize);

    return res.json(result);
  }

  async deactivate(req: Request, res: Response) {
    await service.desactive(req.userId!, req.params.id as string);

    return res.status(204).send();
  }
}
