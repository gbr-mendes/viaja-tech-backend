//  models
const LeadModel = require("../models/leadSchema");
const UserModel = require("../models/userSchema");

// utils
const { paginatedQuery, queryBuilderBasedOnUser } = require("../utils/queries");

const controller = {};

// controlers definition
controller.getLeads = async (req, resp) => {
  let { limit, page } = req.query;

  try {
    return paginatedQuery(
      LeadModel,
      "leads",
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

controller.getLeadById = async (req, resp) => {
  const { leadId } = req.params;
  try {
    const lead = await LeadModel.findById(leadId);
    if (!lead) {
      return resp.status(404).json({ error: "Lead not found" });
    }
    const { userId } = lead;
    const userData = await UserModel.findById(userId).select([
      "name",
      "email",
      "cpf",
      "phone",
    ]);
    const payload = { ...lead.toObject(), ...userData.toObject() };
    resp.status(200).json(payload);
  } catch (err) {
    console.log(err);
    resp.status(500).json({ erro: "An error has ocurred" });
  }
};

module.exports = controller;
