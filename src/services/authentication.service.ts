import bcrypt from 'bcrypt';
import JWTService, { Tokens } from './jwt.service.ts';
import { ApiError } from '../middlewares/custom-error-handler.ts';

async function _getUser(): Promise<{ userName: string, password: string }> {
  // Mocked user (use a database collection instead)
  const user = {
    userName: process.env.USERNAME || 'username',
    password: await bcrypt.hash(process.env.PASSWORD || 'password', parseInt(process.env.SALT_ROUNDS || '10')),
  };
  return user;
}

/**
 * Login.
 * @param {string} userName Username to login.
 * @param {string} password Password to login.
 * @returns {Promise<Tokens>} A promise that resolves to a pair of tokens.
 */
async function login(userName: string, password: string): Promise<Tokens> {
  const user = await _getUser();
  const isValid = user.userName === userName && await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Invalid username or password.');
  }

  return JWTService.createToken({ userName });
}

/**
 * Extend access token.
 * @param {string} refreshToken Refresh token to extend access token.
 * @returns {Promise<Tokens>} A promise that resolves to a pair of tokens.
 */
async function refreshSession(refreshToken: string): Promise<Tokens> {
  return JWTService.extendToken(refreshToken);
}

/**
 * Logout.
 * @param {string} accessToken Token to be destroyed.
 * @returns {Promise<void>}
 */
async function logout(accessToken: string): Promise<void> {
  await JWTService.clearSessionData(accessToken);
}

export default {
  login,
  logout,
  refreshSession
};
