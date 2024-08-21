const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");

router.get("/expenseVendor", expenseController.getExpenseVendor);
router.get("/expenseDash", expenseController.getExpenseDash);
router.get("/:id?", expenseController.getExpense);
router.post("/insert", expenseController.createExpense);
router.put("/:expense_id", expenseController.updateExpense);
router.delete("/:expense_id", expenseController.deleteExpense);

module.exports = router;
