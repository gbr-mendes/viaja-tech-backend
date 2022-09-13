const controller = require("../controllers/businessController");
const express = require("express");
const router = express.Router();

router.get("/append-visite/:userId", controller.appendVisite);
module.exports = router;
