import repository from '../repositories/example.repository.ts';
import { ExampleType } from '../models/example.model.ts';

async function getAll() {
  return repository.getAll();
}

async function create(data: ExampleType) {
  return repository.create(data);
}

export default {
  getAll,
  create,
};
