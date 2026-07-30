import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const AuthContext =
createContext();

export const AuthProvider =
({ children }) => {

  const [user, setUser] =
  useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) setUser(JSON.parse(raw));
    } catch (err) {
      console.log(err)
      // ignore
    }
  }, []);


  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);