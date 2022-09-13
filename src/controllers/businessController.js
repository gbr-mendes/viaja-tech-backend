const userSchema = require("../models/userSchema");
const leadSchema = require("../models/leadSchema");
const clientSchema = require("../models/clientSchema");
const controller = {};

controller.appendVisite = async (req, resp) => {
  try {
    const { userId } = req.params;
    const user = await userSchema.findById(userId);
    if (!user) {
      return resp.status(400).json({ error: "Usuário não encontrado" });
    }
    const { role } = user;
    if (role == "isLead" || role == "isClient") {
      let model = null;
      if (role == "isLead") {
        model = leadSchema;
      } else if (role == "isClient") {
        model = clientSchema;
      }
      if (model != null) {
        const { websiteVisits: totalVisites } = await model
          .findOne({ userId })
          .select(["websiteVisits"]);
        await leadSchema.findOneAndUpdate(
          { userId },
          { websiteVisits: totalVisites + 1 }
        );
        return resp.status(200).json({
          success: `Visita adicionada para o usuário com id ${userId}`,
        });
      } else {
        return resp
          .status(400)
          .json({
            error: "Visitas são adicionadas apenas para leads e clientes",
          });
      }
    }
  } catch (error) {
    console.log(error);
    resp.status(500).json({ error: "Ocorreu um erro inesperado" });
  }
};

module.exports = controller;
