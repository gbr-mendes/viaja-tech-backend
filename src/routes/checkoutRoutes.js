const express = require("express");
const router = express.Router();
const controller = require("../controllers/checkoutController");

// middlewares
const { authenticationRequired } = require("../middlewares/authMiddlewares");

router.get("/checkout/:packageId", authenticationRequired, controller.checkOut);

module.exports = router;
