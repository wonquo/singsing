//loginController.js
const session = require("express-session");
const loginModel = require("../models/login");

//session을 통한 로그인
function login(req, res) {
  const { id, password } = req.body;
  //userInfo를 통해 계정정보를 가져옴

  loginModel.checkUser(id, password, (error, results) => {
    if (error) {
      console.error("로그인 중 에러 발생", error);
      return res
        .status(500)
        .json({ message: "에러가 발생했습니다. 관리자에게 문의하세요." });
    }
    if (results.idExists === false) {
      return res.status(400).json({ message: "등록되지 않은 아이디입니다." });
    }
    if (results.login === false) {
      return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
    }
    //session id 생성
    const sessionId = req.session.id;
    req.session.userId = id; // 세션에 userId를 저장
    res.json({ data: { id: id }, message: "ok" });
  });
}

//session을 통한 로그아웃
function logout(req, res) {
  if (!req.session.userId) {
    res.status(400).send({ data: null, message: "not authorized" });
  } else {
    req.session.destroy(); // 세션 삭제
    res.json({ data: null, message: "ok" });
  }
}
function userInfo(req, res) {
  if (!req.session.userId) {
    res
      .status(404)
      .send({ data: { id: req.session.userId }, message: "not authorized" });
  } else {
    res.json({ data: { id: req.session.userId }, message: "ok" });
  }
}

module.exports = {
  login,
  logout,
  userInfo,
};
// Path: models/login.js
