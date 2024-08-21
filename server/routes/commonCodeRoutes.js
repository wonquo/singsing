const express = require("express");
const router = express.Router();
const commonCodeController = require("../controllers/commonCodeController");

router.get("/master/:id?", commonCodeController.getCommonCodeMaster);
router.get("/detail/:master_id?", commonCodeController.getCommonCodeDetail);
router.post("/master", commonCodeController.createCommonCodeMaster);
router.post("/detail", commonCodeController.createCommonCodeDetail);
router.put("/master/:master_id", commonCodeController.updateCommonCodeMaster);
router.put("/detail/:detail_id", commonCodeController.updateCommonCodeDetail);
router.delete(
  "/master/:master_id",
  commonCodeController.deleteCommonCodeMaster
);
router.delete(
  "/detail/:detail_id",
  commonCodeController.deleteCommonCodeDetail
);

module.exports = router;
