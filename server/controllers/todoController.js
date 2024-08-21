const todoModel = require("../models/todo");

// 할 일 정보 조회 핸들러
function getTodoList(req, res) {
  const params = {
    subject: req.query.subject, 
    // req.query.from_date 는 Wed, 17 Apr 2024 15:09:11 GMT 이다,  2024-04-17 변환 필요
    from_date: formatDate(req.query.from_date),
    to_date: formatDate(req.query.to_date),
  };

  todoModel.getTodoList(params, (error, todo) => {
    if (error) {
      return res.status(500).json({ message: "조회에 실패했습니다." });
    }
    res.json(todo);
  });
}

function getTodoDetail(req, res) {
    const todo_master_id = req.params.todo_master_id;
    todoModel.getTodoDetail(todo_master_id, (error, todo) => {
      if (error) {
        return res.status(500).json({ message: "조회에 실패했습니다." });
      }
      res.json(todo);
    });
  }

// 할 일 정보 생성 핸들러
function insertTodoMaster(req, res) {
  const todo = req.body;

  todo.write_date = formatDate(todo.write_date);

  todoModel.insertTodoMaster(todo, (error, todo_master_id) => {
    if (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "중복된 데이터 입니다." });
      } else {
        return res.status(500).json({ message: "데이터 생성에 실패했습니다." });
      }
    }
    res.status(201).json({ todo_master_id: todo_master_id });
  });
}

// 할 일 정보 생성 핸들러
function insertTodoDetail(req, res) {
    const todo = req.body;
  
    todo.write_date = formatDate(todo.write_date);
      
    todoModel.insertTodoDetail(todo, (error, todo_master_id) => {
      if (error) {
        if (error.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ message: "중복된 데이터 입니다." });
        } else {
          return res.status(500).json({ message: "데이터 생성에 실패했습니다." });
        }
      }
      res.status(201).json({ todo_master_id: todo_master_id });
    });
  }


// 할 일 정보 상세 삭제 
function deleteTodoDetail(req, res) {
    const todo_master_id = req.params.todo_master_id;
    todoModel.deleteTodoDetail(todo_master_id, (error, affectedRows) => {
      if (error) {
        return res.status(500).json({ message: "삭제에 실패했습니다." });
      }
      res.json({ message: "정상적으로 삭제되었습니다." });
    });
  }

// 할 일 정보 업데이트 핸들러
function updateTodo(req, res) {
  const todo_master_id = req.params.todo_master_id;
  const updatedTodo = req.body;

  updatedTodo.write_date = formatDate(updatedTodo.write_date);

  todoModel.updateTodo(todo_master_id, updatedTodo, (error, affectedRows) => {
    if (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "중복된 데이터 입니다." });
      } else {
        return res.status(500).json({ message: "업데이트에 실패했습니다." });
      }
    }
    res.json({ message: "정상적으로 업데이트 되었습니다." });
  });
}

// 할 일 정보 삭제 핸들러
function deleteTodoMaster(req, res) {
  const todo_master_id = req.params.todo_master_id;
  todoModel.deleteTodoMaster(todo_master_id, (error, affectedRows) => {
    if (error) {
      return res.status(500).json({ message: "삭제에 실패했습니다." });
    }
    /*
    if (affectedRows === 0) {
      return res.status(404).json({ message: "데이터를 찾을 수 없습니다." });
    }*/
   
    res.json({ message: "정상적으로 삭제되었습니다." });
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
    getTodoList,
    getTodoDetail,
    insertTodoMaster,
    insertTodoDetail,
    deleteTodoDetail,
    updateTodo,
    deleteTodoMaster,
};
