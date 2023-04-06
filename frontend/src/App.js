import { BrowserRouter, Routes, Route } from "react-router-dom";

import Main from "./containers/Mainpage";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import Reset from "./containers/ResetPassword";
import Change from "./containers/ChangePassword";

function App() {
  return (
    <>
      {/* <CssBaseline /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />}></Route>
          <Route element={<Login />} path="/login"></Route>
          <Route element={<Signup />} path="/signup"></Route>
          <Route element={<Reset />} path="/reset"></Route>
          <Route element={<Change />} path="/reset-password"></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
