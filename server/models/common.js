//model/salesModel.js
const mysql = require("mysql");
const dbConfig = require("../dbConfig");
const connection = mysql.createConnection(dbConfig);

// 사업자가 존재하는지 확인
function getBusinessId(params, callback) {
  const { business_name } = params;
  const query = "SELECT business_id FROM tb_business WHERE business_name = ?";

  console.log("/*getBusinessId*/");
  console.log(connection.format(query, [business_name]));
  connection.query(query, [business_name], (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to get business: ", error);
      return callback(error); // Return error via callback
    }
    // Check if results exist and pass business_id back via callback
    if (results.length > 0) {
      const business_id = results[0].business_id;
      return callback(null, business_id);
    } else {
      return callback(null, null);
    }
  });
}

// 거래처가 존재하는지 확인
function getVendorId(params, callback) {
  const { business_id, vendor_name } = params;
  const query =
    "SELECT vendor_id FROM tb_vendor WHERE vendor_name = ? AND business_id = ?";

  console.log("/*getVendorId*/");
  console.log(connection.format(query, [vendor_name, business_id]));
  connection.query(query, [vendor_name, business_id], (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to get vendor: ", error);
      return callback(error); // Return error via callback
    }
    // Check if results exist and pass vendor_id back via callback
    if (results.length > 0) {
      const vendor_id = results[0].vendor_id;
      return callback(null, vendor_id);
    } else {
      return callback(null, null);
    }
  });
}

// 제품이 존재하는지 확인
function getProductId(params, callback) {
  console.log(params.business_id, params.product_name);
  const { business_id, product_name } = params;
  const query =
    "SELECT product_id FROM tb_product WHERE product_name = ? AND business_id = ?";

  console.log("/*getProductId*/");
  console.log(connection.format(query, [product_name, business_id]));
  connection.query(query, [product_name, business_id], (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to get product: ", error);
      return callback(error); // Return error via callback
    }
    // Check if results exist and pass product_id back via callback
    if (results.length > 0) {
      const product_id = results[0].product_id;
      return callback(null, product_id);
    } else {
      return callback(null, null);
    }
  });
}

// 결제수단이 존재하는지 확인
function getPaymentId(params, callback) {
  const query = `
    SELECT  payment_id 
    FROM    tb_payment tp
        ,   tb_vendor tv
    WHERE   tp.vendor_id = tp.vendor_id 
    AND     tp.payment_name = ? 
    AND     tp.tax = ? 
    AND     tp.business_id = ?
    AND 	  tv.vendor_name = ?
  `;

  console.log("/*getPaymentId*/");
  console.log(
    connection.format(query, [
      params.payment_name,
      params.tax,
      params.business_id,
      params.vendor_name,
    ])
  );
  connection.query(
    query,
    [params.payment_name, params.tax, params.business_id, params.vendor_name],
    (error, results) => {
      if (error) {
        console.log("Query error: ", query);
        console.error("Failed to get payment: ", error);
        return callback(error); // Return error via callback
      }
      // Check if results exist and pass payment_id back via callback
      if (results.length > 0) {
        const payment_id = results[0].payment_id;
        return callback(null, payment_id);
      } else {
        return callback(null, null);
      }
    }
  );
}

//master_code 와 detail_name 으로 detail_code를 가져옴
function getDetailCode(params, callback) {
  const { master_code, detail_name } = params;
  let query = "/*getCommonCode*/";
  query += `
    SELECT  cd.code,
            cd.name
    FROM   tb_code_master cm
    JOIN tb_code_detail cd ON cm.master_id = cd.master_id AND cd.name = ?
    WHERE  cm.code = ?
    `;

  console.log("/*getDetailCode*/");
  console.log(connection.format(query, [detail_name, master_code]));
  connection.query(query, [detail_name, master_code], (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to get detail_code: ", error);
      return callback(error); // Return error via callback
    }
    // Check if results exist and pass detail_code back via callback
    if (results.length > 0) {
      const detail_code = results[0].code;
      return callback(null, detail_code);
    } else {
      return callback(null, null);
    }
  });
}

module.exports = {
  getVendorId,
  getProductId,
  getPaymentId,
  getBusinessId,
  getDetailCode,
};
