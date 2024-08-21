const express = require("express");
const router = express.Router();
const SalesController = require("../controllers/salesController");

router.get("/monthlyByVendor", SalesController.getMonthlySalesByVendor);
router.get("/monthlyByBusiness", SalesController.getMonthlySalesByBusiness);
router.get("/vendorMonthly", SalesController.getVendorMonthlySales);
router.get("/monthly", SalesController.getMonthlySales);
router.get("/annualProfit", SalesController.getAnnualProfit); //[대시보드] 연간 이익
router.get("/annual", SalesController.getAnnualSales); //[대시보드] 연간 매출
router.get("/:id?", SalesController.getSales);
router.post("/insert", SalesController.createSales);
router.put("/:sales_id", SalesController.updateSales);
router.delete("/:sales_id", SalesController.deleteSales);

module.exports = router;
