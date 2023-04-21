import React, { useState } from "react";
import "../css/ResetPassword.css";
import "../css/Background.css";
import { Input, Button, Typography, Divider } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import * as AXIOS from "../middleware";
import PrimaryButton from "../components/PrimaryButton";
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
    <>
      <div className="leftContainer">
        <p className="title">Let's Meet!</p>
      </div>
      <div className="rightContainer">
        <div className="resetContainer">
          <h1>Reset Password</h1>
          {Object.keys(newPassword).map((m, index) => (
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
              onChange={handleResetChange}
            />
          ))}
          <PrimaryButton handleMeetCreate={handleClick} text="Save"
            disabled={
              newPassword["Confirmed New Password"] !==
              newPassword["New Password"]
            }/>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
