const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");

router.get("/:id?", todoController.getTodoList);
router.get("/todoDetail/:todo_master_id", todoController.getTodoDetail);
router.post("/insertMaster", todoController.insertTodoMaster);
router.post("/insertDetail", todoController.insertTodoDetail);
router.delete("/deleteDetail/:todo_master_id", todoController.deleteTodoDetail);
router.put("/:todo_master_id", todoController.updateTodo);
router.delete("/:todo_master_id", todoController.deleteTodoMaster);

module.exports = router;
