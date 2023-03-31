import styled from "styled-components";
import React, { useState } from "react";
import "@fontsource/roboto/500.css";
import "../css/Login.css";
import { Input, Button, Typography, Divider } from "antd";
import { useNavigate } from "react-router-dom";
import Background from "../components/MainBackground";
import * as AXIOS from "../middleware";
const { Text, Link } = Typography;

const LogIn = () => {
  const [loginData, setLoginData] = useState({
    user_identifier: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleLoginClick = async () => {
    // try {
    //   console.log(loginData);
    //   const result = await AXIOS.login(loginData);
    //   if (result.error) {
    //     alert("登入失敗");
    //   } else {
    //     console.log(result);
    //     navigate("/");
    //   }
    // } catch (e) {
    //   alert(e);
    //   console.log(e);
    // }
    const result = await AXIOS.googleLogin();
    // console.log(Object.keys(result));
    window.location.assign(result.data._headers.location);
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleReset = () => {
    navigate("/reset");
  };

  function parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  }

  function handleCredentialResponse(response) {
    // console.log("Encoded JWT ID token: " + response.credential);
    const data = parseJwt(response.credential);
    console.log(data);
  }

  function onSignout() {
    console.log("signout");
    window.google.accounts.id.disableAutoSelect();
  }

  window.onload = function () {
    const google = window.google;
    google.accounts.id.initialize({
      client_id:
        "436418764459-1ag0gp14atm6al44k1qrptdpf89ufc61.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "large", locale: "en" } // customization attributes
    );
    google.accounts.id.prompt(); // also display the One Tap dialog
  };

  return (
    <div className="mainContainer">
      <div className="leftContainer">
        <p className="title">Let's Meet!</p>
      </div>
      <div className="rightContainer">
        <div className="loginContainer">
          <h1>Welcome</h1>
          <Input
            placeholder="Username/Email"
            style={{
              width: "100%",
              height: "45px",
              borderRadius: "15px",
              marginBottom: "30px",
            }}
            name="user_identifier"
            onChange={handleLoginChange}
          />
          <Input
            placeholder="Password"
            style={{
              width: "100%",
              height: "45px",
              borderRadius: "15px",
              // marginBttom: "30px",
            }}
            name="password"
            onChange={handleLoginChange}
          />
          <div
            style={{
              marginLeft: "50%",
              marginBottom: "30px",
            }}
          >
            <Link onClick={handleReset}>Forget Password?</Link>
          </div>
          <Button
            size={"large"}
            style={{
              background: "#B3DEE5",
              borderRadius: "15px",
              // position: "relative",
              // left: "50%",
              // transform: "translate(-50%, 0)",
            }}
            onClick={handleLoginClick}
          >
            Login
          </Button>
          <Divider>or</Divider>
          <div id="buttonDiv" style={{ marginBottom: "30px" }}></div>
          <Text
            type="secondary"
            style={
              {
                // marginTop: "30px",
              }
            }
          >
            New to Let's Meet? <Link onClick={handleSignUp}>Sign Up</Link>
          </Text>
          {/* <Button onClick={onSignout}>temp</Button> */}
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
