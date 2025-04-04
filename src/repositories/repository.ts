import { Model, ModelType } from '../models/model.ts';

/**
 * Retrieves all items from the database.
 * @returns {Promise<Array>} A promise that resolves to an array of items.
 */
async function getAll() {
  return Model.find();
}

/**
 * Creates a new item in the database.
 * @param {*} data The data for the new item.
 * @returns {Promise<Object>} A promise that resolves to the created item.
 */
async function create(data: ModelType) {
  return Model.create(data);
}

export default {
  getAll,
  create,
};
