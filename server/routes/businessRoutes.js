const express = require("express");
const router = express.Router();
const BusinessController = require("../controllers/businessController");

router.get("/:id?", BusinessController.getBusiness);
router.post("/insert", BusinessController.createBusiness);
router.put("/:business_id", BusinessController.updateBusiness);
router.delete("/:business_id", BusinessController.deleteBusiness);

module.exports = router;
