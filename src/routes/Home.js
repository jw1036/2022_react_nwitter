import Nweet from "components/Nweet";
import React, { useState, useEffect } from "react";
import { dbService, firebaseInstance } from "fbase";
import NweetFactory from "components/NweetFactory";

const Home = ({ userObj }) => {
  const [nweets, setNweets] = useState([]);
  useEffect(() => {
    return dbService.onSnapshot(
      dbService.collection(dbService.getFirestore(firebaseInstance), "nweets"),
      (snapshop) => {
        const nweetArray = snapshop.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNweets(nweetArray);
      }
    );
  }, []);

  return (
    <div className="container" style={{ marginTop: 80 }}>
      <NweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
