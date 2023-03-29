import { BrowserRouter, Routes, Route } from "react-router-dom";

import Main from "./Mainpage";
import Login from "./containers/Login";
import Signup from "./containers/Signup";

function App() {
  return (
    <>
      {/* <CssBaseline /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />}></Route>
          <Route element={<Login />} path="/login"></Route>
          <Route element={<Signup />} path="/signup"></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
