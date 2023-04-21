/*TODO:********************************************************************************************
  1. RWD, 頁面縮過小時的錯誤
  2. RWD, 高度縮小「有時」scrollBar 會跑出來造成頁面錯誤
**************************************************************************************************/
import React, { useEffect, useRef } from "react";
import Base from "../../components/Base/左橘3右白7";
import TimeCell from "../../components/TimeCell";
import { RWD } from "../../constant";
import Moment from "moment";
import styled from "styled-components";
import { extendMoment } from "moment-range";
import _ from "lodash";

const moment = extendMoment(Moment);
const { RWDHeight, RWDFontSize, RWDWidth } = RWD;

const InfoContainer = Object.assign(
  styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
  `,
  {
    TimeCellsContainer: Object.assign(
      styled.div`
        display: flex;
        justify-content: flex-end;
        column-gap: ${RWDWidth(24)};
        width: ${RWDWidth(600)};
        padding-top: ${RWDHeight(11)};
        max-height: 80vh;
        overflow-y: scroll;
        &::-webkit-scrollbar {
          display: none;
        }
        -ms-overflow-style: none;
        scrollbar-width: none;
      `,
      {
        DayColumn: Object.assign(
          styled.div`
            display: flex;
            flex-direction: column;
            row-gap: ${RWDHeight(5)};
            width: ${RWDWidth(50)};
          `,
          {
            TimeContainer: styled.div`
              position: absolute;
              left: min(${RWDWidth(-45)}, -50px);
              top: ${RWDHeight(-12)};
            `,
          }
        ),
      }
    ),
    WeekContainer: Object.assign(
      styled.div`
        display: flex;
        align-items: center;
        column-gap: ${RWDWidth(24)};
        justify-content: flex-end;
        width: ${RWDWidth(600)};
      `,
      {
        WeekDayContainer: styled.div`
          width: ${RWDWidth(50)};
          font-size: ${RWDFontSize(24)};
          text-align: center;
        `,
      }
    ),
  }
);

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TIMESLOTIDS = _.range(1, 50); //記得加 1
console.log(TIMESLOTIDS);
const slotIDProcessing = (id) => {
  let hour = String(parseInt(((id - 1) * 30) / 60));
  const startHour = "0".repeat(2 - hour.length) + hour;
  const startMinute = parseInt(((id - 1) * 30) % 60) ? "30" : "00";
  return `${startHour}:${startMinute}`;
};

const Routine = () => {
  const 讓頁面自動滾 = useRef(null);
  useEffect(() => {
    if (讓頁面自動滾?.current) {
      // use to get the size (width, height) of an element and its position
      // (x, y, top, left, right, bottom) relative to the viewport.
      //  讓頁面自動滾.current.getBoundingClientRect();
      讓頁面自動滾.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });

      // You have to call `current` from the Ref
      // Add the `scrollTo()` second parameter (which is left)
      // childRef.current.scrollTo(y, 0)

      // Initially it was set to `false` and we change it to `true` when click on scroll
      // button then we change it back to `false` when re-render
      // setTopPosition(false)
    }
  }, [讓頁面自動滾]);

  return (
    <Base
      header={{ show: true, login: true }}
      title_disable={true}
      // leftchild={leftChild}
    >
      <Base.LeftContainer
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            fontSize: "3vmin",
            color: "#B76A00",
            margin: 0,
            fontWeight: 600,
            letterSpacing: "1px",
          }}
        >
          How does routine work?
        </p>
      </Base.LeftContainer>
      <Base.RightContainer style={{ gridRow: "2/3", position: "relative" }}>
        <InfoContainer>
          <InfoContainer.WeekContainer>
            {WEEKDAYS.map((w, w_index) => (
              <InfoContainer.WeekContainer.WeekDayContainer key={w_index}>
                {w}
              </InfoContainer.WeekContainer.WeekDayContainer>
            ))}
          </InfoContainer.WeekContainer>
          <InfoContainer.TimeCellsContainer>
            {WEEKDAYS.map((_, w_index) => (
              <InfoContainer.TimeCellsContainer.DayColumn key={w_index}>
                {TIMESLOTIDS.map((t, t_index) => (
                  <div
                    key={t_index}
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      // whiteSpace: "nowrap",
                      position: "relative",
                    }}
                  >
                    {w_index === 0 && (
                      <InfoContainer.TimeCellsContainer.DayColumn.TimeContainer>
                        {slotIDProcessing(t)}
                      </InfoContainer.TimeCellsContainer.DayColumn.TimeContainer>
                    )}
                    {t_index !== TIMESLOTIDS.length - 1 && (
                      <TimeCell
                        style={{
                          background: "#F0F0F0",
                        }}
                        ref={t === 43 ? 讓頁面自動滾 : null}
                      />
                    )}
                  </div>
                ))}
              </InfoContainer.TimeCellsContainer.DayColumn>
            ))}
          </InfoContainer.TimeCellsContainer>
        </InfoContainer>
      </Base.RightContainer>
    </Base>
  );
};

export default Routine;
