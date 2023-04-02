import React, { useState } from "react";
import "@fontsource/roboto/500.css";
import "../css/Login.css";
import { Input, Button, Typography, Divider } from "antd";
import { useNavigate } from "react-router-dom";
import * as AXIOS from "../middleware";
const { Text, Link } = Typography;

const LogIn = () => {
  const [signupData, setSignupData] = useState({
    Email: "",
    Username: "",
    Password: "",
    "Confirm Password": "",
  });
  const [validPassword, setValidPassword] = useState(true);

  const navigate = useNavigate();

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "Password") {
      if (/[#$%&\*\\\/]/.test(value)) {
        setValidPassword(false);
      } else {
        setValidPassword(true);
      }
    }
  };

  const handleSignUpClick = async () => {
    if (signupData.Password !== signupData["Confirm Password"]) {
      console.log("請輸入相同密碼");
    } else if (
      !signupData.Username ||
      !signupData.Password ||
      !signupData.Email
    ) {
      try {
        await AXIOS.signup({
          username: signupData.Username,
          password: signupData.Password,
          email: signupData.Email,
        });
        navigate("/Login");
      } catch (e) {
        alert(e);
      }
    }
  };

  return (
    <div className="mainContainer">
      <div className="leftContainer">
        <p className="title">Let's Meet!</p>
      </div>
      <div className="rightContainer">
        <div className="loginContainer">
          <h1>Welcome to Let's Meet</h1>
          {Object.keys(signupData).map((m, index) => (
            <Input
              placeholder={m}
              style={{
                width: "100%",
                height: "45px",
                borderRadius: "15px",
                marginBottom: "30px",
              }}
              key={index}
              name={m}
              onChange={handleSignupChange}
            />
          ))}
          <Button
            size={"large"}
            style={{
              background: "#B3DEE5",
              borderRadius: "15px",
              // position: "relative",
              // left: "50%",
              // transform: "translate(-50%, 0)",
            }}
            onClick={handleSignUpClick}
            disabled={
              !signupData.Username ||
              !signupData.Password ||
              !signupData.Email ||
              !signupData["Confirm Password"]
            }
          >
            Sign Up
          </Button>
          <Divider>or</Divider>
          <div id="buttonDiv" style={{ marginBottom: "30px" }}></div>
        </div>
      </div>
      <div className="leftFooter">
        <div>中文 | English</div>
      </div>
      <div className="rightFooter">
        <div>Copyright 2023</div>
      </div>
    </div>
  );
};

export default LogIn;
