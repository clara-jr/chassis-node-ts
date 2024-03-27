import supertest from 'supertest';
import { expect } from 'chai';
import { ObjectId } from 'mongodb';

import server from '../src/server.ts';

import { Model } from '../src/models/model.ts';
import JWTService from '../src/services/jwt.service.ts';

// Coverage with c8 and tsx is not working, it always reports as 100%.
// Find tsx related issue here: https://github.com/privatenumber/tsx/issues/433

describe('Test', () => {
  let token;

  before(async () => {
    token = await JWTService.createToken({ userName: 'test' });
  });

  after(async () => {
    await JWTService.clearSessionData(token);
  });

  afterEach(async () => {
    await Model.deleteMany({});
  });

  describe('GET /', () => {
    describe('when token is invalid', () => {
      it('should respond with 401 UNAUTHORIZED when token is invalid', async () => {
        const res = await supertest(server.app).get('/');
        expect(res.status).to.equal(401);
        expect(res.error).to.exist;
        expect(res.body.errorCode).to.equal('UNAUTHORIZED');
      });
    });
    describe('when token is valid', () => {
      const model = { index: new ObjectId('123456789123456789123456') };
      beforeEach(async () => {
        await Model.create(model);
      });
      it('should respond with 200 OK', async () => {
        const res = await supertest(server.app)
          .get('/')
          .set('X-Auth-Token', `${token}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.length(1);
        expect(res.body[0].index.toString()).to.equal(model.index.toString());
        expect(res.body[0].default).to.equal('default');
      });
    });
  });

  describe('POST /', () => {
    describe('when data is invalid', () => {
      it('should respond with 400 VALIDATION_ERROR', async () => {
        const res = await supertest(server.app)
          .post('/')
          .set('X-Auth-Token', `${token}`)
          .send({ index: 1 });
        expect(res.status).to.equal(400);
        expect(res.error).to.exist;
        expect(res.body.errorCode).to.equal('VALIDATION_ERROR');
      });
    });
    describe('when data is valid', () => {
      const model = { index: new ObjectId('123456789123456789123456') };
      it('should respond with 201 CREATED', async () => {
        const res = await supertest(server.app)
          .post('/')
          .set('X-Auth-Token', `${token}`)
          .send(model);
        expect(res.status).to.equal(201);
        expect(res.body.index.toString()).to.equal(model.index.toString());

        const object = await Model.findOne({ index: model.index });
        expect(object?.index.toString()).to.equal(model.index.toString());
      });
    });
  });
});
