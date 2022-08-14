import React, { useState } from "react";
import { dbService, firebaseInstance, storageService } from "fbase";

function Nweet({ nweetObj, isOwner }) {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const toggleEditing = () => setEditing((prev) => !prev);
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.updateDoc(
      dbService.doc(
        dbService.getFirestore(firebaseInstance),
        `nweets/${nweetObj.id}`
      ),
      {
        text: newNweet,
      }
    );
    setEditing(false);
  };
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    if (ok) {
      await dbService.deleteDoc(
        dbService.doc(
          dbService.getFirestore(firebaseInstance),
          `nweets/${nweetObj.id}`
        )
      );
      await storageService.deleteObject(
        storageService.ref(
          storageService.getStorage(firebaseInstance),
          nweetObj.attachmentUrl
        )
      );
    }
  };
  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type={"text"}
              placeholder="Edit your nweet"
              value={newNweet}
              required
              onChange={onChange}
            />
            <input type={"submit"} value="Update Nweet" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachmentUrl && (
            <img src={nweetObj.attachmentUrl} width="50px" height="50px" />
          )}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Nweet</button>
              <button onClick={toggleEditing}>Edit Nweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Nweet;
