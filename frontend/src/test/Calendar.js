import React, { useEffect, useState } from "react";
import Base from "../components/Base/145MeetRelated";
import { useMeet } from "../containers/hooks/useMeet";
import "./styles.css";
import styled from "styled-components";
import { RWD } from "../constant";
import CustomTuiCalendar from "./components/CustomTuiCalendar";
import { getCalendar } from "../middleware";
const { RWDWidth, RWDHeight } = RWD;

const CalendarContainer = styled.div`
  position: relative;
  height: ${RWDHeight(840)};
  width: ${RWDWidth(1260)};
  left: calc(25vw / 3);
  margin-top: ${RWDHeight(60)};
`;

export default () => {
  const { login, cookies } = useMeet();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    (async () => {
      if (login) {
        const { data } = await getCalendar(
          { start_date: "2023-01-01", end_date: "2023-01-07" },
          cookies.token
        );
        // console.log
      }
    })();
  }, [login]);

  return (
    <Base login={login}>
      <Base.FullContainer>
        <CalendarContainer>
          <CustomTuiCalendar />
        </CalendarContainer>
      </Base.FullContainer>
    </Base>
  );
};
