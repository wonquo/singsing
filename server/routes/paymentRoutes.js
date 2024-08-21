const express = require("express");
const router = express.Router();
const PaymentController = require("../controllers/paymentController");

router.get("/:id?", PaymentController.getPayment);
router.post("/insert", PaymentController.createPayment);
router.put("/:payment_id", PaymentController.updatePayment);
router.delete("/:payment_id", PaymentController.deletePayment);

module.exports = router;
