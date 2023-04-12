import React, { useState, useEffect } from "react";
import "../css/Signup.css";
import "../css/Background.css";
import { Input, Button, Typography, Divider, Image, notification } from "antd";
import * as AXIOS from "../middleware";
import googleIcon from "../resources/google.png";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const { Text, Link } = Typography;

const LogIn = () => {
  const [signupData, setSignupData] = useState({
    Email: "",
    Username: "",
    Password: "",
    "Confirm Password": "",
  });
  const [validName, setValidName] = useState(true);
  const [description, setDescription] = useState("");
  const [api, contextHolder] = notification.useNotification();

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
        const { data, error } = await AXIOS.signup({
          username: signupData.Username,
          password: signupData.Password,
          email: signupData.Email,
        });
        if (error) {
          switch (error) {
            case "UsernameExists":
              setDescription("Username has already been registered.");
              break;
            case "EmailExist":
              setDescription("Email has already been registered.");
              break;
            default:
              break;
          }
        } else {
          api.open({
            message: "Vertification mail sent",
            description: "Please check your mailbox.",
            style: {},
          });
        }
      } catch (e) {
        alert(e);
      }
    }
  };

  // const signFail = () => {
  //   api.open({
  //     message: 'Vertification mail sent',
  //     description:
  //       'Please check your mailbox.',
  //     style: {},
  //   });
  // }

  useEffect(() => {
    if (description) {
      api.open({
        message: "Sign up failed",
        description, // 總共有三個 description
        style: {},
      });
    }
  }, [description]);

  return (
    <>
      <div className="leftContainer">
        {/* {contextHolder}
        <Button onClick={signFail}>ppp</Button> */}
        <p className="title">Let's Meet!</p>
      </div>
      <div className="rightContainer">
        <div className="loginContainer">
          <h1>Welcome to Let's Meet</h1>
          {Object.keys(signupData).map((m, index) => {
            if (m === "Password")
              return (
                <Input.Password
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
              );
            if (m === "Confirm Password")
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginBottom: "30px",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Input.Password
                    placeholder={m}
                    style={{
                      width: "270px",
                      height: "45px",
                      borderRadius: "15px",
                      marginRight: "15px",
                    }}
                    key={index}
                    name={m}
                    onChange={handleSignupChange}
                  />
                  {signupData["Confirm Password"].length !== 0 &&
                    (signupData.Password === signupData["Confirm Password"] ? (
                      <CheckCircleOutlined style={{ color: "#5C9B6B" }} />
                    ) : (
                      <CloseCircleOutlined style={{ color: "#AE2A39" }} />
                    ))}
                </div>
              );
            return (
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
            );
          })}
          {contextHolder}
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
          <Divider style={{ borderColor: "#808080", color: "#808080"}}>or</Divider>
          <Button
            style={{
              width: "300px",
              height: "60px",
              background: "white",
              border: "0.5px solid #808080",
              borderRadius: "15px",
              // marginBottom: "30px"
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
        </div>
      </div>
    </>
  );
};

export default LogIn;
