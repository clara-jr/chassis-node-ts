import { Request, Response, NextFunction } from 'express';

import RedisService from '../services/redis.service.ts';
interface CustomRequest extends Request {
  jwtUser: { userName: string };
}

export default async function (req: CustomRequest, res: Response, next: NextFunction) {
  if (req.method !== 'GET') return next();

  const key = `chassis-node-js-${req.jwtUser.userName}-${req.originalUrl}`;

  try {
    const cachedData = await RedisService.get(key);
    if (cachedData) {
      const data = JSON.parse(cachedData);
      return res.status(data.status || 200).json(data);
    }
  } catch (error) {
    console.info('⚠️ Error getting data from cache');
    console.error(error);
  }

  const send = res.send;
  res.send = (body) => {
    try {
      const data = JSON.parse(body);
      RedisService.setex(key, data);
    } catch (error) {
      console.info('⚠️ Error parsing data');
      console.error(error);
    }
    return send.call(res, body);
  };

  next();
}