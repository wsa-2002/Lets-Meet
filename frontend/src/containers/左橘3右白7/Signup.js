/*TODO:********************************************************************************************
  1. RWD, 頁面縮過小時的錯誤
  Component DONE! 
**************************************************************************************************/
import React, { useState, useEffect } from "react";
import { Divider, notification } from "antd";
import * as AXIOS from "../../middleware";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import Button from "../../components/Button";
import Base from "../../components/Base/左橘3右白7";
import { RWD } from "../../constant";
const {
  RightContainer,
  RightContainer: { InfoContainer },
} = Base;
const GoogleButton = Button("google");
const { RWDWidth, RWDHeight } = RWD;

const SignUp = () => {
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
      {contextHolder}
      <Base>
        <Base.RightContainer>
          <RightContainer.InfoContainer style={{ height: RWDHeight(688) }}>
            <InfoContainer.InputContainer style={{ marginTop: RWDHeight(50) }}>
              <InfoContainer.Title>Welcome</InfoContainer.Title>
              {Object.keys(signupData)
                .filter((m) => m !== "Confirm Password")
                .map((m, index) => {
                  const Component = m.includes("Password")
                    ? InfoContainer.Password
                    : InfoContainer.Input;
                  return (
                    <Component
                      placeholder={m}
                      name={m}
                      onChange={handleSignupChange}
                      key={index}
                    />
                  );
                })}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  columnGap: RWDWidth(10),
                }}
              >
                <InfoContainer.Password
                  style={{ width: RWDWidth(350) }}
                  placeholder={"Confirm Password"}
                  name={"Confirm Password"}
                  onChange={handleSignupChange}
                  key={"1231"}
                />
                {signupData["Confirm Password"] &&
                  (signupData.Password === signupData["Confirm Password"] ? (
                    <CheckCircleOutlined style={{ color: "#5C9B6B" }} />
                  ) : (
                    <CloseCircleOutlined style={{ color: "#AE2A39" }} />
                  ))}
              </div>
            </InfoContainer.InputContainer>
            <InfoContainer.InputContainer
              style={{
                alignItems: "center",
                gap: "unset",
                height: RWDHeight(243),
                justifyContent: "space-evenly",
                position: "relative",
              }}
            >
              <InfoContainer.Button
                disabled={
                  !signupData.Username ||
                  !signupData.Password ||
                  !signupData.Email ||
                  !signupData["Confirm Password"]
                }
                onClick={handleSignUpClick}
              >
                Save
              </InfoContainer.Button>

              <Divider
                style={{ borderColor: "#808080", color: "#808080", margin: 0 }}
              >
                or
              </Divider>
              <GoogleButton>Sign up with Google</GoogleButton>
            </InfoContainer.InputContainer>
          </RightContainer.InfoContainer>

          {/* 
            <Button
              size={"large"}
              style={{
                borderRadius: "20px",
                background: "#B3DEE5",
                borderColor: "#B3DEE5",
                fontWeight: "bold",
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
            <Divider style={{ borderColor: "#808080", color: "#808080" }}>
              or
            </Divider>
            <Button
              style={{
                width: "300px",
                height: "60px",
                background: "white",
                border: "0.5px solid #808080",
                borderRadius: "15px",
              }}
              onClick={() => {
                window.open("http://localhost:8000/google-login", "_self");
              }}
            >
              <Image width="30px" src={googleIcon} />
              <span
                style={{
                  marginLeft: "30px",
                  fontSize: "20px",
                  fontWeight: 500,
                }}
              >
                Login with Google
              </span>
            </Button>
          </SignupContainer> */}
        </Base.RightContainer>
      </Base>
    </>
  );
};

export default SignUp;
