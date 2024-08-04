import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTrash, FaCheck, FaEdit, FaUndo, FaSignOutAlt } from "react-icons/fa";
import "./tasks.css";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editText, setEditText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const res = await axios.get("http://localhost:5000/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(res.data);
      } catch (err) {
        console.error(err);
        if (err.response && err.response.status === 401) {
          navigate("/login");
        }
      }
    };
    fetchTasks();
  }, [navigate]);

  const addTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/tasks",
        { title, text },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks([...tasks, res.data]);
      setTitle("");
      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const completeTask = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        { completed: true },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(tasks.map((task) => (task._id === id ? res.data : task)));
    } catch (err) {
      console.error(err);
    }
  };

  const reactivateTask = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        { completed: false },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(tasks.map((task) => (task._id === id ? res.data : task)));
    } catch (err) {
      console.error(err);
    }
  };

  const editTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        `http://localhost:5000/api/tasks/${editTaskId}`,
        { title: editTitle, text: editText },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(
        tasks.map((task) => (task._id === editTaskId ? res.data : task))
      );
      setEditTaskId(null);
      setEditTitle("");
      setEditText("");
    } catch (err) {
      console.error(err);
    }
  };

  const startEditTask = (task) => {
    setEditTaskId(task._id);
    setEditTitle(task.title);
    setEditText(task.text);
  };

  const cancelEditTask = () => {
    setEditTaskId(null);
    setEditTitle("");
    setEditText("");
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const renderTask = (task) => (
    <li
      key={task._id}
      className={`task-item ${task.completed ? "completed" : ""}`}
    >
      {editTaskId === task._id ? (
        <form onSubmit={editTask} className="flex flex-1 flex-col">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="task-input"
          />
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="task-input"
          />
          <div className="task-actions">
            <button type="submit" className="btn-save">
              Save
            </button>
            <button
              onClick={cancelEditTask}
              type="button"
              className="btn-cancel"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="task-content">
            <span className="task-title">{task.title}</span>
            <div className="task-icons">
              {task.completed ? (
                <button
                  onClick={() => reactivateTask(task._id)}
                  className="text-yellow-500"
                >
                  <FaUndo />
                </button>
              ) : (
                <button
                  onClick={() => completeTask(task._id)}
                  className="text-green-500"
                >
                  <FaCheck />
                </button>
              )}
              <button
                onClick={() => startEditTask(task)}
                className="text-blue-500"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => deleteTask(task._id)}
                className="text-red-500"
              >
                <FaTrash />
              </button>
            </div>
          </div>
          <span className="task-text">{task.text}</span>
          <span className="task-user">Created by: {task.user.username}</span>
        </>
      )}
    </li>
  );

  return (
    <div className="tasks-container">
      <div className="tasks-box">
        <div className="tasks-header">
          <h2>Tasks</h2>
          <button onClick={logout} className="btn-logout">
            <FaSignOutAlt size={24} />
          </button>
        </div>
        <form onSubmit={addTask} className="tasks-form">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="task-input"
          />
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Text"
            className="task-input"
          />
          <button type="submit" className="btn-add">
            Add Task
          </button>
        </form>
        <div>
          <h3 className="tasks-subheader">Active Tasks</h3>
          <ul className="tasks-list">
            {tasks.filter((task) => !task.completed).map(renderTask)}
          </ul>
        </div>
        <div>
          <h3 className="tasks-subheader">Completed Tasks</h3>
          <ul className="tasks-list">
            {tasks.filter((task) => task.completed).map(renderTask)}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
