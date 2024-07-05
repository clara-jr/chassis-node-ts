import { Request, Response } from 'express';
import AuthenticationService from '../services/authentication.service.ts';
import { Tokens } from '../services/jwt.service.ts';

function _setCookie(res: Response, { accessToken, refreshToken }: Tokens): void {
  const cookieOptions = {
    httpOnly: true, // avoid reading cookie with JavaScript in client side
    secure: !['dev', 'test'].includes(process.env.NODE_ENV || ''), // send cookie via HTTPS
    sameSite: 'strict' as const, // cookie is only available within the same domain
  };

  res.cookie('accessToken', accessToken, {
    ...cookieOptions,
    maxAge: 1000 * parseInt(process.env.ACCESSTOKEN_TTL || '3600') // 1h (in milliseconds)
  });
  if (refreshToken) {
    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 1000 * parseInt(process.env.REFRESHTOKEN_TTL || '86400'), // 1d (in milliseconds)
      path: '/auth/refresh', // avoid sending refreshToken in all requests but 'auth/refresh'
    });
  }
}

async function login(req: Request, res: Response) {
  const tokens = await AuthenticationService.login(req.body?.userName, req.body?.password);
  _setCookie(res, tokens as Tokens);
  res.sendStatus(200);
}

async function refreshSession(req: Request, res: Response) {
  const tokens = await AuthenticationService.refreshSession(req.cookies?.refreshToken);
  _setCookie(res, tokens as Tokens);
  res.sendStatus(200);
}

async function logout(req: Request, res: Response) {
  await AuthenticationService.logout(req.cookies?.accessToken);

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.sendStatus(200);
}

export default {
  login,
  logout,
  refreshSession
};
