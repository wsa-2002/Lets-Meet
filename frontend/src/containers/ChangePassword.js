import styled from "styled-components";
import "@fontsource/roboto/500.css";
import "../css/ResetPassword.css";
import "../css/Background.css";
import { Input, Button, Typography, Divider } from "antd";
import { useNavigate } from "react-router-dom";

const { Text, Link } = Typography;

const ChangePassword = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/');
  }

  const handleSave = () => {
    navigate('/login');
  }

  return (
    <div className="mainContainer">
      <div className="leftContainer">
        <p className="title">Let's Meet!</p>
      </div>
      <div className="rightContainer">
        <div className="resetContainer">
          <h1>Reset Password</h1>
          <Input
            placeholder="New Password"
            style={{
              width: "100%",
              height: "45px",
              borderRadius: "15px",
              marginBottom: "30px",
            }}
          />
          <Input
            placeholder="Confirm New Password"
            style={{
              width: "100%",
              height: "45px",
              borderRadius: "15px",
              marginBottom: "30px",
            }}
          />
          <Button
            size={"large"}
            style={{
              background: "#B3DEE5",
              borderRadius: "15px",
              // position: "relative",
              // left: "50%",
              // transform: "translate(-50%, 0)",
            }} onClick={handleSave}>Save</Button>
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
}

export default ChangePassword;