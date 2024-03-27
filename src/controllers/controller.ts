import { Request, Response } from 'express';
import Service from '../services/service.ts';
import schema from '../dtos/dto.ts';

async function getAll(_req: Request, res: Response) {
  const data = await Service.getAll();
  res.status(200).json(data);
}

async function create(req: Request, res: Response) {
  const body = await schema.validateAsync(req.body);
  const data = await Service.create(body);
  res.status(201).json(data);
}

export default {
  getAll,
  create,
};
