const express = require("express");
const router = express.Router();
const purchaseController = require("../controllers/purchaseController");

router.get("/purchaseVendor", purchaseController.getPurchaseVendor);
router.get("/:id?", purchaseController.getPurchase);
router.post("/insert", purchaseController.createPurchase);
router.put("/:purchase_id", purchaseController.updatePurchase);
router.delete("/:purchase_id", purchaseController.deletePurchase);

module.exports = router;
