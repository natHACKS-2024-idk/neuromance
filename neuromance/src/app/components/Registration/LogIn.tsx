import { useState } from "react";
import styles from "./Login.module.css";
import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useAuth } from "../../utils/AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";

const StyledTextField = styled(TextField)({
  "& label": {
    color: "#ffffff !important",
  },
  "& input": {
    color: "white !important",
    backgroundColor: "#2b2b2b",
    padding: "10px",
    borderRadius: "5px",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      border: "none",
      boxShadow: "0 4px 7px rgba(0, 0, 0, 0.45)",
    },
    "&:hover fieldset": {
      border: "1px solid",
      borderColor: "#318CE7 !important",
    },
    "&.Mui-focused fieldset": {
      border: "1px solid",
      borderColor: "#318CE7 !important",
    },
  },
  "& .MuiFormHelperText-root": {
    color: "#ffffff",
    "&.Mui-error": {
      color: "#dc3545",
    },
  },
});

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const navigate = useNavigate(); // Initialize useNavigate
  const { login } = useAuth(); // Access the login function

  const handleLogin = () => {
    console.log("Login button clicked", formData);

    axios
      .post("http://localhost:8000/api/login/", formData)
      .then((res) => {
        console.log("Login successful", res);

        // Log the user in (store their data in context and localStorage)
        login({
          id: res.data.id,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          email: res.data.email,
        });

        // Navigate to the next page
        navigate("/dashboard");
      })
      .catch((err) => {
        console.error("Login failed", err);
      });
  };

  return (
    <div className={styles.loginContainer}>
      <header className={styles.loginHeader}>
        <h1>Log In</h1>
        <p className={styles.desc}>
          Welcome back! Log in to access your account.
        </p>
      </header>
      <main className={styles.inputFields}>
        <StyledTextField
          label="Email"
          variant="outlined"
          size="small"
          required
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <StyledTextField
          label="Password"
          variant="outlined"
          size="small"
          required
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
        />
      </main>
      <footer className={styles.loginFooter}>
        <button className={styles.loginBtn} onClick={handleLogin}>
          Log In
        </button>
        <p className={styles.register}>
          Don't have an account? <a href="/register">Sign up</a>
        </p>
      </footer>
    </div>
  );
}
