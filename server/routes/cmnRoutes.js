const express = require("express");
const router = express.Router();
const commonCodeController = require("../controllers/commonCodeController");

router.get("/CommonCode/:id?", commonCodeController.getCommonCode);

module.exports = router;
