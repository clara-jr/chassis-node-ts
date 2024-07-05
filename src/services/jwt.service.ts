import jwt from 'jsonwebtoken';
import { v4 as uuidv4, v5 as uuidv5 } from 'uuid';
import { ApiError } from '../middlewares/custom-error-handler.ts';
import RedisService from './redis.service.ts';

interface Session {
  jti: string
  sessionData: {
    userName: string
  }
}

export interface Tokens {
  accessToken: string;
  refreshToken?: string;
}

let sessionTTL: number;
let accessTokenTTL: number;
let refreshTokenTTL: number;
let jwtOptions: object;
let jwtSecret: string;
let uuidNamespace: string;

function bootstrap() {
  accessTokenTTL = parseInt(process.env.ACCESSTOKEN_TTL ?? '3600'); // access token expires in 1 hour
  refreshTokenTTL = parseInt(process.env.REFRESHTOKEN_TTL ?? '86400'); // refresh token expires in 1 day
  sessionTTL = refreshTokenTTL; // redis session expires in 1 day (it should be the same expiration as refresh token)
  jwtOptions = {
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
  };
  jwtSecret = process.env.JWT_SECRET || '';
  uuidNamespace = process.env.UUID_NAMESPACE || '';
}

async function verifyToken(jwToken: string | undefined): Promise<Session> {
  if (!jwToken) {
    throw new ApiError(401, 'UNAUTHORIZED', 'No token found.');
  }
  let jti;
  try {
    ({ jti } = jwt.verify(jwToken, jwtSecret, jwtOptions) as { jti: string });
  } catch (error) {
    throw new ApiError(401, 'UNAUTHORIZED', (error as Error).message);
  }
  const sessionData = await RedisService.get(`chassis-session:${jti}`);
  if (!sessionData) {
    throw new ApiError(401, 'UNAUTHORIZED', 'No session found.');
  }
  return { jti, sessionData: JSON.parse(sessionData) };
}

async function createToken(sessionData: object, jti?: string, shouldExtendRefreshToken: boolean = true): Promise<Tokens> {
  jti = jti ?? uuidv5(uuidv4(), uuidNamespace);
  const tokenData = {
    jti,
  };
  const accessToken = jwt.sign(tokenData, jwtSecret, { ...jwtOptions, expiresIn: accessTokenTTL }); // Access token expires in 1h
  if (!shouldExtendRefreshToken) return { accessToken };
  const refreshToken = jwt.sign(tokenData, jwtSecret, { ...jwtOptions, expiresIn: refreshTokenTTL }); // Refresh token expires in 1d
  await RedisService.setex(`chassis-session:${jti}`, sessionData, sessionTTL); // Extend redis key expiration
  return { accessToken, refreshToken };
}

async function extendToken(refreshToken: string): Promise<Tokens> {
  const { jti, sessionData } = await verifyToken(refreshToken);
  // Extend accessToken (and optionally refreshToken to work with larger sessions)
  return createToken(sessionData, jti);
}

async function clearSessionData(jwToken: string): Promise<void> {
  try {
    const { jti } = jwt.verify(jwToken, jwtSecret, jwtOptions) as { jti: string };
    await RedisService.del(`chassis-session:${jti}`);
  } catch (_) {
    // Session no longer exists
  }
}

export default {
  bootstrap,
  createToken,
  extendToken,
  verifyToken,
  clearSessionData
};