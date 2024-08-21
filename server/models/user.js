const mysql = require("mysql");
const dbConfig = require("../dbConfig");
const connection = mysql.createConnection(dbConfig);

//연결 확인
connection.connect((error) => {
  if (error) {
    console.error("Failed to connect to the database.");
  } else {
    console.log("Connected to the database.");
  }
});

// 사용자 정보 모델
class User {
  constructor(user_id, id, name, password, auth) {
    this.user_id = user_id;
    this.id = id;
    this.name = name;
    this.password = password;
    this.auth = auth;
  }
}

// 사용자 정보를 가져오는 함수
function getUsers(id, auth, name, callback) {
  let query = "SELECT * FROM tb_user";
  let params = [];
  query += " WHERE 1=1";
  if (id) {
    query += " AND UPPER(id) like UPPER(?)";

    params.push("%" + id + "%");
  }
  if (auth) {
    query += " AND UPPER(auth) like UPPER(?)";
    params.push("%" + auth + "%");
  }
  if (name) {
    query += " AND UPPER(name) like UPPER(?)";
    params.push("%" + name + "%");
  }
  //console.log(connection.format(query, params));
  excuteQuery("getUsers", query, params, callback);
}

// 사용자 정보를 생성하는 함수
function createUser(user, callback) {
  const { name, id, password, auth } = user;
  excuteQuery(
    "createUser",
    "INSERT INTO tb_user (id, name, password, auth) VALUES (?, ?, ?, ?)",
    [id, name, password, auth],
    callback
  );
}

// 사용자 정보를 업데이트하는 함수
function updateUser(user_id, updatedUser, callback) {
  const { id, name, password, auth } = updatedUser;
  console.log("password: ", password);
  if (password === undefined || password === "") {
    excuteQuery(
      "updateUser",
      "UPDATE tb_user SET id = ?, name = ?, auth = ? WHERE user_id = ?",
      [id, name, auth, user_id],
      callback
    );
  } else {
    excuteQuery(
      "updateUser",
      "UPDATE tb_user SET id = ?, name = ?, password = ?, auth = ? WHERE user_id = ?",
      [id, name, password, auth, user_id],
      callback
    );
  }
}

// 사용자 정보를 삭제하는 함수
function deleteUser(user_id, callback) {
  excuteQuery(
    "deleteUser",
    "DELETE FROM tb_user WHERE user_id = ?",
    [user_id],
    callback
  );
}

//connection.query 전용 함수
function excuteQuery(id, query, params, callback) {
  console.log("query id: ", id);
  console.log(connection.format(query, params));
  connection.query(query, params, (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to fetch user: ", error);
      return callback(error);
    }
    if (id === "getUsers") {
      console.log(results);
      const users = results.map(
        (row) => new User(row.user_id, row.id, row.name, row.password, row.auth)
      );
      callback(null, users);
    } else {
      callback(null, results);
    }
  });
}

module.exports = {
  User,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
