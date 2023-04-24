/*TODO:********************************************************************************************
  1. Button, disalbed 時的提示語
**************************************************************************************************/
import { Button as AntdButton, Tooltip, Image, ConfigProvider } from "antd";
import styled from "styled-components";
import { RWD } from "../constant";
import { googleLogin } from "../middleware";
const { RWDWidth, RWDRadius, RWDFontSize, RWDHeight } = RWD;

const BUTTONTYPE = ["primary", "secondary", "google"];

const Button = styled(AntdButton)`
  border-radius: ${RWDRadius(50)};
  font-weight: bold;
  font-size: ${RWDFontSize(20)};
  min-width: ${RWDWidth(130)};
  height: ${RWDHeight(55)};
  width: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  /* color: "#000000"; */
  /* &:disabled {
    cursor: default;
    pointer-events: all !important;
  } */
`;

const GoogleButton = styled(AntdButton)`
  width: 100%;
  height: ${RWDHeight(70)};
  background: white;
  border: ${RWDRadius(1)} solid #808080;
  border-radius: ${RWDRadius(15)};
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: ${RWDWidth(20)};
  font-size: RWDFontSize(21);
  font-weight: bold;
`;

export default (type = "primary") =>
  (prop) => {
    if (!BUTTONTYPE.includes(type)) {
      throw new Error(
        `請定義 Btton 種類，有以下可以選擇：\n${BUTTONTYPE.join(", ")}`
      );
    }
    switch (type) {
      case "primary":
        return (
          <Tooltip title={"待補"} placement="bottom">
            <ConfigProvider
              theme={{
                components: {
                  Button: {
                    colorPrimary: "#B3DEE5",
                    colorPrimaryHover: "#D6F7F6",
                    colorPrimaryActive: "#5A8EA4",
                    colorTextLightSolid: "#000000",
                  },
                },
              }}
            >
              <Button {...prop} type="primary">
                {prop.children}
              </Button>
            </ConfigProvider>
          </Tooltip>
        );
      case "google":
        return (
          <GoogleButton
            {...prop}
            onClick={() => {
              googleLogin();
              // window.open("http://localhost:8000/google-login", "_self");
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
      default:
        break;
    }
  };
