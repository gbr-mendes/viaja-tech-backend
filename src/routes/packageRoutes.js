const express = require("express");
const router = express.Router();
const packageController = require("../controllers/packageController");

router.get("/", packageController.getPackages);
router.get("/:packageId", packageController.getPackageById);
router.post("/", packageController.createPackage);
router.patch("/:packageId", packageController.updatePackage);
router.delete("/:packageId", packageController.deletePackage);

module.exports = router;
