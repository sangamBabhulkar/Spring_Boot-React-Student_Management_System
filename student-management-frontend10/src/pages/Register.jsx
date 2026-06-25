import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [emailMessage, setEmailMessage] = useState("");

  // Handle Input Change
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });

    // AJAX Email Validation
    if (e.target.name === "email") {
      checkEmail(e.target.value);
    }
  };

  // Check Email API
  const checkEmail = async (email) => {
    try {
      const response = await API.get(
        `/auth/check-email?email=${email}`
      );

      if (response.data) {
        setEmailMessage("Email already exists");
      } else {
        setEmailMessage("Email available");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Register API
  const handleSubmit = async (e) => {
  e.preventDefault();

  console.log(user);

  try {
    await API.post("/auth/register", user);

    alert("Registration Successful");

    navigate("/login");
  } catch (error) {
    console.log(error);
  }
};

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow">
        <h2 className="text-center mb-4">
          Student Register
        </h2>

        <form onSubmit={handleSubmit}>
          <input
  type="text"
  name="name"
  placeholder="Enter Name"
  className="form-control mb-3"
  value={user.name}
  onChange={handleChange}
  required
/>

<input
  type="email"
  name="email"
  placeholder="Enter Email"
  className="form-control"
  value={user.email}
  onChange={handleChange}
  required
/>

<small>{emailMessage}</small>

<input
  type="password"
  name="password"
  placeholder="Enter Password"
  className="form-control mt-3 mb-3"
  value={user.password}
  onChange={handleChange}
  required
/>

          <button className="btn btn-primary w-100">
            Register
          </button>
        </form>

        <p className="text-center mt-3">
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>

      </div>
    </div>

  );
}

export default Register;