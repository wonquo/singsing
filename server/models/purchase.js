const mysql = require("mysql");
const dbConfig = require("../dbConfig");
const connection = mysql.createConnection(dbConfig);

class PurchaseModel {
  constructor(
    purchase_id,
    business_id,
    business_name,
    vendor_name,
    issue_date,
    proof,
    proof_name,
    total_amount,
    useage,
    useage_name,
    contents,
    project,
    remarks,
    memo
  ) {
    this.purchase_id = purchase_id;
    this.business_id = business_id;
    this.business_name = business_name;
    this.vendor_name = vendor_name;
    this.issue_date = issue_date;
    this.proof = proof;
    this.proof_name = proof_name;
    this.total_amount = total_amount;
    this.useage = useage;
    this.useage_name = useage_name;
    this.contents = contents;
    this.project = project;
    this.remarks = remarks;
    this.memo = memo;
  }
}

function getPurchase(params, callback) {
  const { vendor_name, from_date, to_date } = params;

  let query = `SELECT   tp.purchase_id,
                        tp.business_id,
                        tb.business_name,
                        tp.vendor_name,
                        DATE_FORMAT(tp.issue_date, '%Y-%m-%d') as issue_date,
                        tp.proof,
                        code.name as proof_name,
                        tp.total_amount,
                        tp.useage,
                        code2.name as useage_name,
                        tp.contents,
                        tp.project,
                        tp.remarks,
                        tp.memo
                FROM    tb_purchase tp,
                        (SELECT cd.code, 
                                cd.name
                          FROM  tb_code_master cm
                              , tb_code_detail cd
                         WHERE  cm.code = 'PURCHASE_PROOF'
                           AND  cm.master_id = cd.master_id
                           AND  cd.use_yn = 'Y'
                           AND  cd.start_date <= NOW()
                           ) code,
                        (SELECT cd.code, 
                                cd.name
                          FROM  tb_code_master cm
                              , tb_code_detail cd
                         WHERE  cm.code = 'PURCHASE_USEAGE'
                           AND  cm.master_id = cd.master_id
                           AND  cd.use_yn = 'Y'
                           AND  cd.start_date <= NOW()
                           ) code2,
                        tb_business tb
                WHERE   tp.proof = code.code
                AND     tp.useage = code2.code
                AND     tb.business_id = tp.business_id
                AND     tp.business_id = ?`;
  let queryParams = [];
  queryParams.push(params.business_id);
  if (vendor_name) {
    query += " AND UPPER(tp.vendor_name) LIKE UPPER(?)";
    queryParams.push("%" + vendor_name + "%");
  }
  if (from_date) {
    query += " AND issue_date >= ?";
    queryParams.push(from_date);
  }
  if (to_date) {
    query += " AND issue_date <= ?";
    queryParams.push(to_date);
  }

  query += " ORDER BY tp.issue_date, tp.vendor_name ASC";

  console.log(connection.format(query, queryParams));
  connection.query(query, queryParams, (error, results) => {
    if (error) {
      console.error("Failed to fetch purchase: ", error);
      return callback(error);
    }
    const purchases = results.map(
      (row) =>
        new PurchaseModel(
          row.purchase_id,
          row.business_id,
          row.business_name,
          row.vendor_name,
          row.issue_date,
          row.proof,
          row.proof_name,
          row.total_amount,
          row.useage,
          row.useage_name,
          row.contents,
          row.project,
          row.remarks,
          row.memo
        )
    );
    callback(null, purchases);
  });
}

function createPurchase(purchase, callback) {
  const query = `
      INSERT INTO tb_purchase (
        business_id,
        vendor_name,
        issue_date,
        proof,
        total_amount,
        useage,
        contents,
        project,
        remarks,
        memo
      ) VALUES 
      (
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
      )
    `;

  const params = [
    purchase.business_id,
    purchase.vendor_name,
    purchase.issue_date,
    purchase.proof,
    isNaN(purchase.total_amount)
      ? purchase.total_amount.replace(/,/g, "")
      : purchase.total_amount,
    purchase.useage,
    purchase.contents,
    purchase.project,
    purchase.remarks,
    purchase.memo,
  ];

  console.log(connection.format(query, params));
  connection.query(query, params, (error, results) => {
    if (error) {
      console.error("Failed to create purchase: ", error);
      return callback(error, null);
    }
    callback(null, results.insertId);
  });
}

function updatePurchase(purchase_id, updatedPurchase, callback) {
  const query = "UPDATE tb_purchase SET ? WHERE purchase_id = ?";
  connection.query(query, [updatedPurchase, purchase_id], (error, results) => {
    if (error) {
      console.error("Failed to update purchase: ", error);
      return callback(error);
    }
    callback(null, results.affectedRows);
  });
}

function deletePurchase(purchase_id, callback) {
  const query = "DELETE FROM tb_purchase WHERE purchase_id = ?";
  connection.query(query, purchase_id, (error, results) => {
    if (error) {
      console.error("Failed to delete purchase: ", error);
      return callback(error);
    }
    callback(null, results.affectedRows);
  });
}

function getPurchaseVendor(callback) {
  const query = `
    SELECT code, name
    FROM tb_code_detail
    WHERE master_id = (
      SELECT master_id FROM tb_code_master WHERE code = 'PURCHASE_VENDOR'
    )
    AND use_yn = 'Y'
    ORDER BY sort_seq
  `;
  connection.query(query, (error, results) => {
    if (error) {
      console.error("Failed to fetch purchase vendor: ", error);
      return callback(error);
    }
    callback(null, results);
  });
}

module.exports = {
  getPurchase,
  createPurchase,
  updatePurchase,
  deletePurchase,
  getPurchaseVendor,
};
