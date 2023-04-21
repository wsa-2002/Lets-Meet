import styled from "styled-components";
import { Button, Space } from "antd";
import "../css/Background.css";
import { useMeet } from "../containers/hooks/useMeet";

const PrimaryButton = ({handleClick, text, style={}, disabled=false}) => {
    return (
        <Button
            size={"large"}
            style={Object.assign({
                borderRadius: "20px",
                background: "#B3DEE5",
                borderColor: "#B3DEE5",
                fontWeight: "bold",
            }, style)}
            onClick={handleClick}
            disabled={disabled}
        >
            {text}
        </Button>
    );
  };
  
export default PrimaryButton;