import supertest from 'supertest';
import { expect } from 'chai';

import server from '../src/server.js';

import JWTService from '../src/services/jwt.service.js';

describe('Test', () => {
  let accessToken, refreshToken;

  before(async () => {
    ({ accessToken, refreshToken } = await JWTService.createToken({ userName: 'test' }));
  });

  after(async () => {
    await JWTService.clearSessionData(accessToken);
  });

  describe('POST /auth/login', () => {
    describe('when userName or password are invalid', () => {
      it('should respond with 401 UNAUTHORIZED when userName or password are invalid', async () => {
        const res = await supertest(server.app).post('/auth/login').send({ userName: 'invalid', password: 'invalid' });
        expect(res.status).to.equal(401);
        expect(res.error).to.exist;
        expect(res.body.errorCode).to.equal('UNAUTHORIZED');
      });
    });
    describe('when userName and password are valid', () => {
      it('should respond with 200 OK', async () => {
        const res = await supertest(server.app).post('/auth/login').send({ userName: process.env.USERNAME, password: process.env.PASSWORD });
        expect(res.status).to.equal(200);
        const cookies = Array.isArray(res.headers['set-cookie']) ? res.headers['set-cookie'] : [];
        expect(cookies).to.have.length(2);
        expect(cookies.find(cookie => cookie.startsWith('accessToken')).split(';')[0].split('=')[1]).to.exist;
        expect(cookies.find(cookie => cookie.startsWith('refreshToken')).split(';')[0].split('=')[1]).to.exist;
      });
    });
  });

  describe('POST /auth/refresh', () => {
    describe('when refreshToken is invalid', () => {
      it('should respond with 401 UNAUTHORIZED', async () => {
        const res = await supertest(server.app).post('/auth/refresh').set('Cookie', ['refreshToken=invalid']);
        expect(res.status).to.equal(401);
        expect(res.error).to.exist;
        expect(res.body.errorCode).to.equal('UNAUTHORIZED');
      });
    });
    describe('when refreshToken is valid', () => {
      it('should respond with 200 OK', async () => {
        const res = await supertest(server.app).post('/auth/refresh').set('Cookie', [`refreshToken=${refreshToken}`]);
        expect(res.status).to.equal(200);
        const cookies = Array.isArray(res.headers['set-cookie']) ? res.headers['set-cookie'] : [];
        expect(cookies).to.have.length(2);
        expect(cookies.find(cookie => cookie.startsWith('accessToken')).split(';')[0].split('=')[1]).to.exist;
        expect(cookies.find(cookie => cookie.startsWith('refreshToken')).split(';')[0].split('=')[1]).to.exist;
      });
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout successfully and clear cookies', async () => {
      const res = await supertest(server.app).post('/auth/logout').set('Cookie', [`accessToken=${accessToken}`]);
      expect(res.status).to.equal(200);
      const cookies = Array.isArray(res.headers['set-cookie']) ? res.headers['set-cookie'] : [];
      expect(cookies).to.have.length(2);
      cookies.forEach(cookie => {
        if (cookie.startsWith('accessToken') || cookie.startsWith('refreshToken')) {
          expect(cookie).to.include('Expires=Thu, 01 Jan 1970 00:00:00 GMT');
        }
      });
    });
  });
});
