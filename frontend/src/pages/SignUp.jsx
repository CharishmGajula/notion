import React, { useState } from 'react'
import {auth,db} from "../firebase"
import NavbarsignUp from '../Components/NavbarsignUp'
import { CgProfile } from "react-icons/cg";
import { MdOutlineMail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, Timestamp,doc,serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';


export default function SignUp() {
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [confirmPassword,setConfirmPassword]=useState("");
  const [err,setErr]=useState("");
  const navigate=useNavigate();
  function checkInput()
  {
    if(name=="")
    {
        setErr("Please mention the name")
        return false;
    }
    else if(name.length>25)
    {
        setErr("Name can only contain 25 letters")
        return false;
    }
    else if(!/^[A-Za-z ]+$/.test(name))
    {
        setErr("Name can only contain letters an spaces");
        return false;
    }

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
    else if(password.length<8)
    {
        setErr("Password Should contain min 8 letters")
        return false;
    }

    if(confirmPassword=="")
    {
        setErr("Please Confirm your password");
        return false;
    }

    if(password!=confirmPassword)
    {
        setErr("Password did not match");
        return false;
    }

    setErr("");
    return true;
  }
  async function handleSubmit(e)
  {
    e.preventDefault();
    const c=checkInput();
    if(!c)
    {
        return;
    }
    setErr("");
    try{
        const createUser=await createUserWithEmailAndPassword(auth,email,password);
        const tokenId=await createUser.user.getIdToken();
        console.log(tokenId);
        const register=await fetch("http://localhost:5005/api/auth/register",
            {
                method:"POST",
                headers:
                {
                    "Content-Type":"application/json",
                },
                body:JSON.stringify(
                    { 
                        token: tokenId,
                        name: name,
                    }
                )
            }
        )
        const result = await register.json();

        if (!register.ok) {
            setErr(result?.error || "Registration failed");
        return;
        }

        console.log("Registration successful:", result);
        navigate("/login");
    }catch(error)
    {
        console.log(error);
        
    }
  }
  return (
     <>
      <NavbarsignUp button="Log In" />

      <div className="flex flex-col md:flex-row min-h-screen bg-white">
        <div className="flex flex-col justify-center items-start px-10 pb-2 md:w-1/2">
          <h1 className="text-5xl font-extrabold text-black mb-6 leading-tight">
            The <span className="text-blue-600 font-bold">WORKSPACE</span> <br />
            that works for you!
          </h1>
          <p className="text-lg text-gray-700">
            Behind every productive person is a <span className="font-semibold text-blue-600">SYSTEM</span> that works. 
            With <span className="font-semibold text-blue-600">Notion</span>, that system is simple, beautiful, and uniquely yours.
          </p>
        </div>

        <div className="flex justify-center min-h-screen items-center px-6 py-16 md:w-1/2 bg-white">
          <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Sign Up to Start</h2>
            {err && <p className="text-red-500 text-sm mb-1">{err}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <CgProfile className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="relative">
                <MdOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="relative">
                <TbLockPassword className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="relative">
                <TbLockPassword className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transform hover:scale-105 transition duration-300"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
    
  )
}
