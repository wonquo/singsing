const expenseModel = require("../models/expense");

//거래처 정보 조회 핸들러
function getExpense(req, res) {
  const params = {
    expense_vendor_name: req.query.expense_vendor_name,
    //req.query.from_date 는 Wed, 17 Apr 2024 15:09:11 GMT 이다,  2024-04-17 변환 필요
    from_date: formatDate(req.query.from_date),
    to_date: formatDate(req.query.to_date),
  };

  expenseModel.getExpense(params, (error, expense) => {
    if (error) {
      return res.status(500).json({ message: "조회에 실패했습니다." });
    }
    res.json(expense);
  });
}

//거래처 정보 생성 핸들러
function createExpense(req, res) {
  const expense = req.body;

  expense.expense_date = formatDate(expense.expense_date);

  expenseModel.createExpense(expense, (error, expense_id) => {
    if (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "중복된 데이터 입니다." });
      } else {
        return res.status(500).json({ message: "데이터 생성에 실패했습니다." });
      }
    }
    res.status(201).json({ expense_id: expense_id });
  });
}

//거래처 정보 업데이트 핸들러
function updateExpense(req, res) {
  const expense_id = req.params.expense_id;
  const updatedExpense = req.body;
  //updatedExpense.expense_amount 쉼표 제거
  if (typeof updatedExpense.expense_amount === "string") {
    updatedExpense.expense_amount = updatedExpense.expense_amount.replace(
      /,/g,
      ""
    );
  }
  updatedExpense.expense_date = formatDate(updatedExpense.expense_date);

  expenseModel.updateExpense(
    expense_id,
    updatedExpense,
    (error, affectedRows) => {
      if (error) {
        if (error.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ message: "중복된 데이터 입니다." });
        } else {
          return res.status(500).json({ message: "업데이트에 실패했습니다." });
        }
      }
      if (affectedRows === 0) {
        return res.status(404).json({ message: "데이터를 찾을 수 없습니다." });
      }
      res.json({ message: "정상적으로 업데이트 되었습니다." });
    }
  );
}

//거래처 정보 삭제 핸들러

function deleteExpense(req, res) {
  const expense_id = req.params.expense_id;
  expenseModel.deleteExpense(expense_id, (error, affectedRows) => {
    if (error) {
      return res.status(500).json({ message: "삭제에 실패했습니다." });
    }
    if (affectedRows === 0) {
      return res.status(404).json({ message: "데이터를 찾을 수 없습니다." });
    }
    res.json({ message: "정상적으로 삭제되었습니다." });
  });
}
function getExpenseVendor(req, res) {
  expenseModel.getExpenseVendor((error, vendor) => {
    if (error) {
      return res.status(500).json({ message: "조회에 실패했습니다." });
    }
    res.json(vendor);
  });
}

function getExpenseDash(req, res) {
  const params = {
    yyyy: req.query.yyyy,
    mm: req.query.mm,
  };

  expenseModel.getExpenseDash(params, (error, expenseDash) => {
    if (error) {
      return res.status(500).json({ message: "조회에 실패했습니다." });
    }
    res.json(expenseDash);
  });
}

function formatDate(dateString) {
  // Date 객체로 변환
  const date = new Date(dateString);

  // 한국 시간대로 설정
  const koreaTimeZoneOffset = 9 * 60; // 한국은 UTC+9
  const koreaTimezoneOffsetMs = koreaTimeZoneOffset * 60 * 1000;
  const koreaTime = new Date(date.getTime() + koreaTimezoneOffsetMs);

  // YYYY-MM-DD 형식의 문자열로 변환
  const year = koreaTime.getUTCFullYear();
  const month = String(koreaTime.getUTCMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더하고 문자열로 변환합니다.
  const day = String(koreaTime.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

module.exports = {
  getExpenseDash,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseVendor,
};
