import { useState } from "react";
import styles from "./Registration.module.css";
import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useAuth } from "../AuthContext/AuthContext";
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
  "& textarea": {
    color: "white !important",
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
    "& .MuiSvgIcon-root": {
      color: "#fff",
    },
    "& .MuiIconButton-root": {
      color: "#fff",
      backgroundColor: "#2b2b2b",
      width: "40px",
      height: "40px",
    },
  },
  "& .MuiFormHelperText-root": {
    color: "#ffffff",
    "&.Mui-error": {
      color: "#dc3545",
    },
  },
});

export default function Registration() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
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

  const handleRegister = () => {
    console.log("Register button clicked", formData);

    console.log("Sending registration request");
    axios
      .post("http://localhost:8000/api/register/", formData)
      .then((res) => {
        console.log("Registration successful", res);

        // Log the user in (store their data in context and localStorage)
        login({
          id: res.data.id,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          email: res.data.email,
        });

        // Navigate to the next page
        navigate("/read-muse");
      })
      .catch((err) => {
        console.error("Registration failed", err);
      });
  };

  return (
    <div className={styles.registrationContainer}>
      <header className={styles.registrationHeader}>
        <h1>Sign Up</h1>
        <p className={styles.desc}>Join the Neuromance community today!</p>
      </header>
      <main className={styles.inputFields}>
        <section className={styles.nameFields}>
          <StyledTextField
            label="First Name"
            variant="outlined"
            size="small"
            required
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
          />
          <StyledTextField
            label="Last Name"
            variant="outlined"
            size="small"
            required
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </section>
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
          label="Age"
          variant="outlined"
          size="small"
          required
          name="age"
          value={formData.age}
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
      <footer className={styles.registrationFooter}>
        <button className={styles.registerBtn} onClick={handleRegister}>
          Register
        </button>
        <p className={styles.login}>
          Already have an account? <a href="/login">Log in</a>
        </p>
      </footer>
    </div>
  );
}
