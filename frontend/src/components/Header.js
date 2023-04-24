import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { Button, ConfigProvider } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useMeet } from "../containers/hooks/useMeet";
import Title from "../components/Title";
import _ from "lodash";
import { RWD } from "../constant";
const { RWDFontSize, RWDRadius, RWDHeight, RWDWidth } = RWD;

const HeaderContainer = styled.div`
  width: 100%;
  background: white;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const URLContainer = styled.div`
  width: calc(100% * 25 / 35);
  display: flex;
  height: 100%;
  align-items: center;
  > div {
    width: calc(100% / 3);
    max-width: calc(100% / 3); //很可疑
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    /* border: 1px solid black; */
    cursor: pointer;
    > div {
      font-size: ${RWDFontSize(24)};
      color: #808080;
      font-weight: 600;
      letter-spacing: 1px;
    }
  }
`;

const NavItem = [
  {
    name: "Meets",
    to: "/meets",
    regex: [/^\/meets$/, /^\/voting\/.*$/, /^\/meets\/.*$/],
  },
  { name: "Calendar", to: "/calendar", regex: [/^\/calendar$/] },
  {
    name: "Routine",
    to: "/routine",
    regex: [/^\/routine$/],
  },
];

const Header = (prop) => {
  const { removeCookie, setLogin } = useMeet();
  const navigate = useNavigate();
  const ref = useRef(); //追蹤 header 們距離有無太擠
  const [adjusted, setAdjusted] = useState(false);
  const { pathname } = useLocation();
  console.log(pathname);

  const throttledHandleResize = _.throttle(() => {
    if (ref?.current?.children) {
      setAdjusted(
        Math.max(
          ...[...ref?.current?.children].map(
            (m) => m?.children?.[0].offsetWidth
          )
        ) >
          (window.innerWidth * 25) / 300
      );
    }
  }, 500);

  useEffect(() => {
    if (ref?.current?.children) {
      setAdjusted(
        Math.max(
          ...[...ref?.current?.children].map(
            (m) => m?.children?.[0].offsetWidth
          )
        ) >
          (window.innerWidth * 25) / 300
      );
    } //load 時
    window.addEventListener("resize", throttledHandleResize);
    return () => {
      window.removeEventListener("resize", throttledHandleResize);
    };
  }, []);

  return (
    <HeaderContainer
      style={{ ...prop?.style, borderBottom: !prop?.login && "none" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: adjusted ? "65vw" : "35vw",
          height: "100%",
          backgroundColor: !prop?.login && "#fefcef",
        }}
      >
        {prop?.login && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "calc(100% * 10 / 35)",
                height: "100%",
                cursor: "pointer",
              }}
              onClick={() => {
                navigate("/");
              }}
            >
              <Title
                style={{
                  fontSize: "3vmin",
                }}
              >
                Let's Meet
              </Title>
            </div>
            <URLContainer ref={ref}>
              {NavItem.map((n, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor:
                      n?.regex.some((regex) => regex.test(pathname)) &&
                      "#fdf3d1",
                  }}
                  onClick={() => {
                    navigate(n.to);
                  }}
                >
                  {/* 置中 */}
                  <div
                    style={{
                      color:
                        n?.regex.some((regex) => regex.test(pathname)) &&
                        "#DB8600",
                    }}
                  >
                    {n.name}
                  </div>
                </div>
              ))}
            </URLContainer>
          </>
        )}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          columnGap: "3vmin",
          marginRight: "3vw",
        }}
      >
        {prop?.login ? (
          <>
            <Button
              type="link"
              style={{
                fontSize: "2.2vmin",
                color: "#808080",
                height: "100%",
                fontWeight: 600,
                padding: 0,
                border: 0,
              }}
            >
              Settings
            </Button>
            <Button
              type="link"
              icon={<LogoutOutlined />}
              style={{
                fontSize: "2.3vmin",
                color: "#808080",
                height: "100%",
                padding: 0,
                border: 0,
              }}
              onClick={() => {
                removeCookie("token");
                setLogin(false);
              }}
            />
          </>
        ) : (
          <ConfigProvider
            theme={{
              components: {
                Button: {
                  colorBgTextHover: "#FFF4CC",
                  colorBgTextActive: "#B76A00",
                  colorText: "#FFA601",
                },
              },
            }}
          >
            <Button
              type="text"
              style={{
                borderRadius: RWDRadius(30),
                width: RWDWidth(80),
                height: RWDHeight(42),
                fontSize: RWDFontSize(16),
                minHeight: "fit-content",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #FFA601",
              }}
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </Button>
          </ConfigProvider>
          // <ConfigProvider
          //   theme={{
          //     components: {
          //       Button: {

          //         colorPrimaryBorder: "#FFA601",
          //       },
          //     },
          //   }}
          // >

          // </ConfigProvider>
        )}
      </div>
    </HeaderContainer>
  );
};

export default Header;
