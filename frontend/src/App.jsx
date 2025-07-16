import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes,Route } from 'react-router-dom'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import "./App.css"
import Dashboard from './pages/Dashboard'
import { useUser } from './Context/useContext'
function App() {
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
        <Route path="/dashboard" element={<Dashboard/>}/>
      </Routes>
    </>
  )
}

export default App
