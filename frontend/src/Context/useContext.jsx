import { createContext, useContext, useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";
import { useNavigate} from "react-router-dom";

const userContext = createContext();

export function UserProvider({ children }) {
    const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [pages, setPages] = useState([]);

  useEffect(() => {
    async function fetchPages() {
      try {
        const res = await axios.get("http://localhost:5005/api/pages", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, 
          },
        });
        console.log(res.data);
        setPages(res.data.pages);
      } catch (err) {
        console.error("Failed to fetch pages", err);
      }
    }

    if (token) {
      fetchPages();
    }
  }, [token]);

  async function logout() {
    try {
      await signOut(auth);
      console.log("Firebase logout successful");
    } catch (err) {
      console.error("Firebase logout failed:", err);
    }
    localStorage.removeItem("jwtToken");
    setUser(null);
    setToken(null);
    setPages([]);
    navigate('/login')
  }

  return (
    <userContext.Provider
      value={{user,setUser,token,setToken,pages,setPages,logout,}}
    >
      {children}
    </userContext.Provider>
  );
}

export const useUser = () => useContext(userContext);
