import styles from "./signIn.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ItemContext } from "../ItemContext";
import { useContext } from "react";
const apiUrl = import.meta.env.VITE_BLOG_API_URL;

const SignIn = () => {
  const [login, setLogin] = useState({
    username: "",
    password: "",
  });
  const [signUp, setSignUp] = useState({
    username: "",
    displayName: "",
    password: "",
    confirmPassword: "",
  });
  const [loginPage, setLoginPage] = useState(true);
  const { setAuth } = useContext(ItemContext);
  const navigate = useNavigate();

  function onChangeHandler(event) {
    const { name, value } = event.target;
    setLogin((prevLogin) => ({
      ...prevLogin,
      [name]: value,
    }));
  }

  function onChangeSignUpValues(event) {
    const { name, value } = event.target;
    setSignUp((prevSignUp) => ({
      ...prevSignUp,
      [name]: value,
    }));
  }

  function onChangeSignInPage(value) {
    setLoginPage(value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (login.username == "" || login.password == "") {
      return alert("You need to fill in all the field");
    }

    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(login),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.removeItem("authorization");
        localStorage.setItem("authorization", `Bearer ${data.token}`);
        setAuth(true);
        navigate("/account", { replace: true });
      } else {
        const result = await response.json();
        console.error(result.errors);
        alert("Error, see console logs");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    if (
      signUp.username == "" ||
      signUp.password == "" ||
      signUp.displayName == "" ||
      signUp.confirmPassword == ""
    ) {
      return alert("You need to fill in all the field");
    }

    try {
      const response = await fetch(`${apiUrl}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUp),
      });

      if (response.ok) {
        setLoginPage(true);
      } else {
        const result = await response.json();
        console.error(result.errors);
        alert("Error, see console logs");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div className={styles.signIn}>
      {loginPage ? (
        <>
          <label htmlFor="username">
            Username:{" "}
            <input
              type="email"
              name="username"
              id="username"
              value={login.username}
              onChange={onChangeHandler}
            />
          </label>
          <label htmlFor="password">
            Password:{" "}
            <input
              type="password"
              name="password"
              id="password"
              value={login.password}
              onChange={onChangeHandler}
            />
          </label>
          <button onClick={handleSubmit}>Submit</button>
          <button
            onClick={() => onChangeSignInPage(false)}
            style={{ backgroundColor: "purple" }}
          >
            Sign-Up
          </button>
        </>
      ) : (
        <>
          <label htmlFor="displayName">
            Display Name:{" "}
            <input
              type="text"
              name="displayName"
              id="displayName"
              value={signUp.displayName}
              onChange={onChangeSignUpValues}
            />
          </label>
          <label htmlFor="username">
            Username:{" "}
            <input
              type="email"
              name="username"
              id="username"
              value={signUp.username}
              onChange={onChangeSignUpValues}
            />
          </label>
          <label htmlFor="password">
            Password:{" "}
            <input
              type="password"
              name="password"
              id="password"
              value={signUp.password}
              onChange={onChangeSignUpValues}
            />
          </label>
          <label htmlFor="confirmPassword">
            Confirm Password:{" "}
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={signUp.confirmPassword}
              onChange={onChangeSignUpValues}
            />
          </label>
          <button onClick={handleSignUpSubmit}>Submit</button>
          <button
            onClick={() => onChangeSignInPage(true)}
            style={{ backgroundColor: "purple" }}
          >
            Log-In
          </button>
        </>
      )}
    </div>
  );
};

export default SignIn;
