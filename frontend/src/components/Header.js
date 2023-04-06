import styled from "styled-components";
import "@fontsource/roboto/500.css";
import { Button, Space } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import "../css/Background.css";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  return (
    <div className="header">
        <Button type="link" style={{fontSize: "28px", fontFamily: "Lobster", color: "#FFA601", marginRight: "10%"}}>Let's Meet</Button>
        <Space size="large">
          <Button type="link" style={{fontSize: "24px", fontFamily: "Nunito", color: "#808080"}}>Meets</Button>
          <Button type="link" style={{fontSize: "24px", fontFamily: "Nunito", color: "#808080"}}>Routine</Button>
          <Button type="link" style={{fontSize: "24px", fontFamily: "Nunito", color: "#808080"}}>Calender</Button>
        </Space>
        <Space size="large" style={{position: "absolute", left: "88%"}}>
          <Button type="link" style={{fontSize: "24px", fontFamily: "Nunito", color: "#808080"}}>Setting</Button>
          <Button type="link" icon={<LogoutOutlined />} style={{fontSize: "24px", fontFamily: "Nunito", color: "#808080"}}/>
        </Space>
    </div>
  );
}

const Header2 = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    }

    return (
        <div className="header"><Button style={{position: "absolute", left: "90%", marginTop: "1%", borderRadius: "15px",
        borderColor: "#FFA601", color: "#FFA601"}} onClick={handleLogin}>Login</Button></div>
    );
  }

export {Header, Header2};