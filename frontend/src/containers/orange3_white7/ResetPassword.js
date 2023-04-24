/**************************************************************************************************
 DONE!
**************************************************************************************************/
import React, { useState } from "react";
import { notification } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import * as AXIOS from "../../middleware";
import Base from "../../components/Base/orange3_white7";
import { RWD } from "../../constant";
const {
  RightContainer,
  RightContainer: { InfoContainer },
} = Base;
const { RWDHeight } = RWD;

const ResetPassword = () => {
  const [email, setEmail] = useState("");
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

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleVerifyClick = async () => {
    try {
      openNotification("top");
      const result = await AXIOS.forgetPassword({
        email,
      });
      console.log(result);
    } catch (e) {
      alert(e);
    }
  };

  return (
    <>
      {contextHolder}
      <Base>
        <Base.RightContainer>
          <RightContainer.InfoContainer
            style={{ height: RWDHeight(300), justifyContent: "space-evenly" }}
          >
            <InfoContainer.InputContainer style={{ marginTop: RWDHeight(10) }}>
              <InfoContainer.Title>Reset Password</InfoContainer.Title>
              <InfoContainer.Input
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
              />
            </InfoContainer.InputContainer>
            <InfoContainer.Button disabled={!email} onClick={handleVerifyClick}>
              Send Verification
            </InfoContainer.Button>
          </RightContainer.InfoContainer>
        </Base.RightContainer>
      </Base>
    </>
  );
};

export default ResetPassword;
