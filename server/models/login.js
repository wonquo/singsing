const mysql = require("mysql");
const dbConfig = require("../dbConfig");
const connection = mysql.createConnection(dbConfig);

function checkUser(id, password, callback) {
  // 데이터베이스가 선택되었으면 사용자 조회 쿼리 실행
  let query = "SELECT * FROM tb_user WHERE id = ?";
  let params = [id];
  connection.query(query, params, (error, results) => {
    if (error) {
      callback(error, null); // 에러 발생 시 콜백으로 에러 전달
    } else {
      if (results.length === 0) {
        // 결과가 없으면 idExsists를 0으로 설정하고 콜백 호출
        callback(null, { idExists: false });
      } else {
        // 결과가 있으면 결과를 확인하여 패스워드 일치 여부 확인
        const user = results[0];
        console.log(user);
        if (user.password === password) {
          // 패스워드가 일치하면 로그인 가능하다고 콜백 호출
          callback(null, { login: true });
        } else {
          // 패스워드가 일치하지 않으면 로그인 불가능하다고 콜백 호출
          callback(null, { login: false });
        }
      }
    }
  });
}
module.exports = {
  checkUser,
};
