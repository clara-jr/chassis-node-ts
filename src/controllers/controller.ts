import { Request, Response } from 'express';
import Service from '../services/service.ts';

async function getAll(_req: Request, res: Response) {
  const data = await Service.getAll();
  res.status(200).json(data);
}

export default {
  getAll,
};