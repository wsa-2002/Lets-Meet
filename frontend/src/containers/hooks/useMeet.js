import jwt from "jwt-decode";
import { useState, useContext, createContext, useEffect } from "react";
import { useCookies } from "react-cookie";
import { getUserInfo } from "../../middleware";

const MeetContext = createContext({
  login: false,
  error: "",
  loading: false,
  USERINFO: {},
});

const MeetProvider = (props) => {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [login, setLogin] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [USERINFO, setUSERINFO] = useState({});

  const GLOBAL_LOGIN = (token) => {
    const { expire, is_google_login } = jwt(token);
    setCookie("token", token, { path: "/", expires: new Date(expire) });
    setLogin(is_google_login ? "google" : "notGoogle");
  };

  useEffect(() => {
    if (cookies.token) {
      setLogin(jwt(cookies.token).is_google_login ? "google" : "notGoogle");
    }
  }, [cookies]);

  useEffect(() => {
    (async () => {
      if (login) {
        const {
          data: {
            id: ID,
            username,
            email,
            line_token,
            notification_preference,
          },
        } = await getUserInfo(
          undefined,
          cookies.token,
          jwt(cookies.token).account_id
        );
        setUSERINFO({
          ID,
          username,
          email,
          line_token,
          notification_preference,
        });
      } else {
        setUSERINFO({});
      }
    })();
  }, [login, USERINFO.ID]);

  return (
    <MeetContext.Provider
      value={{
        login,
        cookies,
        error,
        loading,
        USERINFO,
        setError,
        setLogin,
        setLoading,
        setUSERINFO,
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
