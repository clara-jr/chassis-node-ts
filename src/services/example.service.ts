import exampleRepository from '../repositories/example.repository.ts';
import { ExampleType } from '../models/example.model.ts';

async function getAll() {
  return exampleRepository.getAll();
}

async function create(data: ExampleType) {
  return exampleRepository.create(data);
}

async function findAndPopulate(filter: Partial<ExampleType>) {
  return exampleRepository.findAndPopulate(filter);
}

export default {
  getAll,
  create,
  findAndPopulate
};
