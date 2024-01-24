const express = require("express");
const Todo = require("../models/Todo");
const User = require("../models/User");
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const asyncErrorHandler = require("../middlewares/asyncErrorHandler")
exports.addNewToDo = asyncErrorHandler(async (req, res) => {
    const { title, description } = req.body;
    try {
        const newTodo = new Todo({
            title,
            description,
            user: new ObjectId(req.user._id),
        });
        await newTodo.save()
        res.status(201).json({ id: newTodo._id, title: newTodo.title, description: newTodo.description, completed: newTodo.completed });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
})

exports.getToDos = asyncErrorHandler(async (req, res) => {
    try {
        const todos = await Todo.find({ user: new ObjectId(req.user._id) })
        console.log(todos)
        res.status(200).json(todos)
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
})

exports.updateTodos = asyncErrorHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid Todo ID' });
        }
        const todo = await Todo.findById(id);
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        todo.title = title || todo.title;
        todo.description = description || todo.description;
        await todo.save();
        res.status(200).json({
            id: todo._id,
            title: todo.title,
            description: todo.description,
            completed: todo.completed,
        });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

exports.deleteTodo = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid Todo ID' });
        }
        const todo = await Todo.findOneAndDelete(id);
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.status(200).json({ message: "Todo item deleted successfully" })
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
})

exports.changeStatus = asyncErrorHandler(async (req, res) => {
    const { id } = req.params
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid Todo ID' });
        }
        const todo = await Todo.findById(id);
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        todo.completed = !todo.completed;
        await todo.save()
        res.status(201).json({ id: todo._id, title: todo.title, description: todo.description, completed: todo.completed });

    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
})

