const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const authenticateToken = require("../middleware/authMiddleware");

// Obter todas as tarefas do usuário autenticado
router.get("/", authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).populate(
      "user",
      "username"
    );
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Criar uma nova tarefa
router.post("/", authenticateToken, async (req, res) => {
  const { title, text } = req.body;

  if (!title || !text) {
    return res.status(400).json({ error: "Title and text are required" });
  }

  try {
    const newTask = new Task({
      title,
      text,
      user: req.user.id,
    });
    const savedTask = await newTask.save();
    res.json(savedTask);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Marcar tarefa como concluída
router.put("/:id", authenticateToken, async (req, res) => {
  const { completed } = req.body;
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (completed !== undefined) task.completed = completed;
    await task.save();
    res.json(task);
  } catch (err) {
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

// Atualizar uma tarefa
router.put("/:id", authenticateToken, async (req, res) => {
  const { title, text, completed } = req.body;
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (title !== undefined) task.title = title;
    if (text !== undefined) task.text = text;
    if (completed !== undefined) task.completed = completed;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
