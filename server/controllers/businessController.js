const businessModel = require("../models/businessModel");
const { connect } = require("../routes/usersRoutes");

//사업자 정보 조회 핸들러
function getBusiness(req, res) {
  const business_id = req.query.business_id;
  const business_code = req.query.business_code;
  const business_name = req.query.business_name;
  const business_number = req.query.business_number;

  businessModel.getBusiness(
    business_id,
    business_code,
    business_name,
    business_number,
    (error, business) => {
      if (error) {
        return res
          .status(500)
          .json({ message: "사업자 정보 조회에 실패했습니다." });
      }
      res.json(business);
    }
  );
}

//사업자 정보 생성 핸들러
function createBusiness(req, res) {
  const business = req.body;
  businessModel.createBusiness(business, (error, business_id) => {
    if (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "중복된 사업자 정보입니다." });
      } else {
        return res
          .status(500)
          .json({ message: "사업자 정보 생성에 실패했습니다." });
      }
    }
    res.status(201).json({ business_id: business_id });
  });
}

//사업자 정보 업데이트 핸들러
function updateBusiness(req, res) {
  const business_id = req.params.business_id;
  const updatedBusiness = req.body;
  businessModel.updateBusiness(
    business_id,
    updatedBusiness,
    (error, affectedRows) => {
      if (error) {
        if (error.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ message: "중복된 사업자 정보입니다." });
        } else {
          return res
            .status(500)
            .json({ message: "사업자 정보 업데이트에 실패했습니다." });
        }
      }
      if (affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "사업자 정보를 찾을 수 없습니다." });
      }
      res.json({ message: "정상적으로 업데이트 되었습니다." });
    }
  );
}

//사업자 정보 삭제 핸들러

function deleteBusiness(req, res) {
  const business_id = req.params.business_id;
  businessModel.deleteBusiness(business_id, (error, affectedRows) => {
    if (error) {
      return res
        .status(500)
        .json({ message: "사업자 정보 삭제에 실패했습니다." });
    }
    if (affectedRows === 0) {
      return resWq` `
        .status(404)
        .json({ message: "사업자 정보를 찾을 수 없습니다." });
    }
    res.json({ message: "Business deleted successfully" });
  });
}

module.exports = {
  getBusiness,
  createBusiness,
  updateBusiness,
  deleteBusiness,
};
