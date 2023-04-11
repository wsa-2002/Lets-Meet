import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../css/Login.css";
import "../css/Background.css";
import { Input, Button, Typography, Divider, Image, notification } from "antd";
import { useNavigate } from "react-router-dom";
import * as AXIOS from "../middleware";
import { useMeet } from "./hooks/useMeet";
import googleIcon from "../resources/google.png";

const { Text, Link } = Typography;

const LogIn = () => {
  const [loginData, setLoginData] = useState({
    user_identifier: "",
    password: "",
  });
  const search = useLocation().search;
  const { login, GLOBAL_LOGIN } = useMeet();
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

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
        api.open({
          message: "Login failed",
          description:
            "Username/Email has already been linked to Google. Please login with Google.",
        });
      } else {
        console.log(result);
        GLOBAL_LOGIN(result.data.token);
      }
    } catch (e) {
      alert(e);
      console.log(e);
      api.open({
        message: "Login failed",
        description: "",
      });
    }
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
    <>
      <div className="leftContainer">
        <p className="title">Let's Meet!</p>
      </div>
      <div className="rightContainer">
        <div className="loginContainer">
          <div style={{textAlign: 'left'}}>
            <h1 style={{fontWeight: 700}}>Welcome</h1>
          </div>
          <Input
            placeholder="Username/Email"
            style={{
              width: "100%",
              height: "45px",
              borderRadius: "15px",
              marginBottom: "30px",
              borderColor: "#808080",
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
              borderColor: "#808080",
              // marginBttom: "30px",
            }}
            name="password"
            onChange={handleLoginChange}
          />
          <div
            style={{
              marginLeft: "50%",
              marginBottom: "10px",
              textAlign: 'right'
            }}
          >
            <Link onClick={handleReset} style={{color: "#B76A00"}}>Forgot Password</Link>
          </div>
          <Button
            size={"large"}
            style={{
              background: "#B3DEE5",
              borderRadius: "15px",
              borderColor: "#B3DEE5",
              // position: "relative",
              // left: "50%",
              // transform: "translate(-50%, 0)",
            }}
            onClick={handleLoginClick}
          >
            Login
          </Button>
          <Divider style={{borderColor: "#808080", color: "#808080"}}>or</Divider>
          <Button
            style={{
              width: "300px",
              height: "60px",
              background: "white",
              border: "0.5px solid #808080",
              borderRadius: "15px",
              marginBottom: "30px"
            }}
            // icon="../resources/google.png"
            onClick={() => {
              window.open("http://localhost:8000/google-login", "_self");
            }}
          >
            <Image width="30px" src={googleIcon} />
            <span
              style={{ marginLeft: "30px", fontSize: "20px", fontWeight: 500 }}
            >
              Login with Google
            </span>
          </Button>
          <br />
          <Text
            type="secondary"
            style={
              {
                // marginTop: "30px",
              }
            }
          >
            New to Let's Meet? <Link onClick={handleSignUp} style={{color: "#B76A00"}}>Sign Up</Link>
          </Text>
          {/* <Button onClick={onSignout}>temp</Button> */}
        </div>
      </div>
    </>
  );
};

export default LogIn;
