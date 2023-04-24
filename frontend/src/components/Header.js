import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useMeet } from "../containers/hooks/useMeet";
import Title from "../components/Title";
import _ from "lodash";
import { RWD } from "../constant";
const { RWDFontSize } = RWD;

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
  { name: "Meets", to: "/meets", alt: ["/voting", "/meetinfo"] },
  { name: "Calendar", to: "/calendar" },
  {
    name: "Routine",
    to: "/routine",
  },
];

const Header = (prop) => {
  const { removeCookie, setLogin } = useMeet();
  const navigate = useNavigate();
  const 追蹤header們距離有無太擠 = useRef();
  const [adjusted, setAdjusted] = useState(false);
  const { pathname } = useLocation();

  const throttledHandleResize = _.throttle(() => {
    if (追蹤header們距離有無太擠?.current?.children) {
      setAdjusted(
        Math.max(
          ...[...追蹤header們距離有無太擠?.current?.children].map(
            (m) => m?.children?.[0].offsetWidth
          )
        ) >
          (window.innerWidth * 25) / 300
      );
    }
  }, 500);

  useEffect(() => {
    window.addEventListener("resize", throttledHandleResize);
    return () => {
      window.removeEventListener("resize", throttledHandleResize);
    };
  }, []);

  return (
    <HeaderContainer style={prop?.style}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: adjusted ? "65vw" : "35vw",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "calc(100% * 10 / 35)",
            height: "100%",
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
        <URLContainer ref={追蹤header們距離有無太擠}>
          {NavItem.map((n, index) => (
            <div
              key={index}
              style={{
                backgroundColor:
                  (pathname === n.to || n?.alt?.includes(pathname)) &&
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
                    (pathname === n.to || n?.alt?.includes(pathname)) &&
                    "#DB8600",
                }}
              >
                {n.name}
              </div>
            </div>
          ))}
        </URLContainer>
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
          <Button
            style={{
              borderRadius: "15px",
              borderColor: "#FFA601",
              color: "#FFA601",
            }}
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </Button>
        )}
      </div>
    </HeaderContainer>
  );
};

export default Header;
