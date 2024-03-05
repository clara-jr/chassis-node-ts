import { Request, Response, NextFunction } from 'express';
import JWTService from '../services/jwt.service.ts';

export default async function authenticationHandler(req: Request, _res: Response, next: NextFunction) {
  const token = req.header('X-Auth-Token');
  try {
    const jwtUser = await JWTService.verifyToken(token);
    interface CustomRequest extends Request {
      jwtUser: { userName: string };
    }
    (req as CustomRequest).jwtUser = jwtUser;
    next();
  } catch (err) {
    next(err);
  }
}