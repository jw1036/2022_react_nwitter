import React, { useState, useEffect } from "react";
import { authService, dbService, firebaseInstance } from "fbase";
import { useNavigate } from "react-router-dom";

const Profile = ({ userObj, refreshUser }) => {
  const navigate = useNavigate();
  const getNweets = async () => {
    const querySnapshot = await dbService.getDocs(
      dbService.query(
        dbService.collection(
          dbService.getFirestore(firebaseInstance),
          "nweets"
        ),
        dbService.where("creatorId", "==", userObj.uid),
        dbService.orderBy("createdAt")
      )
    );
    querySnapshot.docs.map((doc) => console.log(doc.data()));
  };
  useEffect(() => {
    getNweets();
  }, []);
  const onLogOutClick = () => {
    authService.signOut(authService.getAuth(firebaseInstance));
    navigate("/", { replace: true });
  };

  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (newDisplayName !== userObj.displayName) {
      await authService.updateProfile(userObj, { displayName: newDisplayName });
      refreshUser();
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Display Name"
          required
          value={newDisplayName}
          onChange={onChange}
        />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;
