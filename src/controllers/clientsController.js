const ClientModel = require("../models/clientSchema");
const UserModel = require("../models/userSchema");
const { paginatedQuery, queryBuilderBasedOnUser } = require("../utils/queries");

const controller = {};

controller.getClients = async (req, resp) => {
  let { limit, page } = req.query;

  try {
    return paginatedQuery(
      ClientModel,
      "clients",
      limit,
      page,
      resp,
      (queryFields = ["-__v"]),
      (queryBuilder = queryBuilderBasedOnUser)
    );
  } catch (err) {
    console.log(err);
    return resp
      .status(500)
      .json({ error: "Ocorreu um erro ao recuperar as leads" });
  }
};

controller.getClientById = async (req, resp) => {
  const { clientId } = req.params;
  try {
    const client = await ClientModel.findById(clientId);
    if (!client) {
      return resp.status(404).json({ error: "Client not found" });
    }
    const { userId } = client;
    const userData = await UserModel.findById(userId).select([
      "name",
      "email",
      "cpf",
      "phone",
    ]);
    const payload = { ...client.toObject(), ...userData.toObject() };
    resp.status(200).json(payload);
  } catch (err) {
    console.log(err);
    resp.status(500).json({ erro: "Ocorreu um erro inesperado" });
  }
};

module.exports = controller;
