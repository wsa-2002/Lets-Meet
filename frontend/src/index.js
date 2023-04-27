import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./i18n";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { MeetProvider } from "./containers/hooks/useMeet";
import { CookiesProvider } from "react-cookie";
import { ConfigProvider } from "antd";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <MeetProvider>
    <CookiesProvider>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: "Nunito",
          },
        }}
      >
        <App />
      </ConfigProvider>
    </CookiesProvider>
  </MeetProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
