export interface GenericRepository<T> {
  bootstrap: (repositoryImpl: (model: unknown) => GenericRepository<T>, model: unknown) => void;
  create: (data: Partial<T>) => Promise<T>;
  getAll: () => Promise<T[]>;
  find: (filter?: Partial<T>) => Promise<T[]>;
  findOne: (filter: Partial<T>) => Promise<T | null>;
  findById: (id: string) => Promise<T | null>;
  findOneAndUpdate: (filter: Partial<T>, update: unknown, options?: unknown) => Promise<T | null>;
  findByIdAndUpdate: (id: string, update: unknown, options?: unknown) => Promise<T | null>;
  deleteOne: (filter: Partial<T>) => Promise<{ deletedCount?: number }>;
  deleteMany: (filter?: Partial<T>) => Promise<{ deletedCount?: number }>;
  populate: <P>(docs: unknown[], fields: unknown) => Promise<Populated<T, P>[]>;
}

export type Populated<T, P> = Omit<T, keyof P> & P;
