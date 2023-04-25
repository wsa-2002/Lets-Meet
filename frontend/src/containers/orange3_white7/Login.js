/*TODO:********************************************************************************************
  1. RWD, 頁面縮過小時的錯誤
  Component DONE! 
**************************************************************************************************/
import React, { useState, useEffect } from "react";
import { Typography, Divider, notification } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import * as AXIOS from "../../middleware";
import { useMeet } from "../hooks/useMeet";
import Button from "../../components/Button";
import Base from "../../components/Base/orange3_white7";
import { RWD } from "../../constant";
const {
  RightContainer,
  RightContainer: { InfoContainer },
} = Base;
const GoogleButton = Button("google");
const { RWDHeight, RWDFontSize } = RWD;

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
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (login) {
      navigate("/");
      return;
    }
    if (search) {
      const code = new URLSearchParams(search).get("code");
      if (code) {
        AXIOS.emailVerification({ code });
      }
    }
  }, [login]);

  useEffect(() => {
    if (description) {
      api.open({
        message: "Login Failed",
        description,
        style: {},
      });
    }
  }, [description]);

  const handleLoginClick = async () => {
    try {
      console.log(loginData);
      const { data, error } = await AXIOS.login(loginData);
      if (error) {
        switch (error) {
          case "LoginFailed":
            setDescription(" ");
            break;
          case "EmailRegisteredByGoogle":
            setDescription(
              "Username/Email has already been linked to Google. Please login with Google."
            );
            break;
          default:
            break;
        }
      } else {
        console.log(data);
        GLOBAL_LOGIN(data.token);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      {contextHolder}
      <Base>
        <Base.RightContainer>
          <RightContainer.InfoContainer
            style={{
              height: RWDHeight(590),
              //TODO: 超出視窗
              // height: 視窗高度小於Login高度 && "90vh",
              // overflowY: 視窗高度小於Login高度 && "scroll",
            }}
          >
            <InfoContainer.InputContainer style={{ marginTop: RWDHeight(50) }}>
              <InfoContainer.Title>Welcome</InfoContainer.Title>
              <InfoContainer.Input
                placeholder="Username/Email"
                name="user_identifier"
                onChange={handleLoginChange}
              />
              <InfoContainer.Password
                placeholder="Password"
                name="password"
                onChange={handleLoginChange}
              />
            </InfoContainer.InputContainer>
            <InfoContainer.InputContainer
              style={{
                alignItems: "center",
                gap: "unset",
                height: RWDHeight(243),
                justifyContent: "space-between",
                position: "relative",
              }}
            >
              <div
                style={{
                  alignSelf: "flex-end",
                }}
              >
                <Link
                  onClick={() => {
                    navigate("/reset");
                  }}
                  style={{
                    color: "#B76A00",
                    fontSize: RWDFontSize(16),
                  }}
                >
                  Forgot Password
                </Link>
              </div>

              <InfoContainer.Button
                disabled={!loginData.user_identifier || !loginData.password}
                onClick={handleLoginClick}
              >
                Save
              </InfoContainer.Button>

              <Divider
                style={{ borderColor: "#808080", color: "#808080", margin: 0 }}
              >
                or
              </Divider>
              <GoogleButton>Login with Google</GoogleButton>
            </InfoContainer.InputContainer>
            <InfoContainer.InputContainer
              style={{
                gap: "unset",
                alignItems: "center",
                justifyContent: "center",
                height: RWDHeight(92),
              }}
            >
              <Text type="secondary">
                New to Let's Meet?
                <Link
                  onClick={() => {
                    navigate("/signup");
                  }}
                  style={{ color: "#B76A00", fontSize: RWDFontSize(16) }}
                >
                  Sign Up
                </Link>
              </Text>
            </InfoContainer.InputContainer>
          </RightContainer.InfoContainer>
        </Base.RightContainer>
      </Base>
    </>
  );
};

export default LogIn;
