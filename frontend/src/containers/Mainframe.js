import React from "react";
import { Outlet } from "react-router-dom";

const AppFrame = () => {
  return (
    <div className="mainContainer">
      <Outlet />
      <div className="leftFooter">
        <div>中文 | English</div>
      </div>
      <div className="rightFooter">
        <div>Copyright 2023</div>
      </div>
    </div>
  );
};
export default AppFrame;
