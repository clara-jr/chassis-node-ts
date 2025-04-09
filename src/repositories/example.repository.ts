import { PopulateOptions } from 'mongoose';
import { GenericRepository, Populated } from '../types/repository.types.ts';
import { ExampleType } from '../models/example.model.ts';

type ExampleRepoType = GenericRepository<ExampleType> & {
  findAndPopulate: (filter: Partial<ExampleType>) => Promise<Populated<ExampleType, PopulatedProperties>[]>;
};

type PopulatedProperties = {
  user: {
    fullName: string
  }
}

const repository: ExampleRepoType = {
  bootstrap: (repoImpl: (Model: unknown) => GenericRepository<ExampleType>, Model: unknown): void => {
    Object.assign(repository, repoImpl(Model));
  },
  // Specific methods
  findAndPopulate: async (filter: Partial<ExampleType>): Promise<Populated<ExampleType, PopulatedProperties>[]> => {
    const fields: PopulateOptions[] = [
      { path: 'user', select: 'fullName' }
    ];
    const results = await repository.find(filter);
    return repository.populate<PopulatedProperties>(results, fields);
  }
} as ExampleRepoType;

export default repository;
