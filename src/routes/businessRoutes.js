const controller = require("../controllers/businessController");
const express = require("express");
const router = express.Router();

router.get("/append-visite/:userId", controller.appendWebsiteVisite);
router.get(
  "/append-view/:packageId/:userId",
  controller.appendDestinationViwed
);
module.exports = router;
