const productModel = require("../models/product");
const { connect } = require("../routes/usersRoutes");

//조회 핸들러
function getProduct(req, res) {
  const product_name = req.query.product_name;
  const business_id = req.query.business_id;
  const product_code = req.query.product_code;

  productModel.getProduct(
    business_id,
    product_name,
    product_code,
    (error, product) => {
      if (error) {
        return res.status(500).json({ message: "조회에 실패했습니다." });
      }
      res.json(product);
    }
  );
}

//거래처 정보 생성 핸들러
function createProduct(req, res) {
  const product = req.body;
  productModel.createProduct(product, (error, product_id) => {
    if (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "중복된 데이터 입니다." });
      } else {
        return res.status(500).json({ message: "생성에 실패했습니다." });
      }
    }
    res.status(201).json({ product_id: product_id });
  });
}

//거래처 정보 업데이트 핸들러
function updateProduct(req, res) {
  const product_id = req.params.product_id;
  const updatedProduct = req.body;
  productModel.updateProduct(
    product_id,
    updatedProduct,
    (error, affectedRows) => {
      if (error) {
        if (error.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ message: "중복된 데이터 입니다." });
        } else {
          return res.status(500).json({ message: "업데이트에 실패했습니다." });
        }
      }
      if (affectedRows === 0) {
        return res.status(404).json({ message: "데이터를 찾을 수 없습니다." });
      }
      res.json({ message: "정상적으로 업데이트 되었습니다." });
    }
  );
}

//거래처 정보 삭제 핸들러

function deleteProduct(req, res) {
  const product_id = req.params.product_id;
  productModel.deleteProduct(product_id, (error, affectedRows) => {
    if (error) {
      return res.status(500).json({ message: "삭제에 실패했습니다." });
    }
    if (affectedRows === 0) {
      return resWq` `
        .status(404)
        .json({ message: "데이터를 찾을 수 없습니다." });
    }
    res.json({ message: "정상적으로 삭제되었습니다." });
  });
}

module.exports = {
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
