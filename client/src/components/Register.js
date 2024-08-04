import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        username,
        password,
      });
      setMessage("Registration successful");
      navigate("/login");
    } catch (err) {
      setMessage("Error registering");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-900">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center border rounded mb-4">
            <FaUser className="text-gray-500 mx-2" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 outline-none"
            />
          </div>
          <div className="flex items-center border rounded mb-4">
            <FaLock className="text-gray-500 mx-2" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 outline-none"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 w-full rounded"
          >
            Register
          </button>
        </form>
        {message && <p className="text-red-500 mt-2">{message}</p>}
        <div className="text-center mt-4">
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
