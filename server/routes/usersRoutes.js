// routes/users.js

const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");

router.get("/:id?", UserController.getUsers);
router.post("/insert", UserController.createUser);
router.put("/:user_id", UserController.updateUser);
router.delete("/:user_id", UserController.deleteUser);

module.exports = router;
