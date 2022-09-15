const userSchema = require("../models/userSchema");
const leadSchema = require("../models/leadSchema");
const clientSchema = require("../models/clientSchema");
const packageSchema = require("../models/packageSchema");
const controller = {};

controller.appendWebsiteVisite = async (req, resp) => {
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
        return resp.status(400).json({
          error: "Visitas são adicionadas apenas para leads e clientes",
        });
      }
    }
  } catch (error) {
    console.log(error);
    resp.status(500).json({ error: "Ocorreu um erro inesperado" });
  }
};

controller.appendDestinationViwed = async (req, resp) => {
  try {
    const { userId, packageId } = req.params;
    const { title: packageTitle } = await packageSchema.findById(packageId);
    if (!packageTitle) {
      return resp.status(400).json({ error: "Pacote não encontrado" });
    }
    const user = await userSchema.findById(userId);
    if (!user) {
      return resp.status(400).josn({ error: "Usuário não encontrado" });
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
        const { destinationsViewed } = await model
          .findOne({ userId })
          .select(["destinationsViewed"]);

        const packageViewed = destinationsViewed.find((obj) => {
          return obj["packageTitle"] == packageTitle;
        });
        if (packageViewed) {
          const destinationViewedIndex =
            destinationsViewed.indexOf(packageViewed);
          destinationsViewed[destinationViewedIndex] = {
            packageTitle,
            qtdViews: packageViewed.qtdViews + 1,
          };
        } else {
          destinationsViewed.push({
            packageTitle,
            qtdViews: 1,
          });
        }
        const mostViewedDestination = destinationsViewed.reduce(
          (previous, current) => {
            return current["qtdViews"] > previous["qtdViews"]
              ? current
              : previous;
          }
        );

        await model.updateOne(
          { userId },
          {
            destinationsViewed,
            mostViewedDestination: mostViewedDestination["packageTitle"],
          }
        );
      } else {
        return resp.status(400).json({
          error: "Visualizações são adicionadas apenas para leads e clientes",
        });
      }
    }
    resp.status(200).json({
      success: `Visualização ao destino com id ${packageId} adicionada com sucesso para o usuário ${userId}`,
    });
  } catch (error) {
    console.log(error);
    return resp.status(500).json({ error: "Ocorreu um erro inesperado" });
  }
};

module.exports = controller;
