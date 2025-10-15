// import React, { createContext, useState, useEffect } from "react";

// export const SessionContext = createContext();

// export const SessionProvider = ({ children }) => {
//   const [session, setSession] = useState(() => {
//     // ✅ Check if session already exists in localStorage
//     const saved = localStorage.getItem("sessionData");
//     return saved ? JSON.parse(saved) : { accessToken: null, user: null };
//   });

//   // ✅ Automatically sync with localStorage whenever session changes
//   useEffect(() => {
//     if (session?.accessToken) {
//       localStorage.setItem("sessionData", JSON.stringify(session));
//     } else {
//       localStorage.removeItem("sessionData");
//     }
//   }, [session]);

//   // ✅ Logout function (optional)
//   const logout = () => {
//     setSession({ accessToken: null, user: null });
//     localStorage.removeItem("sessionData");
//   };

//   return (
//     <SessionContext.Provider value={{ session, setSession, logout }}>
//       {children}
//     </SessionContext.Provider>
//   );
// };

import React, { createContext, useState, useEffect } from "react";

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(() => {

    // 🔹 Check if session data already exists in localStorage
    const saved = localStorage.getItem("sessionData");
        console.log('inside session',saved)
    return saved
      ? JSON.parse(saved)
      : {
          accessToken: null, // For normal user
          adminToken: null, // For admin (optional)
          user: null,       // User info object
          role: null,       // "user" or "admin"
        };
  });

  // 🔹 Sync session with localStorage whenever it changes
  useEffect(() => {
    if (session?.accessToken || session?.adminToken) {
      localStorage.setItem("sessionData", JSON.stringify(session));
    } else {
      localStorage.removeItem("sessionData");
    }
  }, [session]);

  // 🔹 Logout function
  const logout = () => {
    setSession({
      accessToken: null,
      adminToken: null,
      user: null,
      role: null,
    });
    localStorage.removeItem("sessionData");
  };

  return (
    <SessionContext.Provider value={{ session, setSession, logout }}>
      {children}
    </SessionContext.Provider>
  );
};

