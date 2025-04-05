import { Model, FilterQuery, UpdateQuery, QueryOptions, PopulateOptions } from 'mongoose';

type Repository<T> = {
  create: (data: Partial<T>) => Promise<T>;
  getAll: () => Promise<T[]>;
  find: (filter?: FilterQuery<T>) => Promise<T[]>;
  findOne: (filter?: FilterQuery<T>) => Promise<T | null>;
  findById: (id: string) => Promise<T | null>;
  findOneAndUpdate: (filter: FilterQuery<T>, update: UpdateQuery<T>, options?: QueryOptions) => Promise<T | null>;
  findByIdAndUpdate: (id: string, update: UpdateQuery<T>, options?: QueryOptions) => Promise<T | null>;
  deleteOne: (filter: FilterQuery<T>) => Promise<{ deletedCount?: number }>;
  deleteMany: (filter: FilterQuery<T>) => Promise<{ deletedCount?: number }>;
  populate: (docs: T[], fields: PopulateOptions[]) => Promise<T[]>;
};

export default <T>(model: Model<T>): Repository<T> => {
  return {
    create: async (data) => model.create(data),
    getAll: async () => model.find().exec(),
    find: async (filter = {}) => model.find(filter).exec(),
    findOne: async (filter = {}) => model.findOne(filter).exec(),
    findById: async (id) => model.findById(id).exec(),
    findOneAndUpdate: async (filter, update, options) => model.findOneAndUpdate(filter, update, options).exec(),
    findByIdAndUpdate: async (id, update, options) => model.findByIdAndUpdate(id, update, options).exec(),
    deleteOne: async (filter) => model.deleteOne(filter),
    deleteMany: async (filter) => model.deleteMany(filter),
    populate: async (docs, fields) => model.populate(docs, fields),
  };
};
