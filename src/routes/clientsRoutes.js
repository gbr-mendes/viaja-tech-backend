const express = require("express");
const router = express.Router();

const controller = require("../controllers/clientsController");

// middlewares
const { authenticationRequired } = require("../middlewares/authMiddlewares");
const { verifyPermission } = require("../middlewares/permissionsMiddleware");

router.get(
  "/",
  authenticationRequired,
  verifyPermission(["isAdmin", "isSalesManager"]),
  controller.getClients
);

router.get(
  "/:clientId",
  authenticationRequired,
  verifyPermission(["isAdmin", "isSalesManager"]),
  controller.getClient
);

module.exports = router;
