import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainFrame from "./containers/Mainframe";
import Main from "./containers/Mainpage";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import Reset from "./containers/ResetPassword";
import Change from "./containers/ChangePassword";
import Meets from "./containers/Meets";
import MeetInfo from "./containers/MeetInfo";
import Voting from "./containers/Voting";

function App() {
  return (
    <>
      {/* <CssBaseline /> */}
      <BrowserRouter>
        <Routes>
          <Route element={<MainFrame />} path="/">
            <Route element={<Main />} path="/"></Route>
            <Route element={<Login />} path="/login"></Route>
            <Route element={<Signup />} path="/signup"></Route>
            <Route element={<Reset />} path="/reset"></Route>
            <Route element={<Change />} path="/reset-password"></Route>
            <Route element={<Meets />} path="/meets"></Route>
            <Route element={<MeetInfo />} path="/meets/:id"></Route>
            <Route element={<Voting />} path="/voting"></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
