import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useMeet } from "../containers/hooks/useMeet";
import Base from "../components/Base/orange3_white7";
import { RWD } from "../constant";
import { getRoutine, addRoutine, deleteRoutine } from "../middleware";
import Title from "../components/Title";
const { RWDHeight, RWDFontSize, RWDWidth } = RWD;

const InstructionContainer = Object.assign(
  styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    row-gap: ${RWDHeight(10)};
  `,
  {
    Item: styled.div`
      font-size: ${RWDFontSize(20)};
      color: #db8600;
      font-weight: 700;
    `,
  }
);

const InfoContainer = Object.assign(
  styled.div`
    display: flex;
    flex-direction: column;
    width: ${RWDWidth(880)};
    margin-top: ${RWDHeight(70)};
  `,
  {
    Title: styled.div`
      font-size: ${RWDFontSize(24)};
      font-weight: 700;
      border-bottom: 1px solid #808080;
    `,
  }
);

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TIMESLOTIDS = _.range(1, 50); //記得加 1

const Routine = () => {
  const { cookies, login, setLoading } = useMeet();
  const navigate = useNavigate();

  /*調整 Routine 文字 套組*/
  const RoutineRef = useRef(null);
  const [top, setTop] = useState(0);
  const throttledHandleResize = _.throttle(() => {
    if (RoutineRef?.current) {
      // setTimeTop(RoutineRef.current.offsetHeight);
      setTop(RoutineRef?.current.offsetTop);
    }
  }, 100);

  useEffect(() => {
    if (RoutineRef?.current) {
      setTop(RoutineRef?.current.offsetTop);
    } //load 時

    window.addEventListener("resize", throttledHandleResize);
    return () => {
      window.removeEventListener("resize", throttledHandleResize);
    };
  }, []);
  /******************************************************/

  return (
    <Base login={true} title_disable={true}>
      <Base.LeftContainer
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingRight: RWDWidth(18),
        }}
      >
        <p
          style={{
            fontSize: RWDFontSize(32),
            color: "#B76A00",
            margin: 0,
            fontWeight: 800,
            letterSpacing: "1px",
          }}
          ref={RoutineRef}
        >
          Settings
        </p>
        <InstructionContainer
          style={{ position: "absolute", top, marginTop: RWDHeight(80) }}
        >
          <InstructionContainer.Item>
            Set your account information
          </InstructionContainer.Item>
          <InstructionContainer.Item>
            Connect to third-party applications
          </InstructionContainer.Item>
          <InstructionContainer.Item>
            Change your notification preferences
          </InstructionContainer.Item>
        </InstructionContainer>
      </Base.LeftContainer>
      <Base.RightContainer
        style={{
          gridRow: "2/3",
          position: "relative",
          alignItems: "flex-start",
        }}
      >
        <InfoContainer>
          <InfoContainer.Title>Account Settings</InfoContainer.Title>
          <InfoContainer></InfoContainer>
        </InfoContainer>
      </Base.RightContainer>
    </Base>
  );
};

export default Routine;
