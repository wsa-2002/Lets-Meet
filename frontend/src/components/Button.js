/*TODO:********************************************************************************************
  1. Button, disalbed 時的提示語
**************************************************************************************************/
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button as AntdButton, Tooltip, Image, ConfigProvider } from "antd";
import styled from "styled-components";
import { RWD } from "../constant";
import { googleLogin } from "../middleware";
const { RWDWidth, RWDRadius, RWDFontSize, RWDHeight } = RWD;

const BUTTONTYPE = ["primary", "secondary", "google", "back", "modal", "rect"];

const BaseButton = styled(AntdButton)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PrimaryButton = styled(BaseButton)`
  border-radius: ${RWDRadius(50)};
  font-weight: 800;
  font-size: ${RWDFontSize(20)};
  min-width: ${RWDWidth(130)};
  height: ${RWDHeight(55)};
  width: fit-content;
  /* color: "#000000"; */
  /* &:disabled {
    cursor: default;
    pointer-events: all !important;
  } */
`;

const GoogleButton = styled(BaseButton)`
  width: 100%;
  height: ${RWDHeight(70)};
  background: white;
  border: ${RWDRadius(1)} solid #808080;
  border-radius: ${RWDRadius(15)};
  column-gap: ${RWDWidth(20)};
  font-size: ${RWDFontSize(21)};
  font-weight: 900;
`;

const BackButton = styled(BaseButton)`
  border-color: white;
  color: #808080;
`;

const ModalButton = styled(BaseButton)`
  border-radius: ${RWDRadius(5)};
  width: ${RWDWidth(42)};
  height: ${RWDHeight(32)};
  font-size: ${RWDFontSize(14)};
`;

const RectButton = styled(ModalButton)`
  width: fit-content;
  height: fit-content;
  font-weight: 700;
`;

export default (type = "primary") =>
  (prop) => {
    if (!BUTTONTYPE.includes(type)) {
      throw new Error(
        `請定義 Btton 種類，有以下可以選擇：\n${BUTTONTYPE.join(", ")}`
      );
    }
    let Component;
    let ButtonStyle;
    switch (type) {
      case "google":
        return (
          <GoogleButton
            {...prop}
            onClick={() => {
              googleLogin();
            }}
          >
            <Image
              width={RWDFontSize(30)}
              src={require("../resources/google.png")}
              preview={false}
            />
            {prop.children}
          </GoogleButton>
        );
      case "primary":
        Component = (
          <Tooltip title={"待補"} placement="bottom">
            <PrimaryButton {...prop} type="primary">
              {prop.children}
            </PrimaryButton>
          </Tooltip>
        );
        ButtonStyle = {
          colorPrimary: "#B3DEE5",
          colorPrimaryHover: "#D6F7F6",
          colorPrimaryActive: "#5A8EA4",
          colorTextLightSolid: "#000000",
        };
        break;
      case "back":
        Component = <BackButton icon={<ArrowLeftOutlined />} {...prop} />;
        ButtonStyle = { controlTmpOutline: "rgba(0, 0, 0, 0)" };
        break;
      case "modal":
        Component = (
          <ModalButton type="primary" {...prop}>
            {prop.children}
          </ModalButton>
        );
        ButtonStyle = {
          colorTextLightSolid: prop.style.color ?? "#000000",
        };
        break;
      case "rect":
        Component = <RectButton {...prop}>{prop.children}</RectButton>;
      default:
        break;
    }
    return (
      <ConfigProvider
        theme={{
          components: {
            Button: {
              controlTmpOutline: "rgba(0, 0, 0, 0)",
              controlOutline: "rgba(0, 0, 0, 0)",
              ...ButtonStyle,
            },
          },
        }}
      >
        {Component}
      </ConfigProvider>
    );
  };
