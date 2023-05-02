/**************************************************************************************************
 DONE!
**************************************************************************************************/
import React, { useState } from "react";
import { notification } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import * as AXIOS from "../../middleware";
import Base from "../../components/Base/orange3_white7";
import { RWD } from "../../constant";
import { useTranslation } from 'react-i18next';
const {
  RightContainer,
  RightContainer: { InfoContainer },
} = Base;
const { RWDHeight } = RWD;

const ResetPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (placement) => {
    api.info({
      message: t("verSent"),
      description: t("checkMail"),
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
              <InfoContainer.Title>{t("resetPass")}</InfoContainer.Title>
              <InfoContainer.Input
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
              />
            </InfoContainer.InputContainer>
            <InfoContainer.Button disabled={!email} onClick={handleVerifyClick}>
              {t("sendVer")}
            </InfoContainer.Button>
          </RightContainer.InfoContainer>
        </Base.RightContainer>
      </Base>
    </>
  );
};

export default ResetPassword;
