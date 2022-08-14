import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService, firebaseInstance } from "fbase";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  const refreshUser = async () => {
    await authService.updateCurrentUser(
      authService.getAuth(firebaseInstance),
      authService.getAuth(firebaseInstance).currentUser
    );
    setUserObj(authService.getAuth(firebaseInstance).currentUser);
  };
  useEffect(() => {
    authService.onAuthStateChanged(
      authService.getAuth(firebaseInstance),
      (user) => {
        setUserObj(user);
        setInit(true);
      }
    );
  }, []);

  return (
    <>
      {init ? (
        <AppRouter
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
          refreshUser={refreshUser}
        />
      ) : (
        "Initializing..."
      )}
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App;
