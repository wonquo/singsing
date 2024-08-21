const mysql = require("mysql");
const dbConfig = require("../dbConfig");
const connection = mysql.createConnection(dbConfig);

class todoModel {
  constructor(
    todo_master_id,
    subject,
    write_date,
    writer,
    last_update_date,
    last_updated_by
  ) {
    this.todo_master_id = todo_master_id;
    this.subject = subject;
    this.write_date = write_date;
    this.writer = writer;
    this.last_update_date = last_update_date;
    this.last_updated_by = last_updated_by;
  }
}

class todoDetailModel {
  constructor(
    todo_master_id,
    contents,
    check_yn,
    remark
  ) {
    this.todo_master_id = todo_master_id;
    this.contents = contents;
    this.check_yn = check_yn;
    this.remark = remark
  }
}

function getTodoList(params, callback) {
  const { subject, from_date, to_date } = params;

  let query = "/*getTodo*/";
  query += `
    SELECT todo_master_id,
              subject,
              DATE_FORMAT(write_date, '%Y-%m-%d') AS write_date,
              writer,
              last_update_date,
              last_updated_by
    FROM   tb_todo_master
    WHERE  1 = 1
    ORDER BY todo_master_id 
    `;
  let queryParams = [];
  if (subject) {
    query += " AND subject LIKE CONCAT('%', ?, '%')";
    queryParams.push(subject);
  }
  if (from_date) {
    query += " AND write_date >= DATE_FORMAT(?, '%Y-%m-%d')";
    queryParams.push(from_date);
  }
  if (to_date) {
    query += " AND write_date <= DATE_FORMAT(?, '%Y-%m-%d')";
    queryParams.push(to_date);
  }

  console.log(connection.format(query, queryParams));
  connection.query(query, queryParams, (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to fetch todo: ", error);
      return callback(error);
    }
    const todo = results.map(
      (row) =>
        new todoModel(
            row.todo_master_id,
            row.subject,
            row.write_date,
            row.writer,
            row.last_update_date,
            row.last_updated_by
        )
    );
    callback(null, todo);
  });
}

function getTodoDetail(todo_master_id, callback) {

    let query = "/*getTodoDetail*/";
    query += `

    SELECT todo_master_id,
                contents,
                check_yn,
                remark
    FROM   tb_todo_detail
    WHERE  todo_master_id = ?
    ORDER BY todo_detail_id 
    `;
    let queryParams = [];
    queryParams.push(todo_master_id);

    console.log("/*getTodoDetail*/");
    console.log(connection.format(query, queryParams));
    connection.query(query, queryParams, (error, results) => {
        if (error) {
        console.log("Query error: ", query);
        console.error("Failed to fetch todo: ", error);
        return callback(error);
        }
        const todo = results.map(
        (row) =>
            new todoDetailModel(
            row.todo_master_id,
            row.contents,
            row.check_yn,
            row.remark
            )
        );
        callback(null, todo);
    });
}






function insertTodoMaster(todo, callback) {
  const query = `
      INSERT INTO tb_todo_master (
        subject,
        write_date,
        writer,
        last_updated_by
      ) VALUES 
      (
        ?,
        ?,
        ?,
        ?
      )
    `;

  const params = [
    todo.subject,
    todo.write_date,
    todo.writer,
    todo.last_updated_by,
  ];

  console.log("/*createTodoMaster*/");
  console.log(connection.format(query, params));
  connection.query(query, params, (error, results) => {
    if (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return callback(error, null);
      } else {
        console.error("Failed to create todo: ", error);
        return callback(error, null);
      }
    }
    
    console.log("results.insertId: ", results.insertId);
    console.log("results: ", results);
    callback(null, results.insertId);
  });
}

function insertTodoDetail(todo, callback) {
    console.log("todo: ", todo);
    const query = `
        INSERT INTO tb_todo_detail (
            todo_master_id,
            contentS,
            check_yn,
            remark,
            last_updated_by
        ) VALUES 
        (
            ?,
            ?,
            ?,
            ?,
            ?
        )
        `;
    
    const params = [
        todo.todo_master_id,
        todo.contents,
        todo.check_yn,
        todo.remark,
        todo.last_updated_by,
    ];
    
    console.log("/*createTodoDetail*/");
    console.log(connection.format(query, params));
    connection.query(query, params, (error, results) => {
        if (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return callback(error, null);
        } else {
            console.error("Failed to create todo: ", error);
            return callback(error, null);
        }
        }
        callback(null, results.insertId);
    });
}

function deleteTodoDetail(todo_master_id, callback) {
    const query = "DELETE FROM tb_todo_detail WHERE todo_master_id = ?";

    console.log("/*deleteTodoDetail*/");
    console.log(connection.format(query, todo_master_id));
    connection.query(query, todo_master_id, (error, results) => {
        if (error) {
        console.log("Query error: ", query);
        console.error("Failed to delete todo: ", error);
        return callback(error);
        }
        callback(null, results.affectedRows);
    });
}

// updateTodo
function updateTodo(todo_master_id, updatedTodo, callback) {
  const query = "UPDATE tb_todo_master SET ? WHERE todo_master_id = ?";
  console.log("/*updateTodo*/");
  console.log(connection.format(query, [updatedTodo, todo_master_id]));
  connection.query(query, [updatedTodo, todo_master_id], (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to update todo: ", error);
      return callback(error);
    }
    callback(null, results.affectedRows);
  });
}

// deleteTodoMaster
function deleteTodoMaster(todo_id, callback) {
  const query = "DELETE FROM tb_todo_master WHERE todo_master_id = ?";
  connection.query(query, todo_id, (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to delete todo: ", error);
      return callback(error);
    }
    callback(null, results.affectedRows);
  });
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
