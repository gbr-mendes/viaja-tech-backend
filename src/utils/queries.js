const utils = {};

// Models
const UserModel = require("../models/userSchema");

const getModelCount = async (model) => {
  const count = await model.count();
  return count;
};

utils.paginatedQuery = async (
  model,
  route,
  limit = 5,
  page = 1,
  resp,
  queryFields,
  queryBuilder = null,
  userFields
) => {
  const total = await getModelCount(model);
  const results = {};
  results.next = null;

  limit = Number.parseInt(limit);
  page = Number.parseInt(page);

  const query = await model
    .find({})
    .limit(limit)
    .skip((page - 1) * limit)
    .select(queryFields ? queryFields : []);

  if (total > page * limit) {
    results.next = `${process.env.HOST}/${route}?page=${
      page + 1
    }&limit=${limit}`;
  }

  results.total = total;
  results.results = queryBuilder
    ? await queryBuilder(
        query,
        userFields
          ? userFields
          : ["-__v", "-password", "-notfications", "-role"]
      )
    : query;

  return resp.status(200).json(results);
};

utils.queryBuilderBasedOnUser = async (baseQuery, userFields) => {
  // Function to build a query with the user info, based on a query by an especific class of user like Employee, Leads or clients
  const results = await Promise.all(
    baseQuery.map(async (item) => {
      const { userId } = item;
      const userData = await UserModel.findById(userId).select(userFields);
      if (userData.isActive) {
        const result = { ...userData.toObject(), ...item.toObject() };
        return result;
      }
    })
  );
  return results;
};

module.exports = utils;
