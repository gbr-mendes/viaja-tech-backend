const jwt = require("jsonwebtoken");
const clientSchema = require("../models/clientSchema");
const packageSchema = require("../models/packageSchema");
const userSchema = require("../models/userSchema");
const { getToken } = require("../utils/users");

const SaleModel = require("../models/saleSchema");
const leadSchema = require("../models/leadSchema");

const controller = {};
controller.checkOut = async (req, resp) => {
  try {
    const { packageId, qtdDays } = req.params;
    const token = getToken(req);
    const { _id: userId, role } = jwt.verify(token, process.env.TOKEN_SECRET);
    const { valuePerDay, title: packageTitle } = await packageSchema.findById(
      packageId
    );
    const purchaseValue = qtdDays * valuePerDay;

    const saleData = { userId, packageId, qtdDays, purchaseValue };
    const sale = await SaleModel.create(saleData);
    if (sale) {
      if (role == "isLead") {
        const { websiteVisits, _id: leadId } = await leadSchema.findOne({
          userId,
        });
        const clientData = {
          userId,
          spending: purchaseValue,
          websiteVisits,
          destinationsVisited: [packageTitle],
        };
        await clientSchema.create(clientData);
        await leadSchema.findByIdAndDelete(leadId);
        await userSchema.findByIdAndUpdate(userId, { role: "isClient" });
      } else if (role == "isClient") {
        const {
          spending,
          destinationsVisited,
          _id: clientId,
        } = await clientSchema.findOne({
          userId,
        });
        if (!destinationsVisited.includes(packageTitle)) {
          destinationsVisited.push(packageTitle);
        }
        const clientData = {
          spending: purchaseValue + spending,
          destinationsVisited,
        };
        await clientSchema.findByIdAndUpdate(clientId, clientData);
      }
      return resp.status(200).json({ success: "Compra realizada com sucesso" });
    }
    return resp
      .status(500)
      .json({ error: "Ocorreu um erro ao realizar a venda" });
  } catch (err) {
    console.log(err);
    return resp.status(500).json({ error: "Ocorreu um erro inesperado" });
  }
};

module.exports = controller;
