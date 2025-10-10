import React, { createContext, useState, useEffect } from "react";

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(() => {
    // ✅ Check if session already exists in localStorage
    const saved = localStorage.getItem("sessionData");
    return saved ? JSON.parse(saved) : { accessToken: null, user: null };
  });

  // ✅ Automatically sync with localStorage whenever session changes
  useEffect(() => {
    if (session?.accessToken) {
      localStorage.setItem("sessionData", JSON.stringify(session));
    } else {
      localStorage.removeItem("sessionData");
    }
  }, [session]);

  // ✅ Logout function (optional)
  const logout = () => {
    setSession({ accessToken: null, user: null });
    localStorage.removeItem("sessionData");
  };

  return (
    <SessionContext.Provider value={{ session, setSession, logout }}>
      {children}
    </SessionContext.Provider>
  );
};
