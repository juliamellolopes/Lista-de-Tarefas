const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const authenticateToken = require("../middleware/authMiddleware");

// Obter todas as tarefas do usuário autenticado
router.get("/", authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Criar uma nova tarefa
router.post("/", authenticateToken, async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Task text is required" });
  }

  try {
    const newTask = new Task({
      text,
      user: req.user.id,
    });
    const savedTask = await newTask.save();
    res.json(savedTask);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Atualizar uma tarefa
router.put("/:id", authenticateToken, async (req, res) => {
  const { text, completed } = req.body;
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (text !== undefined) task.text = text;
    if (completed !== undefined) task.completed = completed;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    console.error("Server error", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Deletar uma tarefa
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    await Task.deleteOne({ _id: req.params.id });
    res.json({ message: "Task removed" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
