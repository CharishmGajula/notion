import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarsignUp from '../Components/NavbarsignUp';
import img1 from "../assets/login_img.png";
import { MdOutlineMail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import {  signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useUser } from '../Context/useContext';


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate=useNavigate();
  const {setToken,setUser}=useUser();
  function checkData()
  {
    if(email=="")
    {
        setErr("Please provide the email Id");
        return false;
    }
    else if(!email.includes("@"))
    {
        setErr("Please enter a valid email Id");
        return false;
    }
    if(password=="")
    {
        setErr("Please Enter the password");
        return false;
    }
    setErr("");
    return true;
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!checkData()) return;
    try{
        const cred=await signInWithEmailAndPassword(auth,email,password);
        const tokenId=await cred.user.getIdToken();
        console.log(tokenId);
        const fetchJwt=await fetch("http://localhost:5005/api/auth/login",
            {
                method:"POST",
                headers:
                {
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({tokenId}),
            }
        );
        const data=await fetchJwt.json();
        console.log(data);
        localStorage.setItem("jwtToken",data.token);
        setToken(data.token);
        setUser(
            {
                name: data.name,
                email: data.email,
                uid: data.uid,
                role: data.role,
            }
        )
        console.log(data.token);
        navigate("/home");
    }
    catch(err)
    {
        console.log(err);
    }
}
  return (
    <>
      <NavbarsignUp button="SignUp" />
      
      <div className="flex flex-col md:flex-row  items-center justify-between  px-10 bg-white pt-20">
        
        <div className="w-1/2 flex flex-col justify-center items-start space-y-6 pr-6 ml-30">
          <div className="">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Welcome back!</h1>
            <p className="text-gray-600 text-lg">
              Access your workspace and stay organized, focused, and inspired.
            </p>
          </div>
          <img src="https://cdn.dribbble.com/userupload/22345329/file/original-4780b15a91f6c39007501637977be566.gif" alt="Login Visual" className="w-[80%] max-w-md" />
        </div>

        <div className="w-[380px] bg-white shadow-md rounded-xl p-8 border border-gray-200 mr-20">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Log In</h2>

          {err && <p className="text-red-500 text-sm mb-4">{err}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <MdOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="relative">
              <TbLockPassword className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-900 transition duration-200"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
