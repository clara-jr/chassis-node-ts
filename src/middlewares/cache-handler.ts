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
      return res.status(200).json(JSON.parse(cachedData));
    }
  } catch (error) {
    console.info('⚠️ Error getting data from cache');
    console.error(error);
  }

  const send = res.send;
  res.send = (body) => {
    try {
      const data = JSON.parse(body);
      if (!data.errorCode) RedisService.setex(key, data);
    } catch (error) {
      console.info('⚠️ Error parsing data');
      console.error(error);
    }
    return send.call(res, body);
  };

  next();
}