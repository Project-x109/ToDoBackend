const express = require('express');
const { addNewToDo, getToDos, updateTodos, deleteTodo, changeStatus } = require('../controllers/todoController')
const router = express.Router()
const { verifyToken, isAuthenticated } = require("../config/functions")
const { validateCreateTodo, handleValidationErrors } = require("../middlewares/validation")
router.route('/todos').post(verifyToken, isAuthenticated, validateCreateTodo, handleValidationErrors, addNewToDo)
router.route('/todos').get(verifyToken, isAuthenticated, getToDos)
router.route('/todos/:id').put(verifyToken, isAuthenticated, updateTodos)
router.route('/todos/:id').delete(verifyToken, isAuthenticated, deleteTodo)
router.route('/todos/:id/completed').put(verifyToken, isAuthenticated, changeStatus)


module.exports = router;