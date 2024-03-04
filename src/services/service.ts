import { Model } from '../models/model.ts';

async function getAll() {
  return Model.find();
}

export default {
  getAll,
};
