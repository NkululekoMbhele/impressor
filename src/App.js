import React, {useState, useEffect} from 'react';
import './App.css';
import Navbar from './components/Navbar';
import PreviousMap from 'postcss/lib/previous-map';
import {db, storage, auth} from "./firebase"
import {
  ref,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage";
import axios from 'axios';
import useLogin from './hooks/useLogin'
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

function App() {
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState("")
  const [loading, setLoading] = useState(false)
  const [percent, setPercent] = useState(0)
  const [user, setUser] = useState()
  const [isOnline, setIsOnline] = useState(null);
  const provider = new GoogleAuthProvider();

  // Sign In Pop up initiator
  const signInFunction = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(user)
        setUser(user);
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }
  const requestOptions   = {
    fileName: "Nkululeko",
  } 



  const handleSubmit = (e) => {
    e.preventDefault();
    const storageRef = ref(storage, `/impressor/images/${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file);
    setLoading(true);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const tempPercent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        // update progress
        setPercent(tempPercent);
      },
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(url);
        });
      }
    );
    axios.post('https://europe-west1-nkululekoprojects-1353e.cloudfunctions.net/impressorBasic', {fileName: file.name})
      .then(response => console.log(response))
      .catch(function (error) {
        console.log(error);
      })
      setLoading(false);
  }
  const handleChange = (e) => {
    setFile(e.target.files[0])
    console.log(e.target.files[0])
  }
  const handleSignIn = () => {
    console.log("Begin");
    console.log(user);
  }
  return (
    <>
      <section className="bg-gradient-to-l from-blue-200 via-blue-300 to-blue-500 w-screen min-h-screen h-screen">
        <Navbar />
        <header className="md:px-40 flex justify-between md:flex-row flex-col  items-center h-5/6 md:py-16 pt-6">
          <div className="text">
            <h1 className="text-white md:text-left text-center font-bold md:text-4xl text-lg md:leading-tight"><span className="text-yellow-200">IM</span>PRESSOR COMPRESSES <br/>
              YOUR IMAGES TO RETAIN <br/>
              <span className="text-yellow-200">QUALLITY</span> WHEN POSTING <br/>
              ON <span className="text-yellow-200">SOCIAL MEDIA</span></h1> 
            <button onClick={signInFunction}>Sign In</button>
          </div>
          <div className="action bg-white text-center flex flex-col justify-center items-center shadow-md md:w-1/2 px-12 md:py-4 md:mt-0 mt-6 h-full rounded-xl">
              <div className="header">
                <h1 className="title font-bold uppercase text-blue-400 text-2xl">Universal Impressoring</h1>
                <p className="uppercase text-gray-500 text-sm">For Facebook, WhatsApp and instagram</p>
              </div>
              <div className="workarea md:mt-20 mt-8">
                {
                  loading ? (
                    <Loading />
                  ) : (
                    <UploadImage handleSubmit={handleSubmit} handleChange={handleChange} file={file}/>
                  )
                }
              </div>
          </div>
        </header>
    </section>
    </>
  );
}

export default App;

const UploadImage = (props) => {
  return (
    <>
      <form className="upload w-full justify-center" onSubmit={props.handleSubmit}>
        <label className="w-80 flex flex-col items-center px-4 py-6 bg-gray-100 text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue-200 cursor-pointer hover:bg-blue hover:text-white">
          <svg className="w-8 h-8 text-blue-300" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
          </svg>
          {
            (props.file) ? (
              <span className="mt-2 text-base text-green-500 leading-normal delay-150 text-sm">Image uploaded: {props.file.name}</span>
            ) : (
                <span className="mt-2 text-base text-blue-500 leading-normal delay-150">Select an image</span>
            )
          }
          <input type='file' className="hidden" name="image" id="image" onChange={(e) => props.handleChange(e)} />
        </label>
        <input className="mt-8 text-white bg-gradient-to-l w-full delay-1.5 cursor-pointer from-blue-300 via-blue-400 rounded py-2 px-6 font-semibold to-blue-500" type="submit" value="IMPRESSOR THE IMAGE" />
      </form>
    </>
  )
}

const Loading = (props) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <svg className="animate-spin -ml-1 mr-3 md:h-12 md:w-12 w-8 h-8 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        <h2 className="text-center text-blue-500 text-xl font-semibold mt-4">Impressoring...</h2>
      </div>
    </>
  )
}
