import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "@fontsource/roboto/500.css";
import "../css/Login.css";
import "../css/Background.css";
import { Input, Button, Typography, Divider, Image } from "antd";
import { useNavigate } from "react-router-dom";
import * as AXIOS from "../middleware";
import { useMeet } from "./hooks/useMeet";
import googleIcon from '../resources/google.png';

const { Text, Link } = Typography;

const LogIn = () => {
  const [loginData, setLoginData] = useState({
    user_identifier: "",
    password: "",
  });
  const search = useLocation().search;
  const { login, GLOBAL_LOGIN } = useMeet();
  const navigate = useNavigate();

  useEffect(() => {
    if (login) {
      navigate("/");
      return;
    }
    if (search) {
      const code = new URLSearchParams(search).get("code");
      if (code) {
        AXIOS.emailVerification(code);
      }
    }
  }, [login]);

  const handleLoginClick = async () => {
    try {
      console.log(loginData);
      const result = await AXIOS.login(loginData);
      if (result.error) {
        alert("登入失敗");
      } else {
        console.log(result);
        GLOBAL_LOGIN(result.data.token);
      }
    } catch (e) {
      alert(e);
      console.log(e);
    }
    // window.open("http://localhost:8000/google-login", "_self");
    // window.location.assign(result.data._headers.location);
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
          <br/>
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
