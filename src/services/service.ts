import { Model, ModelType } from '../models/model.ts';

async function getAll() {
  return Model.find();
}

async function create(data: ModelType) {
  return Model.create(data);
}

export default {
  getAll,
  create,
};
