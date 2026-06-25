import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [student, setStudent] = useState({
    name: "",
    email: "",
    course: "",
    address: "",
    profilePicFile: null,
  });

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setStudent({
      ...student,
      profilePicFile: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", student.name);
    formData.append("email", student.email);
    formData.append("course", student.course);
    formData.append("address", student.address);

    if (student.profilePicFile) {
      formData.append("image", student.profilePicFile);
    }

    try {
      if (editId) {
        await API.put(`/students/${editId}`, formData);
        alert("Student Updated Successfully");
        setEditId(null);
      } else {
        await API.post("/students", formData);
        alert("Student Added Successfully");
      }

      fetchStudents();

      setStudent({
        name: "",
        email: "",
        course: "",
        address: "",
        profilePicFile: null,
      });

    } catch (error) {
      console.log(error);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await API.get("/students");
      setStudents(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const editStudent = (stu) => {
    setStudent({
      name: stu.name,
      email: stu.email,
      course: stu.course,
      address: stu.address,
      profilePicFile: null,
    });
    setEditId(stu.id);
  };

  const deleteStudent = async (id) => {
    await API.delete(`/students/${id}`);
    fetchStudents();
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="container mt-4">

      <div className="d-flex justify-content-between mb-3">
        <h2>Student Dashboard</h2>
        <button className="btn btn-danger" onClick={logout}>
          Logout
        </button>
      </div>

      {/* FORM */}
      <div className="card p-4">
        <h4>{editId ? "Update Student" : "Add Student"}</h4>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            value={student.name}
            onChange={handleChange}
            placeholder="Name"
            className="form-control mb-2"
          />

          <input
            name="email"
            value={student.email}
            onChange={handleChange}
            placeholder="Email"
            className="form-control mb-2"
          />

          <input
            name="course"
            value={student.course}
            onChange={handleChange}
            placeholder="Course"
            className="form-control mb-2"
          />

          <input
            name="address"
            value={student.address}
            onChange={handleChange}
            placeholder="Address"
            className="form-control mb-2"
          />

          <input
            type="file"
            onChange={handleFileChange}
            className="form-control mb-2"
          />

          <button className="btn btn-success w-100">
            {editId ? "Update" : "Add"}
          </button>
        </form>
      </div>

      {/* SEARCH */}
      <input
        className="form-control mt-3"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Profile</th>
            <th>Name</th>
            <th>Email</th>
            <th>Course</th>
            <th>Address</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {students
            .filter((s) =>
              s.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((stu) => (
              <tr key={stu.id}>

                {/* ✅ IMAGE URL FIXED HERE */}
                <td>
                  {stu.profilePic ? (
                    <img
                      src={`http://localhost:8080/uploads/${stu.profilePic}`}
                      width="50"
                      height="50"
                      style={{ borderRadius: "50%" }}
                      alt="profile"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>

                <td>{stu.name}</td>
                <td>{stu.email}</td>
                <td>{stu.course}</td>
                <td>{stu.address}</td>

                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => editStudent(stu)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteStudent(stu.id)}
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;