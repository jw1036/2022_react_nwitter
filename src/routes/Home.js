import React, { useState, useEffect } from "react";
import { dbService, firebaseInstance } from "../fbase";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
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
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.addDoc(
      dbService.collection(dbService.getFirestore(firebaseInstance), "nweets"),
      {
        text: nweet,
        createdAt: Date.now(),
        creatorId: userObj.uid,
      }
    );
    setNweet("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value={"Nweet"} />
      </form>
      <div>
        {nweets.map((nweet) => (
          <div key={nweet.id}>
            <h4>{nweet.text}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
