const jwt = require("jsonwebtoken");
const { getToken } = require("../utils/users");

const SaleModel = require("../models/saleSchema");

const controller = {};
controller.checkOut = async (req, resp) => {
  const { packageId } = req.params;
  const token = getToken(req);
  const { _id: userId } = jwt.verify(token, process.env.TOKEN_SECRET);

  const saleData = { userId, packageId };

  try {
    const sale = await SaleModel.create(saleData);
    if (sale) {
      return resp.status(201).json({ success: "Venda realizada com sucesso" });
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
