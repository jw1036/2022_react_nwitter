import React, { useEffect } from "react";
import { authService, dbService, firebaseInstance } from "fbase";
import { useNavigate } from "react-router-dom";

const Profile = ({ userObj }) => {
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

  return <button onClick={onLogOutClick}>Log Out</button>;
};

export default Profile;
