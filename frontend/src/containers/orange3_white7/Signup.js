/*TODO:********************************************************************************************
  1. RWD, 頁面縮過小時的錯誤
  Component DONE! 
**************************************************************************************************/
import React, { useState, useEffect } from "react";
import { Divider, notification, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import * as AXIOS from "../../middleware";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import Button from "../../components/Button";
import Base from "../../components/Base/orange3_white7";
import { RWD, ANIME } from "../../constant";
import { useTranslation } from 'react-i18next';
const {
  RightContainer,
  RightContainer: { InfoContainer },
} = Base;
const GoogleButton = Button("google");
const { RWDWidth, RWDHeight, RWDFontSize } = RWD;
const { Text, Link } = Typography;

const CheckCircle = styled(CheckCircleOutlined)`
  color: #5c9b6b;
  font-size: ${RWDFontSize(20)};
  ${ANIME.FadeIn};
`;

const CloseCircle = styled(CloseCircleOutlined)`
  color: #ae2a39;
  font-size: ${RWDFontSize(20)};
  ${ANIME.FadeIn};
`;

const SignUp = () => {
  const { t } = useTranslation();
  const [signupData, setSignupData] = useState({
    Email: "",
    Username: "",
    Password: "",
    "Confirm Password": "",
  });
  const [validName, setValidName] = useState(true);
  const [description, setDescription] = useState("");
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  const CONTENTNAME = {
    Email: t("email"),
    Username: t("username"),
    Password: t("password"),
    "Confirm Password": "",
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
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
              setDescription(t("usernameExists"));
              break;
            case "EmailExist":
              setDescription(t("emailExist"));
              break;
            default:
              break;
          }
        } else {
          api.open({
            message: t("verSent"),
            description: t("checkMail"),
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
        message: t("signupFailed"),
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
              <InfoContainer.Title>{t("welcome")}</InfoContainer.Title>
              {Object.keys(signupData)
                .filter((m) => m !== "Confirm Password")
                .map((m, index) => {
                  const Component = m.includes("Password")
                    ? InfoContainer.Password
                    : InfoContainer.Input;
                  return (
                    <Component
                      placeholder={CONTENTNAME[m]}
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
                  placeholder={t("confirmPwd")}
                  name={"Confirm Password"}
                  onChange={handleSignupChange}
                  key={"1231"}
                />
                {signupData["Confirm Password"] &&
                  (signupData.Password === signupData["Confirm Password"] ? (
                    <CheckCircle />
                  ) : (
                    <CloseCircle />
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
                  !signupData["Confirm Password"] ||
                  signupData.Password !== signupData["Confirm Password"]
                }
                onClick={handleSignUpClick}
              >
                {t("signup")}
              </InfoContainer.Button>
              <Divider
                style={{ borderColor: "#808080", color: "#808080", margin: 0 }}
              >
                or
              </Divider>
              <GoogleButton>{t("signupGoogle")}</GoogleButton>
            </InfoContainer.InputContainer>
            <InfoContainer.InputContainer
              style={{
                gap: "unset",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text type="secondary">
                {t("already")}
                <Link
                  onClick={() => {
                    navigate("/login");
                  }}
                  style={{ color: "#B76A00", fontSize: RWDFontSize(16) }}
                >
                  {" "}
                  {t("login")}
                </Link>
              </Text>
            </InfoContainer.InputContainer>
          </RightContainer.InfoContainer>
        </Base.RightContainer>
      </Base>
    </>
  );
};

export default SignUp;