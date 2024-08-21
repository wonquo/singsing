const maria = require("mysql");

const conn = maria.createConnection({
  host: "higher.cafe24app.com",
  port: 3306,
  user: "hn02205",
  password: "higher2024@",
  database: "hn02205",
});

module.exports = conn;
