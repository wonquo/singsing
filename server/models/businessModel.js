const mysql = require("mysql");
const dbConfig = require("../dbConfig");
const connection = mysql.createConnection(dbConfig);

class businessModel {
  constructor(business_id, business_code, business_name, business_number) {
    this.business_id = business_id;
    this.business_code = business_code;
    this.business_name = business_name;
    this.business_number = business_number;
  }
}

function getBusiness(
  business_id,
  business_code,
  business_name,
  business_number,
  callback
) {
  let query = "/*getBusiness*/";
  query += "SELECT * FROM tb_business";
  let params = [];
  query += " WHERE 1=1";
  if (business_code && business_id !== "all") {
    query += " AND UPPER(business_code) like UPPER(?)";
    params.push("%" + business_code + "%");
  }
  if (business_name) {
    query += " AND business_name like UPPER(?)";
    params.push("%" + business_name + "%");
  }
  if (business_number) {
    query += " AND business_number like UPPER(?)";
    params.push("%" + business_number + "%");
  }
  if (business_id) {
    query += " AND business_id like UPPER(?)";
    params.push("%" + business_id + "%");
  }

  console.log(connection.format(query, params));
  connection.query(query, params, (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to fetch business: ", error);
      return callback(error);
    }
    const business = results.map(
      (row) =>
        new businessModel(
          row.business_id,
          row.business_code,
          row.business_name,
          row.business_number
        )
    );
    callback(null, business);
  });
}

//createBusiness
function createBusiness(business, callback) {
  const query =
    "INSERT INTO tb_business (business_code, business_name, business_number) VALUES (?, ?, ?)";
  const params = [
    business.business_code,
    business.business_name,
    business.business_number,
  ];
  console.log("/*createBusinesss*/");
  console.log(connection.format(query, params));
  connection.query(query, params, (error, results) => {
    if (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return callback(error, null);
      } else {
        console.error("Failed to create business: ", error);
        return callback(error, null);
      }
    }
    callback(null, results.insertId);
  });
}

//updateBusiness
function updateBusiness(business_id, updatedBusiness, callback) {
  const query = "UPDATE tb_business SET ? WHERE business_id = ?";
  console.log("/*updateBusiness*/");
  console.log(connection.format(query, [updatedBusiness, business_id]));
  connection.query(query, [updatedBusiness, business_id], (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to update business: ", error);
      return callback(error);
    }
    callback(null, results.affectedRows);
  });
}

//deleteBusiness
function deleteBusiness(business_id, callback) {
  console.log("business_id: ", business_id);
  const query = "DELETE FROM tb_business WHERE business_id = ?";
  connection.query(query, business_id, (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to delete business: ", error);
      return callback(error);
    }
    callback(null, results.affectedRows);
  });
}

module.exports = {
  getBusiness,
  createBusiness,
  updateBusiness,
  deleteBusiness,
};
