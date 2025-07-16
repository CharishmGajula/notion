import { createContext,useContext,useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
const userContext=createContext();

export function UserProvider({children})
{
    const [user,setUser]=useState(null);
    const [token, setToken]=useState(null);

    async function logout()
    {
        try{
            await signOut(auth);
            console.log("Firebase logout successful");
        }
        catch{
            console.error("Firebase logout failed:", err);
        }
         localStorage.removeItem("jwtToken");
        setUser(null);
        setToken(null);
    }

    return (
        <userContext.Provider value={{user,setUser,token,setToken,logout}}>
            {children}
        </userContext.Provider>
    );
}
export const useUser = () => useContext(userContext);