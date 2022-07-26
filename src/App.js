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
  const [processState, setProcessState] = useState("start")
  const [percent, setPercent] = useState(0)
  const [downloadLink, setDownloadLink] = useState()
  const [isDoneUploading, setIsDoneUploading] = useState(false);
  const provider = new GoogleAuthProvider()

  const requestOptions   = {
    fileName: "Nkululeko",
  } 
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const downloadFinal = async () => {
    console.log("Before")
    await delay(12000)
    getDownloadURL(ref(storage, `/impressor/images/impressored_${file.name}`))
        .then((url) => {
          // `url` is the download URL for 'images/stars.jpg'
          console.log(url);
          setDownloadLink(url);
          // This can be downloaded directly:
          // const xhr = new XMLHttpRequest();
          // xhr.responseType = 'blob';
          // xhr.onload = (event) => {
          //   const blob = xhr.response;
          // };
          // xhr.open('GET', url);
          // xhr.send();

          // Or inserted into an <img> element
          // const img = document.getElementById('myimg');
          // img.setAttribute('src', url);
          console.log("Function Done");
          setProcessState("download")
        })
        .catch((error) => {
          // Handle any errors
        });
    console.log("After")
    setLoading(false);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessState("loading")
    setLoading(true);
    const storageRef = ref(storage, `/impressor/images/${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const tempPercent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        // update progress
        console.log(tempPercent);
        setPercent(tempPercent);
      },
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(url);
          setIsDoneUploading(true)
          downloadFinal()
        });
      }
    );
  }
    const handleChange = (e) => {
      setFile(e.target.files[0])
      console.log(e.target.files[0])
  }
  const sendToSever = async (e) => {
    let formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(
        "https://localhost:8080/upload",
        formData
      );
      console.log(res);
    } catch (ex) {
      console.log(ex);
    }
  }

  const processRoute = () => {
    if (processState === 'loading') {
      return <Loading />
    } else if (processState === 'start') {
      return <UploadImage handleSubmit={handleSubmit} handleChange={handleChange} file={file} />
    } else if (processState === 'download') {
      return <Download downloadUrl={downloadLink}/>
    }
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
            {/* <button onClick={signInFunction}>Sign In</button> */}
            <button onClick={sendToSever}>Send</button>
          </div>
          <div className="action bg-white text-center flex flex-col justify-center items-center shadow-md md:w-1/2 px-12 md:py-4 md:mt-0 mt-6 h-full rounded-xl">
              <div className="header">
                <h1 className="title font-bold uppercase text-blue-400 text-2xl">Universal Impressoring</h1>
                <p className="uppercase text-gray-500 text-sm">For Facebook, WhatsApp and instagram</p>
              </div>
              <div className="workarea md:mt-20 mt-8">
                {
                processRoute()
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
const Download = (props) => {
  return (
    <>
      <div className="upload w-full justify-center" onSubmit={props.handleSubmit}>
        <img src={props.dowloadUrl} className="w-full h-auto" alt="" />

        <a className="mt-8 text-white bg-gradient-to-l w-full delay-1.5 cursor-pointer from-blue-300 via-blue-400 rounded py-2 px-6 font-semibold to-blue-500" href={props.downloadUrl} download>DOWNLOAD IMAGE</a>
      </div>
    </>
  )
}

const Loading = (props) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <svg className="animate-spin -ml-1 mr-3 md:h-12 md:w-12 w-8 h-8 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        <h2 className="text-center text-blue-500 text-xl font-semibold mt-4">Impressoring...</h2>
      </div>
    </>
  )
}
