import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  // Handle Input Change
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  // Login API
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post(
        "/auth/login",
        user
      );

      if (response.data) {

        alert("Login Successful");

        // Save Login
        localStorage.setItem(
          "isLoggedIn",
          "true"
        );

        // Redirect to Dashboard
        navigate("/dashboard");

      } else {

        setMessage(
          "Invalid Email or Password"
        );
      }

    } catch (error) {
      console.log(error);
      setMessage("Login Failed");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow">

        <h2 className="text-center mb-4">
          Student Login
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            className="form-control mb-3"
            value={user.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            className="form-control mb-3"
            value={user.password}
            onChange={handleChange}
            required
          />

          <button className="btn btn-success w-100">
            Login
          </button>

        </form>

        <p className="text-danger text-center mt-2">
          {message}
        </p>

        <p className="text-center mt-3">
          Don't have an account?
          <Link to="/register">
            {" "}Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;