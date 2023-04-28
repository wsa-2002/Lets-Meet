import { Button, Divider } from "antd";
import React from "react";
import styled from "styled-components";
import i18n from "i18next";

const FooterContainer = styled.div`
  display: flex;
  justify-content: center;
  z-index: 20000;
  min-height: 8.5vh;
`;

const FooterInnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 92%;
  & > div {
    font-style: normal;
    font-weight: 400;
    font-size: 1.3vmin;
    color: #808080;
  }
`;

const Footer = (prop) => {
  return (
    <FooterContainer style={prop?.style}>
      <FooterInnerContainer>
        {/* <div>中文 | English</div> */}
        <div>
          <Button type="link" onClick={() => i18n.changeLanguage('zh')}>中文</Button>
          <Divider type="vertical" />
          <Button type="link" onClick={() => i18n.changeLanguage('en')}>English</Button>
        </div>
        <div>Copyright 2023</div>
      </FooterInnerContainer>
    </FooterContainer>
  );
};

export default Footer;
