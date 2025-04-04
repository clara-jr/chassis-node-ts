import repository from '../repositories/repository.ts';
import { ModelType } from '../models/model.ts';

async function getAll() {
  return repository.getAll();
}

async function create(data: ModelType) {
  return repository.create(data);
}

export default {
  getAll,
  create,
};
