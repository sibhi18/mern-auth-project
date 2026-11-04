import { useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [profile, setProfile] = useState(null);
  const [adminData, setAdminData] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "registration failed");
        return;
      }

      alert("Regisration successfully");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      alert("cannot connect to the server");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      alert("Login successful!");
      console.log(data);
    } catch (error) {
      console.error("Login error:", error);
      alert("Cannot connect to server.");
    }
  };

  const handleProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      const response = await fetch("http://localhost:5000/api/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to get profile");
        return;
      }

      setProfile(data.user);
    } catch (error) {
      alert("Cannot connect to the server");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setProfile(null);
    setAdminData(null);
    setName("");
    setEmail("");
    setPassword("");
    setIsLogin(true);

    alert("Logged out successfully");
  };

  const handleGetAdmin = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/admin", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Admin access denied");
        return;
      }

      setAdminData(data);
    } catch (error) {
      alert("Cannot connect to server");
    }
  };

  return (
    <div className="auth-container">
      <h1>{isLogin ? "Login" : "Create Account"}</h1>

      <form onSubmit={isLogin ? handleLogin : handleRegister}>
        {!isLogin && (
          <div>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
        )}

        <div>
          <label>email</label>
          <input
            type="email"
            value={email}
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          ></input>
        </div>

        <div>
          <label>password</label>
          <input
            type="password"
            value={password}
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          ></input>
        </div>

        <button type="submit">{isLogin ? "Login" : "Register"}</button>
      </form>
      <button type="button" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Register" : "Login"}
      </button>

      <button type="button" onClick={handleProfile}>
        Get My Profile
      </button>

      <button type="button" onClick={handleLogout}>
        Logout
      </button>

      <button type="button" onClick={handleGetAdmin}>
        Open Admin Dashboard
      </button>

      {adminData && (
        <div>
          <h2>Admin Dashboard</h2>
          <p>{adminData.message}</p>
          <p>Name: {adminData.user.name}</p>
          <p>Email: {adminData.user.email}</p>
          <p>Role: {adminData.user.role}</p>
        </div>
      )}

      {profile && (
        <div className="profile-section">
          <h1>MY profile</h1>

          <p>Name: {profile.name}</p>
          <p>email: {profile.email}</p>
          <button type="button" onClick={() => setProfile(null)}>
            hide profile
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
