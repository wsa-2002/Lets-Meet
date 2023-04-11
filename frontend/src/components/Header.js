import styled from "styled-components";
import { Button, Space } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import "../css/Background.css";
import { Link, useNavigate } from "react-router-dom";
import { useMeet } from "../containers/hooks/useMeet";


const Header = ({ location = "none" }) => {
  const { removeCookie, setLogin } = useMeet();
  //location表示現在在哪個頁面
  return (
    <div className="header">
      <Button
        type="link"
        style={{
          fontSize: "28px",
          color: "#FFA601",
          marginRight: "10%",
          height: "100%",
        }}
        href="/"
      >
        Let's Meet
      </Button>
      {location === "meet" ? (
        <Button
          type="link"
          style={{
            fontSize: "24px",
            color: "#DB8600",
            backgroundColor: "#FDF3D1",
            height: "100%",
          }}
          href="/meets"
        >
          Meets
        </Button>
      ) : (
        <Button
          type="link"
          style={{
            fontSize: "24px",
            color: "#808080",
            height: "100%",
          }}
          href="/meets"
        >
          Meets
        </Button>
      )}
      {location === "calendar" ? (
        <Button
          type="link"
          style={{
            fontSize: "24px",
            color: "#DB8600",
            backgroundColor: "#FDF3D1",
            height: "100%",
          }}
        >
          Calendar
        </Button>
      ) : (
        <Button
          type="link"
          style={{
            fontSize: "24px",
            color: "#808080",
            height: "100%",
          }}
        >
          Calendar
        </Button>
      )}
      {location === "routine" ? (
        <Button
          type="link"
          style={{
            fontSize: "24px",
            color: "#DB8600",
            backgroundColor: "#FDF3D1",
            height: "100%",
          }}
        >
          Routine
        </Button>
      ) : (
        <Button
          type="link"
          style={{
            fontSize: "24px",
            color: "#808080",
            height: "100%",
          }}
        >
          Routine
        </Button>
      )}
      <Button
        type="link"
        style={{
          fontSize: "24px",
          color: "#808080",
          height: "100%",
          position: "absolute",
          left: "88%",
        }}
      >
        Setting
      </Button>
      <Button
        type="link"
        icon={<LogoutOutlined />}
        style={{
          fontSize: "24px",
          color: "#808080",
          height: "100%",
          position: "absolute",
          left: "95%",
        }}
        onClick={() => {
          removeCookie("token");
          setLogin(false);
        }}
      />
    </div>
  );
};

const Header2 = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="header">
      <Button
        style={{
          position: "absolute",
          left: "90%",
          marginTop: "1%",
          borderRadius: "15px",
          borderColor: "#FFA601",
          color: "#FFA601",
        }}
        onClick={handleLogin}
      >
        Login
      </Button>
    </div>
  );
};

export { Header, Header2 };
