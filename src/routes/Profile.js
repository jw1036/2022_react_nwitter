import React from "react";
import { authService, firebaseInstance } from "fbase";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const onLogOutClick = () => {
    authService.signOut(authService.getAuth(firebaseInstance));
    navigate("/", { replace: true });
  };

  return <button onClick={onLogOutClick}>Log Out</button>;
};

export default Profile;
