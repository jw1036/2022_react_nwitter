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
    <div className="container" style={{ marginTop: 80 }}>
      <form onSubmit={onSubmit} className="profileForm">
        <input
          type="text"
          placeholder="Display Name"
          autoFocus
          value={newDisplayName}
          onChange={onChange}
          className="formInput"
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{ marginTop: 10 }}
        />
      </form>
      <span onClick={onLogOutClick} className="formBtn cancelBtn logOut">
        Log Out
      </span>
    </div>
  );
};

export default Profile;
