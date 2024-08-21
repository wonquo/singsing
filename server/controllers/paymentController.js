const paymentModel = require("../models/payment");

//거래처 정보 조회 핸들러
function getPayment(req, res) {
  const business_id = req.query.business_id;
  const payment_name =
    req.query.payment_name === "default" ? "" : req.query.payment_name; // "default" -> "
  const vendor_name = req.query.vendor_name;

  paymentModel.getPayment(
    business_id,
    vendor_name,
    payment_name,
    (error, payment) => {
      if (error) {
        return res.status(500).json({ message: "조회에 실패했습니다." });
      }
      res.json(payment);
    }
  );
}

//거래처 정보 생성 핸들러
function createPayment(req, res) {
  const payment = req.body;

  paymentModel.createPayment(payment, (error, payment_id) => {
    if (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "중복된 데이터 입니다." });
      } else {
        return res.status(500).json({ message: "데이터 생성에 실패했습니다." });
      }
    }
    res.status(201).json({ payment_id: payment_id });
  });
}

//거래처 정보 업데이트 핸들러
function updatePayment(req, res) {
  const payment_id = req.params.payment_id;
  const updatedPayment = req.body;

  paymentModel.updatePayment(
    payment_id,
    updatedPayment,
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

function deletePayment(req, res) {
  const payment_id = req.params.payment_id;
  paymentModel.deletePayment(payment_id, (error, affectedRows) => {
    if (error) {
      return res.status(500).json({ message: "삭제에 실패했습니다." });
    }
    if (affectedRows === 0) {
      return res.status(404).json({ message: "데이터를 찾을 수 없습니다." });
    }
    res.json({ message: "정상적으로 삭제되었습니다." });
  });
}

module.exports = {
  getPayment,
  createPayment,
  updatePayment,
  deletePayment,
};
