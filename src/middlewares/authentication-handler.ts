import { Request, Response, NextFunction } from 'express';
import JWTService from '../services/jwt.service.ts';

export default async function authenticationHandler(req: Request, _res: Response, next: NextFunction) {
  const unprotectedRoutes = process.env.UNPROTECTED_ROUTES?.split(',') || [];
  if (unprotectedRoutes.includes(req.path)) {
    return next();
  }
  const token = req.cookies?.accessToken;
  try {
    const { sessionData: jwtUser } = await JWTService.verifyToken(token);
    interface CustomRequest extends Request {
      jwtUser: { userName: string };
    }
    (req as CustomRequest).jwtUser = jwtUser;
    next();
  } catch (err) {
    next(err);
  }
}