import { BrowserRouter, Routes, Route } from "react-router-dom";

import Main from "./Mainpage";

function App() {
  return (
    <>
      {/* <CssBaseline /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
