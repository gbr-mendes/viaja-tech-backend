const express = require("express");
const router = express.Router();
const controller = require("../controllers/checkoutController");

// middlewares
const { authenticationRequired } = require("../middlewares/authMiddlewares");
const { verifyPermission } = require("../middlewares/permissionsMiddleware");

router.get(
  "/:packageId/:qtdDays",
  authenticationRequired,
  verifyPermission(["isLead", "isClient"]),
  controller.checkOut
);

module.exports = router;
