import jwt from "jwt-decode";
import { useState, useContext, createContext, useEffect } from "react";
import { useCookies } from "react-cookie";
const MeetContext = createContext({
  login: false,
  error: "",
  loading: false,
  ID: 0,
});

const MeetProvider = (props) => {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [login, setLogin] = useState(cookies.token ?? false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ID, setID] = useState(0);

  const GLOBAL_LOGIN = (token) => {
    const decoded = jwt(token);
    //console.log(decoded);
    setCookie("token", token, { path: "/", expires: new Date(decoded.expire) });
    setLogin(decoded.is_google_login ? "google" : "notGoogle");
    setID(decoded.account_id);
  };

  useEffect(() => {
    if (cookies.token) {
      setLogin(jwt(cookies.token).is_google_login ? "google" : "notGoogle");
      setID(jwt(cookies.token).account_id);
    }
  }, [cookies]);

  return (
    <MeetContext.Provider
      value={{
        login,
        cookies,
        error,
        loading,
        ID,
        setError,
        setLogin,
        setLoading,
        setID,
        setCookie,
        removeCookie,
        GLOBAL_LOGIN,
      }}
      {...props}
    />
  );
};

const useMeet = () => useContext(MeetContext);

export { MeetProvider, useMeet };
