import React, { useState } from "react";
import { dbService, firebaseInstance } from "../fbase";

const Home = () => {
  const [nweet, setNweet] = useState("");
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.addDoc(
      dbService.collection(dbService.getFirestore(firebaseInstance), "nweets"),
      {
        nweet,
        createdAt: Date.now(),
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
    </div>
  );
};

export default Home;
