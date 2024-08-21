const vendorModel = require("../models/vendor");
const { connect } = require("../routes/usersRoutes");

//거래처 정보 조회 핸들러
function getVendor(req, res) {
  const vendor_id = req.query.business_id;
  const vendor_name = req.query.vendor_name;
  const ceo = req.query.ceo;

  vendorModel.getVendor(vendor_id, vendor_name, ceo, (error, vendor) => {
    if (error) {
      return res.status(500).json({ message: "조회에 실패했습니다." });
    }
    res.json(vendor);
  });
}

//거래처 정보 생성 핸들러
function createVendor(req, res) {
  const vendor = req.body;
  vendorModel.createVendor(vendor, (error, vendor_id) => {
    if (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "중복된 데이터 입니다." });
      } else {
        return res.status(500).json({ message: "데이터 생성에 실패했습니다." });
      }
    }
    res.status(201).json({ vendor_id: vendor_id });
  });
}

//거래처 정보 업데이트 핸들러
function updateVendor(req, res) {
  const vendor_id = req.params.vendor_id;
  const updatedVendor = req.body;
  vendorModel.updateVendor(vendor_id, updatedVendor, (error, affectedRows) => {
    if (error) {
      return res.status(500).json({ message: "업데이트에 실패했습니다." });
    }
    if (affectedRows === 0) {
      return res.status(404).json({ message: "데이터를 찾을 수 없습니다." });
    }
    res.json({ message: "정상적으로 업데이트 되었습니다." });
  });
}

//거래처 정보 삭제 핸들러

function deleteVendor(req, res) {
  const vendor_id = req.params.vendor_id;
  vendorModel.deleteVendor(vendor_id, (error, affectedRows) => {
    if (error) {
      return res.status(500).json({ message: "삭제에 실패했습니다." });
    }
    if (affectedRows === 0) {
      return res.status(404).json({ message: "데이터를 찾을 수 없습니다." });
    }
    res.json({ message: "정상적으로 삭제 되었습니다." });
  });
}

module.exports = {
  getVendor,
  createVendor,
  updateVendor,
  deleteVendor,
};
