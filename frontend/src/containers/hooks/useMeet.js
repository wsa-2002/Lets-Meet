import { useState, useContext, createContext, useEffect } from "react";
import { useCookies } from "react-cookie";
import jwt from "jwt-decode";
const MeetContext = createContext({
  login: false,
});

const MeetProvider = (props) => {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [login, setLogin] = useState(cookies.token ?? false);

  const GLOBAL_LOGIN = (token) => {
    const decoded = jwt(token);
    setCookie("token", token, { path: "/", expires: new Date(decoded.expire) });
    setLogin(true);
  };

  useEffect(() => {
    if (cookies.token) {
      setLogin(true);
    }
  }, [cookies]);

  return (
    <MeetContext.Provider
      value={{
        login,
        cookies,
        setLogin,
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
