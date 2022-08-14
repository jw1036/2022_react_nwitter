import Nweet from "components/Nweet";
import React, { useState, useEffect } from "react";
import { dbService, firebaseInstance, storageService } from "fbase";
import { v4 as uuidv4 } from "uuid";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState();
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
    const storage = storageService.getStorage(firebaseInstance);
    const fileRef = storageService.ref(storage, `${userObj.uid}/${uuidv4()}`);
    const response = await storageService.uploadString(
      fileRef,
      attachment,
      "data_url"
    );
    console.log(response);

    // await dbService.addDoc(
    //   dbService.collection(dbService.getFirestore(firebaseInstance), "nweets"),
    //   {
    //     text: nweet,
    //     createdAt: Date.now(),
    //     creatorId: userObj.uid,
    //   }
    // );
    setNweet("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onload = (finishedEvent) => {
      const {
        target: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttachmentClick = () => setAttachment("");
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
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value={"Nweet"} />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" />
            <button onClick={onClearAttachmentClick}>Clear</button>
          </div>
        )}
      </form>
      <div>
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
