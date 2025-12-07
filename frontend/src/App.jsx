// src/App.jsx
import { useState, useEffect } from "react";
import API from "./api.js";

function App() {
  const [view, setView] = useState("login"); // "login" | "register" | "profile"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [user, setUser] = useState(null); // logged-in user data
  const [message, setMessage] = useState("");

  // Check if already logged in on first load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchMe();
    }
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await API.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setMessage(res.data.message || "Registered successfully!");
      setView("login"); // after register, go to login
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "Registration failed. Try again."
      );
    }
  };

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await API.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      // Save token
      localStorage.setItem("token", res.data.token);

      setUser(res.data.user); // store user info
      setMessage("Logged in successfully!");
      setView("profile");
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Login failed. Try again.");
    }
  };

  // Fetch /auth/me (protected)
  const fetchMe = async () => {
    try {
      const res = await API.get("/auth/me");
      setUser(res.data);
      setView("profile");
    } catch (error) {
      console.error(error);
      // token invalid/expired
      localStorage.removeItem("token");
      setUser(null);
      setView("login");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setMessage("Logged out.");
    setView("login");
  };

  return (
    <div style={styles.container}>
      <h1>JWT Auth Demo</h1>

      <div style={styles.tabs}>
        <button
          onClick={() => setView("login")}
          style={view === "login" ? styles.activeTab : styles.tab}
        >
          Login
        </button>
        <button
          onClick={() => setView("register")}
          style={view === "register" ? styles.activeTab : styles.tab}
        >
          Register
        </button>
        <button
          onClick={fetchMe}
          style={view === "profile" ? styles.activeTab : styles.tab}
        >
          Profile
        </button>
      </div>

      {message && <p style={styles.message}>{message}</p>}

      {view === "register" && (
        <form onSubmit={handleRegister} style={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password (min 6 chars)"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Register
          </button>
        </form>
      )}

      {view === "login" && (
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
      )}

      {view === "profile" && (
        <div style={styles.card}>
          {user ? (
            <>
              <h2>Welcome, {user.name}</h2>
              <p>
                <b>Email:</b> {user.email}
              </p>
              <p>
                <b>ID:</b> {user._id || user.id}
              </p>
              <button onClick={handleLogout} style={styles.button}>
                Logout
              </button>
            </>
          ) : (
            <p>No user data. Please login.</p>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "40px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontFamily: "sans-serif",
    textAlign: "center",
  },
  tabs: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "20px",
  },
  tab: {
    padding: "8px 12px",
    border: "1px solid #ccc",
    background: "#f9f9f9",
    cursor: "pointer",
    borderRadius: "4px",
  },
  activeTab: {
    padding: "8px 12px",
    border: "1px solid #333",
    background: "#333",
    color: "#fff",
    cursor: "pointer",
    borderRadius: "4px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "8px",
    fontSize: "14px",
  },
  button: {
    padding: "10px",
    fontSize: "14px",
    cursor: "pointer",
    borderRadius: "4px",
    border: "none",
    background: "#333",
    color: "#fff",
  },
  message: {
    color: "teal",
  },
  card: {
    textAlign: "left",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
  },
};

export default App;
