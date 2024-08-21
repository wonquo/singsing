const purchaseModel = require("../models/purchase");

//거래처 정보 조회 핸들러
function getPurchase(req, res) {
  const params = {
    business_id: req.query.business_id,
    vendor_name: req.query.vendor_name,
    //req.query.from_date 는 Wed, 17 Apr 2024 15:09:11 GMT 이다,  2024-04-17 변환 필요
    from_date: formatDate(req.query.from_date),
    to_date: formatDate(req.query.to_date),
  };

  purchaseModel.getPurchase(params, (error, purchase) => {
    if (error) {
      return res.status(500).json({ message: "조회에 실패했습니다." });
    }
    res.json(purchase);
  });
}

//거래처 정보 생성 핸들러
function createPurchase(req, res) {
  const purchase = req.body;

  purchase.issue_date = formatDate(purchase.issue_date);

  purchaseModel.createPurchase(purchase, (error, purchase_id) => {
    if (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "중복된 데이터 입니다." });
      } else {
        return res.status(500).json({ message: "데이터 생성에 실패했습니다." });
      }
    }
    res.status(201).json({ purchase_id: purchase_id });
  });
}

//거래처 정보 업데이트 핸들러
function updatePurchase(req, res) {
  const purchase_id = req.params.purchase_id;
  const updatedPurchase = req.body;
  //updatedPurchase.total_amount 쉼표 제거
  if (typeof updatedPurchase.total_amount === "string") {
    updatedPurchase.total_amount = updatedPurchase.total_amount.replace(
      /,/g,
      ""
    );
  }
  updatedPurchase.issue_date = formatDate(updatedPurchase.issue_date);

  purchaseModel.updatePurchase(
    purchase_id,
    updatedPurchase,
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

function deletePurchase(req, res) {
  const purchase_id = req.params.purchase_id;
  purchaseModel.deletePurchase(purchase_id, (error, affectedRows) => {
    if (error) {
      return res.status(500).json({ message: "삭제에 실패했습니다." });
    }
    if (affectedRows === 0) {
      return res.status(404).json({ message: "데이터를 찾을 수 없습니다." });
    }
    res.json({ message: "정상적으로 삭제되었습니다." });
  });
}
function getPurchaseVendor(req, res) {
  purchaseModel.getPurchaseVendor((error, vendor) => {
    if (error) {
      return res.status(500).json({ message: "조회에 실패했습니다." });
    }
    res.json(vendor);
  });
}

function formatDate(dateString) {
  // Date 객체로 변환
  const date = new Date(dateString);

  // 한국 시간대로 설정
  const koreaTimeZoneOffset = 9 * 60; // 한국은 UTC+9
  const koreaTimezoneOffsetMs = koreaTimeZoneOffset * 60 * 1000;
  const koreaTime = new Date(date.getTime() + koreaTimezoneOffsetMs);

  // YYYY-MM-DD 형식의 문자열로 변환
  const year = koreaTime.getUTCFullYear();
  const month = String(koreaTime.getUTCMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더하고 문자열로 변환합니다.
  const day = String(koreaTime.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

module.exports = {
  getPurchase,
  createPurchase,
  updatePurchase,
  deletePurchase,
  getPurchaseVendor,
};
