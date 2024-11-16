import styles from "./Registration.module.css";
import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledTextField = styled(TextField)({
  "& label": {
    color: "#ffffff !important",
  },

  "& input": {
    color: "white !important",
    backgroundColor: "#2b2b2b", // lighter gray background inside the input
    padding: "10px", // Optional: to add some padding around the text
    borderRadius: "5px", // Optional: to add rounded corners
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
    // style the slotPropr input icon color
    "& .MuiSvgIcon-root": {
      color: "#fff",
    },
    // style the slotProps end adornment icon button
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
  const matchList = [];
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
          />
          <StyledTextField
            label="Last Name"
            variant="outlined"
            size="small"
            required
          />
        </section>
        <StyledTextField
          label="Email"
          variant="outlined"
          size="small"
          required
        />
        <StyledTextField
          label="Password"
          variant="outlined"
          size="small"
          required
        />
      </main>
      <footer className={styles.registrationFooter}>
        <button className={styles.registerBtn}>Register</button>
        <p className={styles.login}>
          Already have an account? <a href="/login">Log in</a>
        </p>
      </footer>
    </div>
  );
}
