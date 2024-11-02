import { createContext, useState } from "react";
import Cookie from "js-cookie";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // load user if token is valid
  const loadUser = (user) => {
    setUser(user);
    setIsAuthenticated(true);
  };
  // logout
  const logOut = () => {
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
    Cookie.remove("token");
  };
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loadUser,
        logOut,
        isLoadingUser,
        setIsLoadingUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
