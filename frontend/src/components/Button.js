/*TODO:********************************************************************************************
  1. Button, disalbed 時的提示語
**************************************************************************************************/
import { Button as AntdButton, Tooltip, Image } from "antd";
import styled from "styled-components";
import { RWD, FONTS } from "../constant";
const { RWDWidth, RWDRadius, RWDFontSize, RWDHeight } = RWD;
const { main } = FONTS;

const BUTTONTYPE = ["primary", "secondary", "google"];

const Button = styled(AntdButton)`
  border-radius: ${RWDRadius(50)};
  background: #b3dee5;
  border: 0;
  font-weight: bold;
  font-size: ${RWDFontSize(20)};
  min-width: ${RWDWidth(130)};
  height: ${RWDHeight(55)};
  width: fit-content;
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
            <Button {...prop}>{prop.children}</Button>
          </Tooltip>
        );
      case "google":
        return (
          <GoogleButton
            {...prop}
            onClick={() => {
              window.open("http://localhost:8000/google-login", "_self");
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
