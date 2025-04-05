import { PopulateOptions } from 'mongoose';
import { GenericRepository } from '../types/repository.types.ts';
import { ExampleType } from '../models/example.model.ts';

type ExampleRepoType = GenericRepository<ExampleType> & {
  findAndPopulate: (filter: Partial<ExampleType>) => Promise<ExampleType[]>;
};

const repository: Partial<ExampleRepoType> = {
  bootstrap
};

function bootstrap<T extends GenericRepository<ExampleType>>(
  repoFactory: (model: unknown) => T,
  model: unknown
): void {
  const baseRepo = repoFactory(model);
  Object.assign(repository, baseRepo);

  // Specific methods
  const fields: PopulateOptions[] = [
    { path: 'user', select: 'fullName' }
  ];
  repository.findAndPopulate = async (filter) => {
    const results = await baseRepo.find(filter);
    return baseRepo.populate(results, fields);
  };
}

export default repository as ExampleRepoType;
