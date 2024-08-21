const express = require("express");
const router = express.Router();
const excelController = require("../controllers/excelController");

router.post("/upload", excelController.uploadExcel);

module.exports = router;
