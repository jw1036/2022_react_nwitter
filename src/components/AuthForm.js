import { authService, firebaseInstance } from "fbase";
import React, { useState } from "react";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");
  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      let data;
      if (newAccount) {
        data = await authService.createUserWithEmailAndPassword(
          authService.getAuth(firebaseInstance),
          email,
          password
        );
      } else {
        data = await authService.signInWithEmailAndPassword(
          authService.getAuth(firebaseInstance),
          email,
          password
        );
      }
      console.log(data);
    } catch (error) {
      setError(error.message);
    }
  };
  const toggleAccount = () => setNewAccount((prev) => !prev);

  return (
    <form onSubmit={onSubmit}>
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={onChange}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={onChange}
      />
      <input type="submit" value={newAccount ? "Create Account" : "Log In"} />
      {error}
      <span onClick={toggleAccount}>
        {newAccount ? "Log In" : "Create Account"}
      </span>
    </form>
  );
};

export default AuthForm;
