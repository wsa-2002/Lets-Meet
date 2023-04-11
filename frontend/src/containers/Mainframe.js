import React from "react";
import { Outlet, useLocation } from "react-router-dom";

const AppFrame = () => {
  const location = useLocation();
  console.log(location.pathname);
  return (
    <div
      className={
        location.pathname === "/voting" ? "meetMainContainer" : "mainContainer"
      }
      // className="meetMainContainer"
    >
      <Outlet />
      <div
        className="leftFooter"
        style={{
          backgroundColor:
            (location.pathname === "/" || location.pathname === "/signup") &&
            "#fefcef",
        }}
      >
        <div>中文 | English</div>
      </div>
      <div className="rightFooter">
        <div>Copyright 2023</div>
      </div>
    </div>
  );
};
export default AppFrame;
