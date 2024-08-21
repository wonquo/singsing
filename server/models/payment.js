const mysql = require("mysql");
const dbConfig = require("../dbConfig");
const connection = mysql.createConnection(dbConfig);

class paymentModel {
  /*        
payment_id
business_id
payment_name
remarks
*/
  constructor(
    payment_id,
    business_id,
    business_name,
    vendor_name,
    vendor_id,
    tax,
    payment_name,
    remarks
  ) {
    this.payment_id = payment_id;
    this.business_id = business_id;
    this.business_name = business_name;
    this.vendor_name = vendor_name;
    this.vendor_id = vendor_id;
    this.tax = tax;
    this.payment_name = payment_name;
    this.remarks = remarks;
  }
}

function getPayment(business_id, vendor_name, payment_name, callback) {
  let query = "/*getPayment*/";
  query += `
    SELECT payment_id,
           tb.business_name,
           tb.business_id, 
           tv.vendor_name,
           tv.vendor_id,
           tax,
           payment_name,
           tp.remarks
    FROM   tb_payment tp,
           tb_business tb,
           tb_vendor tv
    WHERE  tp.business_id = tb.business_id
    AND    tv.vendor_id = tp.vendor_id
    `;
  let params = [];
  if (!isNaN(business_id) && business_id !== "all") {
    query += " AND tp.business_id = ?";
    params.push(business_id);
  }
  if (payment_name) {
    query += " AND UPPER(payment_name) like UPPER(?)";
    params.push("%" + payment_name + "%");
  }
  if (vendor_name) {
    query += " AND UPPER(tv.vendor_name) like UPPER(?)";
    params.push("%" + vendor_name + "%");
  }

  console.log(connection.format(query, params));
  connection.query(query, params, (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to fetch payment: ", error);
      return callback(error);
    }
    const payment = results.map(
      (row) =>
        new paymentModel(
          row.payment_id,
          row.business_id,
          row.business_name,
          row.vendor_name,
          row.vendor_id,
          row.tax,
          row.payment_name,
          row.remarks
        )
    );
    callback(null, payment);
  });
}

function checkVendorExists(business_id, vendor_name, callback) {
  const query =
    "SELECT vendor_id FROM tb_vendor WHERE vendor_name = ? AND business_id = ?";

  console.log("/*checkVendorExists*/");
  console.log(connection.format(query, [vendor_name, business_id]));
  connection.query(query, [vendor_name, business_id], (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to check vendor: ", error);
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

function createPayment(payment, callback) {
  const query = `
      INSERT INTO tb_payment (
        business_id,
        vendor_id,
        tax,
        payment_name,
        remarks
      ) VALUES 
      (?, 
       ?,
        ?,
        ?,
       ?)
    `;

  const params = [
    payment.business_id,
    payment.vendor_id,
    payment.tax,
    payment.payment_name,
    payment.remarks,
  ];

  console.log("/*createPayments*/");
  console.log(connection.format(query, params));
  connection.query(query, params, (error, results) => {
    if (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return callback(error, null);
      } else {
        console.error("Failed to create payment: ", error);
        return callback(error, null);
      }
    }
    callback(null, results.insertId);
  });
}

//updatePayment
function updatePayment(payment_id, updatedPayment, callback) {
  const query = "UPDATE tb_payment SET ? WHERE payment_id = ?";
  console.log("/*updatePayment*/");
  console.log(connection.format(query, [updatedPayment, payment_id]));
  connection.query(query, [updatedPayment, payment_id], (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to update payment: ", error);
      return callback(error);
    }
    callback(null, results.affectedRows);
  });
}

//deletePayment
function deletePayment(payment_id, callback) {
  console.log("payment_id: ", payment_id);
  const query = "DELETE FROM tb_payment WHERE payment_id = ?";
  connection.query(query, payment_id, (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to delete payment: ", error);
      return callback(error);
    }
    callback(null, results.affectedRows);
  });
}

module.exports = {
  getPayment,
  checkVendorExists,
  createPayment,
  updatePayment,
  deletePayment,
};
