const express = require("express");
const router = express.Router();
const packageController = require("../controllers/packageController");

// middlewares
const { authenticationRequired } = require("../middlewares/authMiddlewares");
const { verifyPermission } = require("../middlewares/permissionsMiddleware");

router.get("/", packageController.getPackages);

router.get("/:packageId", packageController.getPackageById);

router.post(
  "/",
  authenticationRequired,
  verifyPermission(["isAdmin"]),
  packageController.createPackage
);

router.patch(
  "/:packageId",
  authenticationRequired,
  verifyPermission(["isAdmin"]),
  packageController.updatePackage
);

router.delete(
  "/:packageId",
  authenticationRequired,
  verifyPermission(["isAdmin"]),
  packageController.deletePackage
);

module.exports = router;
