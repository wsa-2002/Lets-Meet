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

  // useEffect(() => {
  //   const Render = async () => {
  //     try {
  //       const newItem = await CRUD(
  //         "R",
  //         "/basket"
  //       )({ customer_id: cookies.customer_id });
  //       setCartNumber(newItem && newItem.length);
  //     } catch (err) {
  //       console.log("有問題");
  //     }
  //   };
  //   if (cookies.customer_id) {
  //     Render();
  //   }
  // }, [cookies.customer_id]);

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
