import jwt from 'jsonwebtoken';
import { v4 as uuidv4, v5 as uuidv5 } from 'uuid';
import { ApiError } from '../middlewares/custom-error-handler.ts';
import IMDBService from './imdb.service.ts';

let sessionTTL: number;
let jwtOptions: object;
let jwtSecret: string;
let uuidNamespace: string;

function bootstrap() {
  sessionTTL = 60 * 60; // session expires in 1 h
  jwtOptions = {
    // To eliminate the need for a refresh token, we do not set a token expiration (expiresIn). Instead, we verify the existence of a Redis session.
    audience: 'chassis-node-js',
    issuer: 'chassis-node-js',
  };
  jwtSecret = process.env.JWT_SECRET || '';
  uuidNamespace = process.env.UUID_NAMESPACE || '';
}

async function verifyToken(jwToken: string | undefined) {
  if (!jwToken) {
    throw new ApiError(401, 'UNAUTHORIZED', 'No token found.');
  }
  let jti;
  try {
    ({ jti } = jwt.verify(jwToken, jwtSecret, jwtOptions) as { jti: string });
  } catch (error) {
    throw new ApiError(401, 'UNAUTHORIZED', (error as Error).message);
  }
  const sessionData = await IMDBService.get(`chassis-session:${jti}`);
  if (!sessionData) {
    throw new ApiError(401, 'UNAUTHORIZED', 'No session found.');
  }
  // Extend redis key expiration
  await IMDBService.setex(`chassis-session:${jti}`, JSON.parse(sessionData), sessionTTL);
  return JSON.parse(sessionData);
}

async function createToken(sessionData: object) {
  const jti = uuidv5(uuidv4(), uuidNamespace);
  const tokenData = {
    jti,
  };
  const token = jwt.sign(tokenData, jwtSecret, jwtOptions);
  await IMDBService.setex(`chassis-session:${jti}`, sessionData, sessionTTL);
  return token;
}

async function clearSessionData(jwToken: string) {
  try {
    const { jti } = jwt.verify(jwToken, jwtSecret, jwtOptions) as { jti: string };
    await IMDBService.del(`chassis-session:${jti}`);
  } catch (_) {
    // Session no longer exists
  }
}

export default {
  bootstrap,
  createToken,
  verifyToken,
  clearSessionData
};