import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
const coloredBackground = [
  "/signup",
  "/login",
  "/",
  "/reset",
  "reset-password",
];

const halfContainer = ["/voting", "/test"];

const AppFrame = () => {
  const location = useLocation();
  console.log(location.pathname);
  return (
    <>
      <div
        className={
          halfContainer.find((m) => m === location.pathname)
            ? "meetMainContainer"
            : "mainContainer"
        }
      >
        <Outlet />
        <Footer style={{ gridColumn: "1/3", gridRow: "3/4" }} />
      </div>
    </>
  );
};
export default AppFrame;
