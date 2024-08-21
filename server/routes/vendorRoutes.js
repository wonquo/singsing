const express = require("express");
const router = express.Router();
const VendorController = require("../controllers/vendorController");

router.get("/:id?", VendorController.getVendor);
router.post("/insert", VendorController.createVendor);
router.put("/:vendor_id", VendorController.updateVendor);
router.delete("/:vendor_id", VendorController.deleteVendor);

module.exports = router;
