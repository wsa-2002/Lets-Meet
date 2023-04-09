import React, { useState } from "react";
import "@fontsource/roboto/500.css";
import "../css/Login.css";
import "../css/Background.css";
import { Input, Button, Typography, Divider, Image, Modal } from "antd";
import * as AXIOS from "../middleware";
import googleIcon from '../resources/google.png';

const { Text, Link } = Typography;

const LogIn = () => {
  const [signupData, setSignupData] = useState({
    Email: "",
    Username: "",
    Password: "",
    "Confirm Password": "",
  });
  const [validName, setValidName] = useState(true);

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    console.log(name);
    setSignupData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "Username") {
      if (/[#$%&\*\\\/]/.test(value)) {
        setValidName(false);
        console.log("bad");
      } else {
        setValidName(true);
      }
    }
  };

  const handleSignUpClick = async () => {
    if (signupData.Password !== signupData["Confirm Password"]) {
      console.log("請輸入相同密碼");
    } else if (signupData.Username && signupData.Password && signupData.Email) {
      try {
        await AXIOS.signup({
          username: signupData.Username,
          password: signupData.Password,
          email: signupData.Email,
        });
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
          <Button
            style={{ marginBottom: "30px" }}
            // icon="../resources/google.png"
            onClick={() => {
              window.open("http://localhost:8000/google-login", "_self");
            }}
          >
            <Image width="20px" src={googleIcon}/>
            <Text style={{marginLeft: "20px"}}>Login with Google</Text>
          </Button>
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
