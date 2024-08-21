// controllers/userController.js

const UserModel = require("../models/user");

// 모든 사용자 정보를 가져오는 핸들러
function getUsers(req, res) {
  const id = req.query.id;
  const auth = req.query.auth;
  const name = req.query.name;
  UserModel.getUsers(id, auth, name, (error, user) => {
    if (error) {
      return res
        .status(500)
        .json({ message: "사용자 정보를 가져오는데 실패했습니다." });
    }
    res.json(user);
  });
}

// 새로운 사용자를 생성하는 핸들러
function createUser(req, res) {
  const user = req.body;
  UserModel.createUser(user, (error, userId) => {
    if (error) {
      //error code가 'ER_DUP_ENTRY'일 경우
      if (error.code === "ER_DUP_ENTRY") {
        return res
          .status(409)
          .json({ message: "중복된 사용자 아이디 입니다." });
      } else {
        return res.status(500).json({ message: "사용자 생성에 실패했습니다." });
      }
    }
    res.status(201).json({ id: userId });
  });
}

// 사용자 정보를 업데이트하는 핸들러
function updateUser(req, res) {
  const user_id = req.params.user_id;
  const updatedUser = req.body;
  UserModel.updateUser(user_id, updatedUser, (error, affectedRows) => {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "사용자 정보 업데이트에 실패했습니다." });
    }
    if (affectedRows === 0) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }
    res.json({ message: "User updated successfully" });
  });
}

// 사용자 정보를 삭제하는 핸들러
function deleteUser(req, res) {
  const user_id = req.params.user_id;
  UserModel.deleteUser(user_id, (error, affectedRows) => {
    if (error) {
      return res
        .status(500)
        .json({ message: "사용자 정보 삭제에 실패했습니다." });
    }
    if (affectedRows === 0) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }
    res.json({ message: "사용자 정보가 정상적으로 삭제되었습니다." });
  });
}

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
