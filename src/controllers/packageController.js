const mongoose = require("mongoose");

//models
const PackageModel = require("../models/packageSchema");
//validators
const {
  createPackageValidator,
  getPackageByIdValidator,
  updatePackageValidator,
} = require("../validators/packageValidator");
const controler = {};
//utils
const { paginatedQuery } = require("../utils/queries");

controler.createPackage = async (req, resp) => {
  const data = req.body;
  const { error } = createPackageValidator.validate(data);
  if (error) {
    const { message } = error.details[0];
    resp.status(400).json({ error: message });
    return;
  }
  try {
    const package = await PackageModel.create(data);
    if (package) {
      return resp.json({ success: "Pacote adicionado com sucesso" });
    }
    return resp
      .status(500)
      .json({ error: "Ocorreu um erro ao adicionar o pacote" });
  } catch (err) {
    console.log(err);
    return resp.status(500).json({ error: "Ocorreu um erro inesperado" });
  }
};

controler.getPackages = async (req, resp) => {
  const { limit, page } = req.query;
  const queryFields = ["-__v"];
  try {
    return paginatedQuery(
      PackageModel,
      "packages",
      limit,
      page,
      resp,
      queryFields
    );
  } catch (err) {
    console.log(err);
    return resp.status(500).json({ error: "Ocorreu um erro inesperado" });
  }
};

controler.getPackageById = async (req, resp) => {
  let { packageId } = req.params;
  const { error } = getPackageByIdValidator.validate({ packageId });
  if (error) {
    const { message } = error.details[0];
    resp.status(400).json({ error: message });
    return;
  }

  try {
    const package = await PackageModel.findById(packageId).select(["-__v"]);
    if (package) {
      return resp.json(package);
    }
    return resp.status(400).json({ error: "Pacote não encontrado" });
  } catch (err) {
    console.log(err);
    resp.status(500).json({ error: "Ocorreu um erro inesperado" });
  }
};

controler.updatePackage = async (req, resp) => {
  const data = req.body;
  const { packageId } = req.params;
  data.packageId = packageId;
  const { error } = updatePackageValidator.validate(data);
  if (error) {
    const { message } = error.details[0];
    resp.status(400).json({ error: message });
    return;
  }
  try {
    const package = await PackageModel.findById(packageId);
    if (!package) {
      return resp.status(400).json({ error: "Pacote não encontrado" });
    }

    const updatedPackage = await PackageModel.findByIdAndUpdate(
      packageId,
      data
    );
    if (updatedPackage) {
      return resp.json({ success: "Pacote atualizado com sucesso" });
    }
    return resp
      .status(500)
      .json({ error: "Ocorreu um erro ao atualizar o pacote" });
  } catch (err) {
    console.log(err);
    return resp.status(500).json({ error: "Ocorreu um erro inesperado" });
  }
};
controler.deletePackage = async (req, resp) => {
  let { packageId } = req.params;
  const { error } = getPackageByIdValidator.validate({ packageId });
  if (error) {
    const { message } = error.details[0];
    resp.status(400).json({ error: message });
    return;
  }

  try {
    await PackageModel.findByIdAndDelete(packageId).select(["-__v"]);
    return resp.json({ success: "Pacote deletado com sucesso" });
  } catch (err) {
    console.log(err);
    resp.status(500).json({ error: "Ocorreu um erro inesperado" });
  }
};

module.exports = controler;
