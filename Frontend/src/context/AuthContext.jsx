import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if(storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setIsLoggedIn(true);
                setRole(parsedUser.role);
            } catch (error) {
                console.error("Failed to parse user from localStorage:", error);
            }
        }
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setIsLoggedIn(false);
        setUser(null);
        setRole(null);
    }

    return <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, role, setRole, user, setUser, logout }}>
        {children}
    </AuthContext.Provider>
};