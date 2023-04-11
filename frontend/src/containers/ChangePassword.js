import React, { useState } from "react";
import "../css/ResetPassword.css";
import "../css/Background.css";
import { Input, Button, Typography, Divider } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import * as AXIOS from "../middleware";
const { Text, Link } = Typography;

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState({
    "New Password": "",
    "Confirmed New Password": "",
  });
  const search = useLocation().search;
  const navigate = useNavigate();

  // useEffect(() => {

  //   if (search) {
  //     const code = new URLSearchParams(search).get("code");
  //     if (code) {
  //       AXIOS.emailVerification(code);
  //     }
  //   }
  // }, [login]);

  const handleResetChange = (e) => {
    const { name, value } = e.target;
    setNewPassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClick = async () => {
    try {
      console.log(newPassword);
      const result = await AXIOS.resetPassword({
        password: newPassword["New Password"],
        code: new URLSearchParams(search).get("code"),
      });
      navigate("/login");
    } catch (e) {
      alert(e);
      console.log(e);
    }
  };

  return (
    <div className="mainContainer">
      <div className="leftContainer">
        <p className="title">Let's Meet!</p>
      </div>
      <div className="rightContainer">
        <div className="resetContainer">
          <h1>Reset Password</h1>
          {Object.keys(newPassword).map((m, index) => (
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
              onChange={handleResetChange}
            />
          ))}
          <Button
            size={"large"}
            style={{
              background: "#B3DEE5",
              borderRadius: "15px",
              // position: "relative",
              // left: "50%",
              // transform: "translate(-50%, 0)",
            }}
            disabled={
              newPassword["Confirmed New Password"] !==
              newPassword["New Password"]
            }
            onClick={handleClick}
          >
            Save
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

export default ChangePassword;
