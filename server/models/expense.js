const mysql = require("mysql");
const dbConfig = require("../dbConfig");
const connection = mysql.createConnection(dbConfig);

class expenseModel {
  constructor(
    expense_id,
    expense_vendor_code,
    expense_vendor_name,
    expense_date,
    expense_content,
    expense_purpose,
    manager,
    expense_amount,
    remarks
  ) {
    this.expense_id = expense_id;
    this.expense_vendor_code = expense_vendor_code;
    this.expense_vendor_name = expense_vendor_name;
    this.expense_date = expense_date;
    this.expense_content = expense_content;
    this.expense_purpose = expense_purpose;
    this.manager = manager;
    this.expense_amount = expense_amount;
    this.remarks = remarks;
  }
}

class expenseDashModel {
  constructor(yyyy, mm, total_amount, expense_grow_rate) {
    this.yyyy = yyyy;
    this.mm = mm;
    this.total_amount = total_amount;
    this.expense_grow_rate = expense_grow_rate;
  }
}

function getExpense(params, callback) {
  const { expense_vendor_name, from_date, to_date } = params;

  let query = "/*getExpense*/";
  query += `
    SELECT expense_id,
           DATE_FORMAT(expense_date, '%Y-%m-%d') as expense_date,
           code.code as expense_vendor_code,
           code.name as expense_vendor_name,
           expense_content,
           expense_purpose,
           manager,
           expense_amount,
           te.remarks
    FROM   tb_expense te,
           (SELECT cd.code, 
                   cd.name
             FROM  tb_code_master cm
                 , tb_code_detail cd
            WHERE  cm.code = 'EXPENSE_VENDOR'
              AND  cm.master_id = cd.master_id
              AND  cd.use_yn = 'Y'
              AND  cd.start_date <= NOW()
              ) code
    WHERE  code.code = te.expense_vendor_code
    
    `;
  let queryParams = [];
  if (expense_vendor_name) {
    query += " AND UPPER(code.name) LIKE UPPER(?)";
    queryParams.push("%" + expense_vendor_name + "%");
  }
  if (from_date) {
    query += " AND expense_date >=  DATE_FORMAT(?, '%Y-%m-%d')";
    queryParams.push(from_date);
  }
  if (to_date) {
    query += " AND expense_date <= DATE_FORMAT(?, '%Y-%m-%d')";
    queryParams.push(to_date);
  }

  console.log(connection.format(query, queryParams));
  connection.query(query, queryParams, (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to fetch expense: ", error);
      return callback(error);
    }
    const expense = results.map(
      (row) =>
        new expenseModel(
          row.expense_id,
          row.expense_vendor_code,
          row.expense_vendor_name,
          row.expense_date,
          row.expense_content,
          row.expense_purpose,
          row.manager,
          row.expense_amount,
          row.remarks
        )
    );
    callback(null, expense);
  });
}

function createExpense(expense, callback) {
  const query = `
      INSERT INTO tb_expense (
        expense_vendor_code,
        expense_date,
        expense_content,
        expense_purpose,
        manager,
        expense_amount,
        remarks
      ) VALUES 
      (
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
    expense.expense_vendor_code,
    expense.expense_date,
    expense.expense_content,
    expense.expense_purpose,
    expense.manager,
    //expense.expense_amount 쉼표 제거
    expense.expense_amount.replace(/,/g, ""),
    expense.remarks,
  ];

  console.log("/*createExpenses*/");
  console.log(connection.format(query, params));
  connection.query(query, params, (error, results) => {
    if (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return callback(error, null);
      } else {
        console.error("Failed to create expense: ", error);
        return callback(error, null);
      }
    }
    callback(null, results.insertId);
  });
}

//updateExpense
function updateExpense(expense_id, updatedExpense, callback) {
  const query = "UPDATE tb_expense SET ? WHERE expense_id = ?";
  console.log("/*updateExpense*/");
  console.log(connection.format(query, [updatedExpense, expense_id]));
  connection.query(query, [updatedExpense, expense_id], (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to update expense: ", error);
      return callback(error);
    }
    callback(null, results.affectedRows);
  });
}

//deleteExpense
function deleteExpense(expense_id, callback) {
  const query = "DELETE FROM tb_expense WHERE expense_id = ?";
  connection.query(query, expense_id, (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to delete expense: ", error);
      return callback(error);
    }
    callback(null, results.affectedRows);
  });
}

//getExpenseVendor
function getExpenseVendor(callback) {
  const query = `
  /*getExpenseVendor*/
    SELECT cd.code, cd.name
    FROM tb_code_master cm
       , tb_code_detail cd
    WHERE cm.code = 'EXPENSE_VENDOR'
    AND   cm.master_id = cd.master_id
    AND   cd.use_yn = 'Y'
    ORDER BY cd.sort_seq
  `;
  console.log(connection.format(query));
  connection.query(query, (error, results) => {
    if (error) {
      console.error("Failed to fetch expense vendor: ", error);
      return callback(error);
    }
    callback(null, results);
  });
}

function getExpenseDash(params, callback) {
  let { yyyy, mm } = params;

  //yyyy, mm 기준 전월
  let pre_yyyy, pre_mm;
  if (mm) {
    pre_yyyy = mm === "01" ? parseInt(yyyy) - 1 : yyyy;
    pre_mm = mm === "01" ? "12" : parseInt(mm) - 1;
    pre_mm = pre_mm < 10 ? "0" + pre_mm : pre_mm;
  } else {
    pre_yyyy = parseInt(yyyy) - 1;
  }

  let pre_query = `SELECT IFNULL(SUM(expense_amount), 0) as total_amount
                     FROM tb_expense
                     WHERE DATE_FORMAT(expense_date, '%Y') = ?
                     `;
  if (mm) {
    pre_query += `AND DATE_FORMAT(expense_date, '%m') = ?`;
  }
  console.log("/*getExpenseDash*/");
  console.log(connection.format(pre_query, [pre_yyyy, pre_mm]));
  connection.query(pre_query, [pre_yyyy, pre_mm], (error, pre_results) => {
    if (error) {
      console.error("Failed to fetch expense dash: ", error);
      return callback(error);
    }
    console.log("pre_results: ", pre_results);
    const pre_total_amount = pre_results[0].total_amount;

    let query = `SELECT IFNULL(SUM(expense_amount), 0) as total_amount
                   FROM tb_expense
                   WHERE DATE_FORMAT(expense_date, '%Y') = ?
                   `;
    if (mm) {
      query += `AND DATE_FORMAT(expense_date, '%m') = ?`;
    }
    console.log(connection.format(query, [yyyy, mm]));
    connection.query(query, [yyyy, mm], (error, results) => {
      if (error) {
        console.error("Failed to fetch expense dash: ", error);
        return callback(error);
      }
      const total_amount = results[0].total_amount;

      const expense_grow_rate =
        pre_total_amount === 0
          ? 0
          : (total_amount - pre_total_amount) / pre_total_amount;

      const expenseDash = new expenseDashModel(
        yyyy,
        mm,
        total_amount,
        expense_grow_rate
      );
      callback(null, expenseDash);
    });
  });
}

module.exports = {
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseVendor,
  getExpenseDash,
};
