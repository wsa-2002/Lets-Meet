import styled from "styled-components";
import { Button, Space } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import "../css/Background.css";
import { Link, useNavigate } from "react-router-dom";
import { useMeet } from "../containers/hooks/useMeet";

const Header = ({ location = "none" }) => {
    const { removeCookie, setLogin } = useMeet();
    const navigate = useNavigate();

    const goHome = () => {
        navigate("/");
    }
    const goMeets = () => {
        navigate("/meets");
    }

  return (
    <div className="header">
      <Button
        type="link"
        style={{
          fontSize: "28px",
          color: "#FFA601",
          marginLeft: "1%",
          marginRight: "2%",
          height: "100%",
          fontFamily: "Lobster",
          float: "left",
        }}
        onClick={goHome}
      >
        Let's Meet
      </Button>
      {location === "meet" ? (
        <Button
          type="link"
          style={{
            fontSize: "22px",
            color: "#DB8600",
            backgroundColor: "#FDF3D1",
            height: "100%",
            fontWeight: 800,
            fontFamily: "Nunito",
            float: "left",
          }}
          onClick={goMeets}
        >
          Meets
        </Button>
      ) : (
        <Button
          type="link"
          style={{
            fontSize: "22px",
            color: "#808080",
            height: "100%",
            fontFamily: "Nunito",
            fontWeight: 600,
            float: "left",
          }}
          onClick={goMeets}
        >
          Meets
        </Button>
      )}
      {location === "calendar" ? (
        <Button
          type="link"
          style={{
            fontSize: "22px",
            color: "#DB8600",
            backgroundColor: "#FDF3D1",
            height: "100%",
            fontWeight: 800,
            fontFamily: "Nunito",
            float: "left",
          }}
          onClick={goMeets}
        >
          Calendar
        </Button>
      ) : (
        <Button
          type="link"
          style={{
            fontSize: "22px",
            color: "#808080",
            height: "100%",
            fontFamily: "Nunito",
            fontWeight: 600,
            float: "left",
          }}
          onClick={goMeets}
        >
          Calendar
        </Button>
      )}
      {location === "routine" ? (
        <Button
          type="link"
          style={{
            fontSize: "22px",
            color: "#DB8600",
            backgroundColor: "#FDF3D1",
            height: "100%",
            fontWeight: 800,
            fontFamily: "Nunito",
            float: "left",
          }}
          onClick={goMeets}
        >
          Routine
        </Button>
      ) : (
        <Button
          type="link"
          style={{
            fontSize: "22px",
            color: "#808080",
            height: "100%",
            fontFamily: "Nunito",
            fontWeight: 600,
            float: "left",
          }}
          onClick={goMeets}
        >
          Routine
        </Button>
      )}
      <Button
        type="link"
        icon={<LogoutOutlined />}
        style={{
          fontSize: "22px",
          color: "#808080",
          height: "100%",
          float: "right",
          marginRight: "1%",
        }}
        onClick={() => {
          removeCookie("token");
          setLogin(false);
        }}
      />
      <Button
        type="link"
        style={{
          fontSize: "22px",
          color: "#808080",
          height: "100%",
          float: "right",
          fontFamily: "Nunito",
          fontWeight: 600,
        }}
        onClick={goMeets}
      >
        Settings
      </Button>
    </div>
  );
};

const Header2 = () => {
    const navigate = useNavigate();

    const goHome = () => {
        navigate("/");
    }

    const handleLogin = () => {
        navigate("/login");
    };

    return (
        <div className="header">
        <Button
            type="link"
            style={{
            fontSize: "28px",
            color: "#FFA601",
            marginRight: "10%",
            height: "100%",
            fontFamily: "Lobster",
            }}
            onClick={goHome}
        >
            Let's Meet
        </Button>
        <Button
            style={{
            float: "right",
            marginTop: "1%",
            marginRight: "1%",
            borderRadius: "15px",
            borderColor: "#FFA601",
            color: "#FFA601",
            fontFamily: "Nunito",
            }}
            onClick={handleLogin}
        >
            Login
        </Button>
        </div>
    );
};

export { Header, Header2 };
