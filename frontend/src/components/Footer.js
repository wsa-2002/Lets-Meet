import { Button, Divider } from "antd";
import i18n from "i18next";
import React from "react";
import { RWD } from "../constant";
import styled from "styled-components";
import Link from "./Link";
const { RWDFontSize, RWDWidth } = RWD;

const FooterContainer = styled.div`
  display: flex;
  justify-content: center;
  /* z-index: ; */
  min-height: 8.5vh;
`;

const FooterInnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: ${RWDWidth(1720)};
  font-size: ${RWDFontSize(14)};
  color: #808080;
`;

const Footer = (prop) => {
  return (
    <FooterContainer style={prop?.style}>
      <FooterInnerContainer>
        {/* <div>中文 | English</div> */}
        <div>
          <Link onClick={() => i18n.changeLanguage("zh")} linkTheme="#808080">
            中文
          </Link>
          <Divider type="vertical" />
          <Link onClick={() => i18n.changeLanguage("en")} linkTheme="#808080">
            English
          </Link>
        </div>
        <div>Copyright 2023</div>
      </FooterInnerContainer>
    </FooterContainer>
  );
};

export default Footer;
