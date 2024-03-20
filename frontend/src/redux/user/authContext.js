import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { REQUEST_HEADER } from "../../config/apiConfig";
import { findReqUser } from "./action";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const setAxiosToken = (token) => {
  axios.defaults.headers.common[REQUEST_HEADER] = `Bearer ${token}`;
};

const deleteAxiosToken = () => {
  delete axios.defaults.headers.common[REQUEST_HEADER];
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const authToken = localStorage.getItem("social-media-token");
    if (authToken) {
      setAxiosToken(authToken);
    }
    return authToken || null;
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      setAxiosToken(token);
      dispatch(findReqUser(authSignOut));
    } else {
      deleteAxiosToken();
    }
  }, [token]);

  const authSignIn = (token) => {
    localStorage.removeItem("social-media-token");
    localStorage.setItem("social-media-token", token);
    setToken(token);
    setAxiosToken(token);
  };

  const authSignOut = () => {
    localStorage.removeItem("social-media-token");
    setToken(null);
    deleteAxiosToken();
  };

  return (
    <AuthContext.Provider value={{ token, authSignIn, authSignOut }}>
      {children}
    </AuthContext.Provider>
  );
};
