import supertest from 'supertest';
import { expect } from 'chai';
import { ObjectId } from 'mongodb';

import server from '../src/server.ts';

import { Model } from '../src/models/model.ts';

// Coverage with c8 and tsx is not working, it always reports as 100%.
// Find tsx related issue here: https://github.com/privatenumber/tsx/issues/433

describe('Test', () => {
  afterEach(async () => {
    await Model.deleteMany({});
  });
  describe('GET /', () => {
    const model = { index: new ObjectId() };
    beforeEach(async () => {
      await Model.create(model);
    });
    it('should respond with 200 OK', async () => {
      const res = await supertest(server.app).get('/');
      expect(res.status).to.equal(200);
      expect(res.body).to.have.length(1);
      expect(res.body[0].index.toString()).to.equal(model.index.toString());
      expect(res.body[0].default).to.equal('default');
    });
  });
});
