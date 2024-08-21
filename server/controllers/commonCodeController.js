const commonCodeModel = require("../models/commonCode");

//마스터 코드 조회 핸들러
function getCommonCodeMaster(req, res) {
  const params = {
    code: req.query.code,
    name: req.query.name,
  };

  commonCodeModel.getCommonCodeMaster(params, (error, commonCodeMaster) => {
    if (error) {
      return res.status(500).json({ message: "조회에 실패했습니다." });
    }
    res.json(commonCodeMaster);
  });
}

//디테일 코드 조회 핸들러
function getCommonCodeDetail(req, res) {
  ///api/commonCode/detail/13
  const params = {
    master_id: req.params.master_id,
  };

  commonCodeModel.getCommonCodeDetail(params, (error, commonCodeDetail) => {
    if (error) {
      return res.status(500).json({ message: "조회에 실패했습니다." });
    }
    res.json(commonCodeDetail);
  });
}

//마스터 코드 생성 핸들러
function createCommonCodeMaster(req, res) {
  const commonCode = req.body;

  commonCodeModel.createCommonCodeMaster(commonCode, (error, commonCode_id) => {
    if (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "중복된 데이터 입니다." });
      } else {
        return res.status(500).json({ message: "데이터 생성에 실패했습니다." });
      }
    }
    res.status(201).json({ commonCode_id: commonCode_id });
  });
}

//디테일 코드 생성 핸들러
function createCommonCodeDetail(req, res) {
  const commonCode = req.body;

  commonCodeModel.createCommonCodeDetail(commonCode, (error, master_id) => {
    if (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "중복된 데이터 입니다." });
      } else {
        return res.status(500).json({ message: "데이터 생성에 실패했습니다." });
      }
    }
    res.status(201).json({ master_id: master_id });
  });
}

//마스터 코드 업데이트 핸들러
function updateCommonCodeMaster(req, res) {
  console.log(req.params);
  const master_id = req.params.master_id;
  const updatedCommonCodeMaster = req.body;

  commonCodeModel.updateCommonCodeMaster(
    master_id,
    updatedCommonCodeMaster,
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

//디테일 코드 업데이트 핸들러
function updateCommonCodeDetail(req, res) {
  const detail_id = req.params.detail_id;
  const updatedCommonCodeDetail = req.body;

  commonCodeModel.updateCommonCodeDetail(
    detail_id,
    updatedCommonCodeDetail,
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

//마스터 코드 삭제 핸들러
function deleteCommonCodeMaster(req, res) {
  const master_id = req.params.master_id;
  commonCodeModel.deleteCommonCodeMaster(master_id, (error, affectedRows) => {
    if (error) {
      return res.status(500).json({ message: "삭제에 실패했습니다." });
    }
    if (affectedRows === 0) {
      return res.status(404).json({ message: "데이터를 찾을 수 없습니다." });
    }
    res.json({ message: "정상적으로 삭제되었습니다." });
  });
}

//디테일 코드 삭제 핸들러
function deleteCommonCodeDetail(req, res) {
  const detail_id = req.params.detail_id;
  commonCodeModel.deleteCommonCodeDetail(detail_id, (error, affectedRows) => {
    if (error) {
      return res.status(500).json({ message: "삭제에 실패했습니다." });
    }
    if (affectedRows === 0) {
      return res.status(404).json({ message: "데이터를 찾을 수 없습니다." });
    }
    res.json({ message: "정상적으로 삭제되었습니다." });
  });
}

//공통코드 조회 핸들러
function getCommonCode(req, res) {
  const params = {
    master_code: req.query.master_code,
  };

  commonCodeModel.getCommonCode(params, (error, commonCode) => {
    if (error) {
      return res.status(500).json({ message: "조회에 실패했습니다." });
    }
    res.json(commonCode);
  });
}

module.exports = {
  getCommonCodeMaster,
  getCommonCodeDetail,
  createCommonCodeMaster,
  createCommonCodeDetail,
  updateCommonCodeMaster,
  updateCommonCodeDetail,
  deleteCommonCodeMaster,
  deleteCommonCodeDetail,
  getCommonCode,
};
