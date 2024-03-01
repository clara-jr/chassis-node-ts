import { Request, Response } from 'express';
import Service from '../services/service.js';

async function getAll(_req: Request, res: Response) {
  const data = await Service.getAll();
  res.status(200).json(data);
}

export default {
  getAll,
};