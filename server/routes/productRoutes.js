const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/productController");

router.get("/:id?", ProductController.getProduct);
router.post("/insert", ProductController.createProduct);
router.put("/:product_id", ProductController.updateProduct);
router.delete("/:product_id", ProductController.deleteProduct);

module.exports = router;
