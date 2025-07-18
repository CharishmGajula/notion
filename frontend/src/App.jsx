import { useState,useEffect } from 'react'
import { Routes,Route, Navigate } from 'react-router-dom'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import "./App.css"
import Dashboard from './pages/Dashboard'
import { useUser } from './Context/useContext'
import BlockEditor2 from './Components/BlockEditor2'
import Home from './pages/Home'
function App(){
  const { setUser, setToken, logout } = useUser();
  useEffect(() => {
  const token = localStorage.getItem("jwtToken");
  if (token) {
    setToken(token); 
    fetch("http://localhost:5005/api/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Unauthorized");
          return res.json();
        })
        .then((data) => {
          setUser({
            name: data.name,
            email: data.email,
            uid: data.uid,
            role: data.role,
          });
        })
        .catch((err) => {
          console.error("Auto-login failed:", err);
          logout(); 
        });
    }
  }, []);
  return (
    <>
      <Routes>
        <Route path="/" element={<SignUp/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path='/page/:pageId' element={<Dashboard/>}/>
      </Routes>
    </>
  )
}

export default App
