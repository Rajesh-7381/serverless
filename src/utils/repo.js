const { Op } = require("sequelize");

/**
 * Create
 */
const create = (model, payload, options = {}) => {
  return model.create(payload, options);
};

/**
 * Bulk Create
 */
const bulkCreate = (model, payload, options = {}) => {
  return model.bulkCreate(payload, options);
};

/**
 * Find One
 */
const findOne = (model, where = {}, options = {}) => {
  return model.findOne({
    where,
    ...options,
  });
};

/**
 * Find By Primary Key
 */
const findById = (model, id, options = {}) => {
  return model.findByPk(id, options);
};

/**
 * Find All
 */
const findAll = (model, where = {}, options = {}) => {
  return model.findAll({
    where,
    ...options,
  });
};

/**
 * Count
 */
const count = (model, where = {}, options = {}) => {
  return model.count({
    where,
    ...options,
  });
};

/**
 * Exists
 */
const exists = async (model, where = {}, options = {}) => {
  const total = await count(model, where, options);
  return total > 0;
};

/**
 * Update
 */
const update = (model, where, payload, options = {}) => {
  return model.update(payload, {
    where,
    ...options,
  });
};

/**
 * Delete
 */
const remove = (model, where, options = {}) => {
  return model.destroy({
    where,
    ...options,
  });
};

/**
 * Upsert
 */
const upsert = (model, payload, options = {}) => {
  return model.upsert(payload, options);
};

/**
 * Pagination
 */
const paginate = async (
  model,
  {
    page = 1,
    limit = 10,
    where = {},
    include = [],
    attributes,
    order = [["createdAt", "DESC"]],
    group,
    having,
    distinct = true,
    ...options
  }
) => {
  const offset = (page - 1) * limit;

  const result = await model.findAndCountAll({
    where,
    limit,
    offset,
    include,
    attributes,
    order,
    group,
    having,
    distinct,
    ...options,
  });

  return {
    rows: result.rows,
    total: result.count,
    page,
    limit,
    totalPages: Math.ceil(result.count / limit),
  };
};

/**
 * Increment
 */
const increment = (model, field, where, by = 1, options = {}) => {
  return model.increment(field, {
    by,
    where,
    ...options,
  });
};

/**
 * Decrement
 */
const decrement = (model, field, where, by = 1, options = {}) => {
  return model.decrement(field, {
    by,
    where,
    ...options,
  });
};

/**
 * Restore (Soft Delete)
 */
const restore = (model, where, options = {}) => {
  return model.restore({
    where,
    ...options,
  });
};

module.exports = {
  Op,
  create,
  bulkCreate,
  findOne,
  findById,
  findAll,
  count,
  exists,
  update,
  remove,
  upsert,
  paginate,
  increment,
  decrement,
  restore,
};