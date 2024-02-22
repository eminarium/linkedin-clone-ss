import React, { useState } from 'react'
import './Login.css'
import { auth } from './firebase';
import linkedin_large_logo from './assets/logo-r.png'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useDispatch } from 'react-redux';
import { login } from './features/userSlice';

function Login() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [profilePic, setProfilePic] = useState('')
  
  const dispatch = useDispatch()

  const loginToApp = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
    .then((usercredential) => {
      dispatch(login({
        email: auth.currentUser.email,
        uid: auth.currentUser.uid,
        displayName: name,
        photoUrl: profilePic        
      }))
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    })
  }

  const register = () => {
    if (!name) {
      return alert("Please enter a full name !")
    }

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      updateProfile(auth.currentUser, {
        displayName: name, 
        photoUrl: profilePic
      }).then(() => {
        console.log("Profile updated")
        // Profile updated!
        // ...
        dispatch(login({
          email: auth.currentUser.email,
          uid: auth.currentUser.uid,
          displayName: name,
          photoUrl: profilePic
        }))
      }).catch((error) => {
        // An error occurred
        // ...
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    })
    
  }

  return (
    <div className='login'>
      <img 
        src={require('./assets/logo-r.png')}
        alt=""
      />

      <form>
        <input placeholder='Full name (required if registering)' value={name} onChange={e => setName(e.target.value)} type="text" />
        <input placeholder="Profile pic URL (optional)" value={profilePic} onChange={e => setProfilePic(e.target.value)} type="text" />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} type="email" />
        <input placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} type="password" />
        <button type="submit" onClick={loginToApp}>Sign In</button>
      </form>

      <p>Not a member?  
        <span className='login__register' onClick={register}>Register Now</span>
      </p>
    </div>
  )
}

export default Login