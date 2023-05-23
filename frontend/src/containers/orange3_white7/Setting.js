import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Form, Radio } from "antd";
import _ from "lodash";
import React, { Fragment, useEffect, useRef, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useMeet } from "../hooks/useMeet";
import Base from "../../components/Base/orange3_white7";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { RWD, ANIME } from "../../constant";
import Notification from "../../components/Notification";
import {
  getUserInfo,
  editAccount,
  editPreference,
  lineConnect,
  lineToken,
} from "../../middleware";

const RectButton = Button("rect");
const GoogleButton = Button("google");
const LineButton = Button("line");
const ThinnerInput = Input("thinner");
const ThinnerPassword = Input.Password("thinner");
const { RWDHeight, RWDFontSize, RWDWidth } = RWD;

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

const SLIDE = styled.div`
  ${ANIME.SlideFromTop}
`;

const InstructionContainer = Object.assign(
  styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    row-gap: ${RWDHeight(10)};
  `,
  {
    Item: styled.div`
      font-size: ${RWDFontSize(20)};
      color: #db8600;
      font-weight: 700;
    `,
  }
);

const InfoContainer = Object.assign(
  styled.div`
    display: flex;
    flex-direction: column;
    width: ${RWDWidth(880)};
    margin-top: ${RWDHeight(35)};
  `,
  {
    Title: styled.div`
      font-size: ${RWDFontSize(24)};
      font-weight: 700;
      border-bottom: 1px solid #808080;
      margin-top: ${RWDHeight(35)};
    `,
    AccountSetting: Object.assign(
      styled.div`
        display: grid;
        grid-template-columns: repeat(2, max-content);
        grid-template-rows: repeat(3, max-content);
        grid-column-gap: ${RWDWidth(70)};
        grid-row-gap: ${RWDHeight(30)};
        margin-top: ${RWDHeight(20)};
      `,
      {
        Content: styled.div`
          font-size: ${RWDFontSize(20)};
          font-weight: bold;
          display: flex;
          align-items: center;
        `,
      }
    ),
    ButtonContainer: styled.div`
      align-self: flex-end;
      display: flex;
      align-items: center;
      column-gap: ${RWDWidth(10)};
    `,
  }
);

const Setting = () => {
  const {
    cookies,
    login,
    setLoading,
    USERINFO: { ID, username, email, line_token, notification_preference },
    setUSERINFO,
  } = useMeet();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ username, email });
  const [oriUserData, setOriUserData] = useState({ username, email });
  const [changePassword, setChangePassword] = useState(false);
  const [preference, setPreference] = useState(notification_preference);
  const [lineLogin, setLineLogin] = useState(line_token ?? "");
  const search = useLocation().search;
  const [notification, setNotification] = useState({});
  const location = useLocation();

  /*調整 Setting 文字 套組*/
  const RoutineRef = useRef(null);
  const [top, setTop] = useState(0);
  const throttledHandleResize = _.throttle(() => {
    if (RoutineRef?.current) {
      // setTimeTop(RoutineRef.current.offsetHeight);
      setTop(RoutineRef?.current.offsetTop);
    }
  }, 100);

  useEffect(() => {
    if (RoutineRef?.current) {
      setTop(RoutineRef?.current.offsetTop);
    } //load 時

    window.addEventListener("resize", throttledHandleResize);
    return () => {
      window.removeEventListener("resize", throttledHandleResize);
    };
  }, []);
  /******************************************************/

  useEffect(() => {
    if (location?.state?.line) {
      setNotification({
        title: "Connect to Line",
        message: "請掃描 QRcode 以接收訊息",
      });
    }
  }, [location?.state?.line]);

  useEffect(() => {
    (async () => {
      if (search) {
        const code = new URLSearchParams(search).get("code");
        const state = new URLSearchParams(search).get("state");
        if (code && state) {
          await lineToken(code, state);
          navigate("/settings", {
            state: {
              line: "initial",
            },
          });
        }
      }
      if (!login) {
        navigate("/");
      }
    })();
  }, [login]);

  const handleUserDataChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAccountUpdate = async () => {
    setLoading(true);
    const { error } = await editAccount(userData, cookies.token);
    setLoading(false);
    if (error) {
      setUserData(JSON.parse(JSON.stringify(oriUserData)));
    } else {
      const {
        data: { username, email, line_token, notification_preference },
        error,
      } = await getUserInfo(undefined, cookies.token, ID);
      console.log(error);
      setUSERINFO((prev) => ({
        ...prev,
        username,
        email,
        line_token,
        notification_preference,
      }));
      if (userData.email !== oriUserData.email) {
        setNotification({
          title: "Verification mail sent",
          message:
            "Please check your mailbox. Email will be updated in the Settings page after you verify your new email.",
        });
      }
      setUserData((prev) => ({
        ...JSON.parse(JSON.stringify(oriUserData)),
        username: JSON.parse(JSON.stringify(prev.username)),
      }));
      setOriUserData((prev) => ({
        username: JSON.parse(JSON.stringify(userData.username)),
        email: JSON.parse(JSON.stringify(prev.email)),
      }));
    }
    setChangePassword(false);
    switch (error) {
      case "EmailExist":
        setNotification({
          title: "Update failed",
          message: "Email has already been registered.",
        });
        break;
      case "UsernameExists":
        setNotification({
          title: "Update failed",
          message: "Username has already been registered.",
        });
        break;
      case "NoPermission":
        setNotification({
          title: "Change password failed",
          message: "Wrong password.",
        });
        break;
      default:
        break;
    }
  };

  const handleEditPrefernce = async (e) => {
    const { value } = e.target;
    await editPreference({ preference: value }, cookies.token);
    setPreference(value);
    setUSERINFO((prev) => ({ ...prev, notification_preference: value }));
  };

  const CONTENTMENU = {
    Username: (
      <Form
        fields={[
          {
            name: ["username"],
            value: userData.username,
          },
        ]}
      >
        <Form.Item
          name="username"
          rules={[
            {
              pattern: /^[^#$%&*/?@]*$/,
              validateTrigger: "onChange",
              message: "Please avoid `#$%&*/?@",
            },
          ]}
          style={{ margin: 0 }}
        >
          <ThinnerInput
            onChange={handleUserDataChange}
            name="username"
            disabled={login === "google"}
          />
        </Form.Item>
      </Form>
    ),
    Email: (
      <ThinnerInput
        onChange={handleUserDataChange}
        name="email"
        value={userData.email}
        disabled={login === "google"}
      />
    ),
    Password: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          rowGap: RWDHeight(25),
        }}
      >
        <RectButton
          variant="hollow"
          buttonTheme="#DB8600"
          onClick={() => {
            setChangePassword((prev) => !prev);
          }}
          disabled={login === "google"}
        >
          Change Password
        </RectButton>
        {changePassword && (
          <div style={{ display: "relative", overflow: "hidden" }}>
            <SLIDE
              style={{
                display: "flex",
                flexDirection: "column",
                rowGap: RWDHeight(25),
                position: "relative",
              }}
            >
              <ThinnerPassword
                onChange={handleUserDataChange}
                name="old_password"
                placeholder="Old Password"
              />
              <ThinnerPassword
                onChange={handleUserDataChange}
                name="new_password"
                placeholder="New Password"
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  columnGap: RWDWidth(10),
                }}
              >
                <ThinnerPassword
                  onChange={handleUserDataChange}
                  name="Confirm New Password"
                  placeholder="Confirm New Password"
                />
                {userData["Confirm New Password"] &&
                  (userData.new_password ===
                  userData["Confirm New Password"] ? (
                    <CheckCircle />
                  ) : (
                    <CloseCircle />
                  ))}
              </div>
            </SLIDE>
          </div>
        )}
      </div>
    ),
  };

  return (
    <>
      <Notification
        notification={notification}
        setNotification={setNotification}
      />
      <Base login={true} title_disable={true}>
        <Base.LeftContainer
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingRight: RWDWidth(18),
          }}
        >
          <p
            style={{
              fontSize: RWDFontSize(32),
              color: "#B76A00",
              margin: 0,
              fontWeight: 800,
              letterSpacing: "1px",
            }}
            ref={RoutineRef}
          >
            Settings
          </p>
          <InstructionContainer
            style={{ position: "absolute", top, marginTop: RWDHeight(80) }}
          >
            <InstructionContainer.Item>
              Set your account information
            </InstructionContainer.Item>
            <InstructionContainer.Item>
              Connect to third-party applications
            </InstructionContainer.Item>
            <InstructionContainer.Item>
              Change your notification preferences
            </InstructionContainer.Item>
          </InstructionContainer>
        </Base.LeftContainer>
        <Base.RightContainer
          style={{
            gridRow: "2/3",
            position: "relative",
            alignItems: "flex-start",
          }}
        >
          <InfoContainer>
            <InfoContainer.Title>Account Settings</InfoContainer.Title>
            <InfoContainer.AccountSetting>
              {userData.username !== undefined &&
                Object.keys(CONTENTMENU).map((title, index) => (
                  <Fragment key={index}>
                    <InfoContainer.AccountSetting.Content
                      style={{
                        gridColumn: "1/2",
                        gridRow: `${index + 1}/${index + 2}`,
                        alignSelf: title === "Password" && "flex-start",
                      }}
                    >
                      {title}
                    </InfoContainer.AccountSetting.Content>
                    <InfoContainer.AccountSetting.Content
                      style={{
                        gridColumn: "2/3",
                        gridRow: `${index + 1}/${index + 2}`,
                        fontWeight: "normal",
                      }}
                    >
                      {CONTENTMENU[title]}
                    </InfoContainer.AccountSetting.Content>
                  </Fragment>
                ))}
            </InfoContainer.AccountSetting>
            {login !== "google" && (
              <InfoContainer.ButtonContainer
                style={{ marginTop: RWDHeight(50) }}
              >
                <RectButton
                  variant="solid"
                  buttonTheme="#5A8EA4"
                  disabled={
                    _.isEqual(oriUserData, userData) ||
                    !userData.username ||
                    !userData.email ||
                    !/^[^#$%&*/?@]*$/.test(userData.username) ||
                    (changePassword &&
                      (!userData.old_password ||
                        !userData.new_password ||
                        !userData["Confirm New Password"] ||
                        userData.new_password !==
                          userData["Confirm New Password"]))
                  }
                  onClick={handleAccountUpdate}
                >
                  Update
                </RectButton>
                <RectButton
                  variant="hollow"
                  buttonTheme="#D8D8D8"
                  onClick={() => {
                    setUserData(JSON.parse(JSON.stringify(oriUserData)));
                    setChangePassword(false);
                  }}
                >
                  Reset
                </RectButton>
              </InfoContainer.ButtonContainer>
            )}

            <InfoContainer.Title>Third-Party Applications</InfoContainer.Title>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                columnGap: RWDWidth(25),
                marginTop: RWDHeight(20),
              }}
            >
              <GoogleButton
                style={{ minWidth: "fit-content", width: RWDWidth(350) }}
              >
                Connect with Google
              </GoogleButton>
              <LineButton
                style={{ minWidth: "fit-content", width: RWDWidth(350) }}
                onClick={() => {
                  lineConnect(cookies.token);
                }}
              >
                Connect with LINE
              </LineButton>
            </div>
            <InfoContainer.Title>Notification Preferences</InfoContainer.Title>
            <div
              style={{
                marginTop: RWDHeight(20),
                display: "flex",
                flexDirection: "column",
                rowGap: RWDHeight(15),
              }}
            >
              <div>
                If you have connected with a LINE account, you can choose either
                LINE messages or Email as your notification preferences.
              </div>
              <Radio.Group value={preference} onChange={handleEditPrefernce}>
                <Radio value={"EMAIL"}>Email</Radio>
                <Radio value={"LINE"} disabled={!lineLogin}>
                  LINE messages
                </Radio>
              </Radio.Group>
            </div>
          </InfoContainer>
        </Base.RightContainer>
      </Base>
    </>
  );
};

export default Setting;
