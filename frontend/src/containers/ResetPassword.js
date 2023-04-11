import React, { useRef } from "react";
import "@fontsource/roboto/500.css";
import "../css/ResetPassword.css";
import { Input, Button, Typography, Divider, notification, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { CheckCircleFilled } from "@ant-design/icons";
import * as AXIOS from "../middleware";
const { Text, Link } = Typography;

const ResetPassword = () => {
  const EmailRef = useRef(null);
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (placement) => {
    api.info({
      message: `Verification mail sent`,
      description: "please check your mailbox",
      placement,
      duration: 1.5,
      icon: <CheckCircleFilled style={{ color: "green" }} />,
    });
  };

  const handleVerifyClick = async () => {
    if (EmailRef.current.input.value) {
      try {
        openNotification("top");
        const result = await AXIOS.forgetPassword({
          email: EmailRef.current.input.value,
        });
        // navigate("/Login");
        console.log(result);
      } catch (e) {
        alert(e);
      }
    } else {
      console.log("Email 不能為空");
    }
  };

  return (
    <div className="mainContainer">
      {contextHolder}
      <div className="leftContainer">
        <p className="title">Let's Meet!</p>
      </div>
      <div className="rightContainer">
        <div className="resetContainer">
          <div style={{textAlign: 'left'}}>
            <h1>Reset Password</h1>
          </div>
          <Input
            placeholder="Email"
            style={{
              width: "100%",
              height: "45px",
              marginTop: "10px",
              borderRadius: "10px",
              marginBottom: "30px",
            }}
            ref={EmailRef}
          />
          <Button
            size={"large"}
            style={{
              background: "#B3DEE5",
              borderRadius: "15px",
              // position: "relative",
              // left: "50%",
              // transform: "translate(-50%, 0)",
            }}
            onClick={handleVerifyClick}
          >
            Send Verification
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

export default ResetPassword;