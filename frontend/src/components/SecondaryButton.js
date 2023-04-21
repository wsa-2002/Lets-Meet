import styled from "styled-components";
import { Button, Space } from "antd";
import "../css/Background.css";
import { useMeet } from "../containers/hooks/useMeet";

const SecondaryButton = ({background, borderColor, color, handleClick, text, style={}, disabled=false}) => {
    return (
        <Button
            style={Object.assign({
                background: background,
                borderColor: borderColor,
                color: color,
            }, style)}
            onClick={handleClick}
            disabled={disabled}
        >
            {text}
        </Button>
    );
  };
  
export default SecondaryButton;