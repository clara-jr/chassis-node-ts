export interface GenericRepository<T> {
  bootstrap: (repositoryImpl: (model: unknown) => GenericRepository<T>, model: unknown) => void;
  create: (data: Partial<T>) => Promise<T>;
  getAll: () => Promise<T[]>;
  find: (filter?: unknown) => Promise<T[]>;
  findOne: (filter: unknown) => Promise<T | null>;
  findById: (id: string) => Promise<T | null>;
  findOneAndUpdate: (filter: unknown, update: unknown, options?: unknown) => Promise<T | null>;
  findByIdAndUpdate: (id: string, update: unknown, options?: unknown) => Promise<T | null>;
  deleteOne: (filter: unknown) => Promise<{ deletedCount?: number }>;
  deleteMany: (filter: unknown) => Promise<{ deletedCount?: number }>;
  populate: (docs: unknown[], fields: unknown) => Promise<T[]>;
}
