import React, { useState, useEffect } from 'react'
import { serverTimestamp, onSnapshot, orderBy, query, collection, addDoc } from "firebase/firestore"
import "./Feed.css"
import InputOption from './InputOption'
import Post from './Post'
import CreateIcon from "@material-ui/icons/Create"
import ImageIcon from "@material-ui/icons/Image"
import SubscriptionsIcon from "@material-ui/icons/Subscriptions"
import EventNoteIcon from "@material-ui/icons/EventNote"
import CalendarViewDayIcon from "@material-ui/icons/CalendarViewDay"
import { db } from "./firebase.js"
import { useSelector } from 'react-redux'
import { selectUser } from './features/userSlice.js'
import FlipMove from 'react-flip-move'


function Feed() {
  const user = useSelector(selectUser)
  const [input, setInput] = useState('')
  const [posts, setPosts] = useState([])

  const getPosts = () => {
    onSnapshot(query(collection(db, "posts"), orderBy("timestamp", "desc")), (snapshot) => {
        const newData = snapshot.docs.map((doc) => (
          {
            ...doc.data(), 
            id:doc.id 
          }
        )
      )
      setPosts(newData);            
    })
  }
  
  const sendPost = async (e) => {
    e.preventDefault();
    
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        name: user.displayName,
        description: user.email,
        message: input,
        photoUrl: user.photoUrl || "",
        timestamp: serverTimestamp()
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }   
    
    setInput('')
  }
  
  useEffect(() => {
    getPosts();
  }, [])

  return (
    <div className='feed'>
      <div className="feed__inputContainer">
        <div className="feed__input">
          <CreateIcon />
          <form>
            <input type="text" value={input} onChange={e => setInput(e.target.value)} />
            <button onClick={sendPost} type="submit">Send</button>
          </form>
        </div>

        <div className="feed__inputOptions">
          <InputOption Icon={ImageIcon} title="Photo" color="#70B5F9" />
          <InputOption Icon={SubscriptionsIcon} title="Video" color="#E7A33E" />
          <InputOption Icon={EventNoteIcon} title="Event" color="#C0CBCD" />
          <InputOption Icon={CalendarViewDayIcon} title="Write Article" color="#7FC15E" />
        </div>
      </div>
      <FlipMove>
        {
          posts && posts.map(({id, name, description, message}) => (
            <Post key={id} name={name} description={description} message={message} />
          ))
        }
      </FlipMove>
    </div>
  )
}

export default Feed