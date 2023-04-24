/**************************************************************************************************
 DONE!
**************************************************************************************************/
import React, { useRef } from "react";
import { notification } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import * as AXIOS from "../../middleware";
import Base from "../../components/Base/左橘3右白7";
import { RWD } from "../../constant";
const {
  RightContainer,
  RightContainer: { InfoContainer },
} = Base;
const { RWDHeight } = RWD;

const ResetPassword = () => {
  const EmailRef = useRef(null);

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
        console.log(result);
      } catch (e) {
        alert(e);
      }
    } else {
      console.log("Email 不能為空");
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
              <InfoContainer.Input placeholder="Email" ref={EmailRef} />
            </InfoContainer.InputContainer>
            <InfoContainer.Button
              // disabled={
              //   newPassword["Confirmed New Password"] !==
              //   newPassword["New Password"]
              // }
              onClick={handleVerifyClick}
            >
              Send Verification
            </InfoContainer.Button>
          </RightContainer.InfoContainer>
        </Base.RightContainer>
      </Base>
    </>
  );
};

export default ResetPassword;
