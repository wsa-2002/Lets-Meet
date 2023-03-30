import styled from "styled-components";
import "@fontsource/roboto/500.css";
import "../css/Login.css";
import { Input, Button, Typography, Divider } from "antd";
import { useNavigate } from "react-router-dom";

const { Text, Link } = Typography;

const MainBackground = () => {

  return (
    <div className="mainContainer">
      <div className="leftContainer">
        <p className="title">Let's Meet!</p>
      </div>
      <div className="rightContainer">
      </div>
      <div className="leftFooter">
        <div>中文 | English</div>
      </div>
      <div className="rightFooter">
        <div>Copyright 2023</div>
      </div>
    </div>
  );
}

export default MainBackground;