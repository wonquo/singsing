const mysql = require("mysql");
const dbConfig = require("../dbConfig");
const connection = mysql.createConnection(dbConfig);

class productModel {
  constructor(
    product_id,
    business_id,
    business_name,
    product_name,
    product_gubun,
    product_code,
    product_number,
    specification,
    unit,
    selling_price,
    product_description,
    remarks
  ) {
    this.product_id = product_id;
    this.business_id = business_id;
    this.business_name = business_name;
    this.product_name = product_name;
    this.product_gubun = product_gubun;
    this.product_code = product_code;
    this.product_number = product_number;
    this.specification = specification;
    this.unit = unit;
    this.selling_price = selling_price;
    this.product_description = product_description;
    this.remarks = remarks;
  }
}

function getProduct(business_id, product_name, product_code, callback) {
  let query = "/*getProduct*/";
  query += `
    SELECT product_id,
           tb.business_name,
           tb.business_id, 
           product_name, 
           product_gubun,
           product_code,
           product_number,
           specification,
           unit,
           selling_price,
           product_description,
           remarks
    FROM   tb_product tp,
           tb_business tb
    WHERE  tp.business_id = tb.business_id`;
  let params = [];
  if (business_id && business_id !== "all") {
    query += " AND tp.business_id = ?";
    params.push(business_id);
  }
  if (product_name) {
    query += " AND UPPER(tp.product_name) like UPPER(?)";
    params.push("%" + product_name + "%");
  }
  if (product_code) {
    query += " AND UPPER(tp.product_code) like UPPER(?)";
    params.push("%" + product_code + "%");
  }

  console.log(connection.format(query, params));
  connection.query(query, params, (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to fetch product: ", error);
      return callback(error);
    }
    const product = results.map(
      (row) =>
        new productModel(
          row.product_id,
          row.business_id,
          row.business_name,
          row.product_name,
          row.product_gubun,
          row.product_code,
          row.product_number,
          row.specification,
          row.unit,
          row.selling_price,
          row.product_description,
          row.remarks
        )
    );
    callback(null, product);
  });
}

function createProduct(product, callback) {
  const query = `
      INSERT INTO tb_product (
        business_id,
        product_name,
        product_gubun,
        product_code,
        product_number,
        specification,
        unit,
        selling_price,
        product_description,
        remarks
      ) VALUES 
      (?, 
       ?,
       ?,  
       ?,
       ?,
       ?,
       ?,
       ?,
       ?,
       ?)

    `;

  // product 객체에서 누락된 필드를 확인하고 기본값을 제공합니다.
  const params = [
    product.business_id,
    product.product_name,
    product.product_gubun,
    product.product_code,
    product.product_number,
    product.specification,
    product.unit,
    product.selling_price,
    product.product_description,
    product.remarks,
  ];

  console.log("/*createProducts*/");
  console.log(connection.format(query, params));
  connection.query(query, params, (error, results) => {
    if (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return callback(error, null);
      } else {
        console.error("Failed to create product: ", error);
        return callback(error, null);
      }
    }
    callback(null, results.insertId);
  });
}

//updateProduct
function updateProduct(product_id, updatedProduct, callback) {
  const query = "UPDATE tb_product SET ? WHERE product_id = ?";
  console.log("/*updateProduct*/");
  console.log(connection.format(query, [updatedProduct, product_id]));
  connection.query(query, [updatedProduct, product_id], (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to update product: ", error);
      return callback(error);
    }
    callback(null, results.affectedRows);
  });
}

//deleteProduct
function deleteProduct(product_id, callback) {
  console.log("product_id: ", product_id);
  const query = "DELETE FROM tb_product WHERE product_id = ?";
  connection.query(query, product_id, (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to delete product: ", error);
      return callback(error);
    }
    callback(null, results.affectedRows);
  });
}

module.exports = {
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
