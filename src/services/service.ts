import { Model } from '../models/model.js';

async function getAll() {
  return Model.find();
}

export default {
  getAll,
};
