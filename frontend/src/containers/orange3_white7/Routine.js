import _ from "lodash";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useMeet } from "../hooks/useMeet";
import Base from "../../components/Base/orange3_white7";
import TimeCell, { slotIDProcessing } from "../../components/TimeCell";
import { RWD } from "../../constant";
const { RWDHeight, RWDFontSize, RWDWidth } = RWD;
const DraggableCell = TimeCell("draggable");

const InstructionContainer = Object.assign(
  styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
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
    align-items: flex-end;
    flex-direction: column;
    height: ${RWDHeight(800)};
  `,
  {
    TimeCellsContainer: Object.assign(
      styled.div`
        display: flex;
        justify-content: flex-end;
        column-gap: ${RWDWidth(24)};
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
              right: 100%;
              margin-right: ${RWDWidth(12)};
              top: ${RWDHeight(-12.5)};
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

const Routine = () => {
  const { login, setLoading, MIDDLEWARE } = useMeet();
  const { getRoutine, addRoutine, deleteRoutine } = MIDDLEWARE;
  const navigate = useNavigate();

  /*可拖曳 time cell 套組*/
  const [cell, setCell] = useState([]);
  const [startDrag, setStartDrag] = useState(false); //啟動拖曳事件
  const [startIndex, setStartIndex] = useState([]); //選取方塊位置
  const oriCell = useMemo(() => cell, [startDrag]);
  const [updatedCell, setUpdatedCell] = useState("");
  const [mode, setMode] = useState(true); //選取模式
  const drag = {
    cell,
    setCell,
    startDrag,
    setStartDrag,
    startIndex,
    setStartIndex,
    mode,
    setMode,
    setUpdatedCell,
    oriCell,
  };
  /******************************************************/

  /*調整 TimeCellsContainer 寬度*/ //調整到最適大小讓它至中
  const [width, setWidth] = useState(0); //TimeCellsContainer 寬度
  const WeekdayRef = useRef(null);
  const TimeRef = useRef(null);
  const throttledHandleResizeFORTimeCellsContainerWidth = _.throttle(() => {
    if (WeekdayRef?.current && TimeRef?.current) {
      setWidth(WeekdayRef?.current.offsetWidth - TimeRef?.current.offsetLeft);
    }
  }, 100);

  useEffect(() => {
    if (WeekdayRef?.current && TimeRef?.current) {
      setWidth(WeekdayRef?.current.offsetWidth - TimeRef?.current.offsetLeft);
    } //load 時

    window.addEventListener(
      "resize",
      throttledHandleResizeFORTimeCellsContainerWidth
    );
    return () => {
      window.removeEventListener(
        "resize",
        throttledHandleResizeFORTimeCellsContainerWidth
      );
    };
  }, [cell]);
  /******************************************************/

  useEffect(() => {
    (async () => {
      try {
        if (!login) {
          navigate("/");
        } else {
          setLoading(true);
          const { data } = await getRoutine();
          setCell(
            WEEKDAYS.map((w) =>
              TIMESLOTIDS.map((t) =>
                Boolean(
                  data.find(
                    (d) => d.weekday === w.toUpperCase() && d.time_slot_id === t
                  )
                )
              )
            )
          );
          setLoading(false);
        }
      } catch (error) {
        //console.log(error);
      }
    })();
  }, [login]);

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

  const ref = useRef(null); //讓頁面自動滾
  // useEffect(() => {
  //   if (ref?.current && cell.length > 0 && !startDrag) {
  //     ref.current.scrollIntoView({
  //       behavior: "smooth",
  //       block: "nearest",
  //       inline: "start",
  //     });
  //   }
  // }, [ref, cell]);

  const handleCellMouseUp = async (e) => {
    e.preventDefault();
    try {
      if (!updatedCell) {
        return;
      }
      setStartDrag(false);
      const API = mode ? addRoutine : deleteRoutine;
      await API(
        updatedCell.map((u) => ({
          weekday: WEEKDAYS[u[0]].toUpperCase(),
          time_slot_id: TIMESLOTIDS[u[1]],
        }))
      );
    } catch (error) {
      throw error;
    } finally {
      setUpdatedCell("");
    }
  };

  return (
    <Base login={true} title_disable={true} onMouseUp={handleCellMouseUp}>
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
          How does routine work?
        </p>
        <InstructionContainer
          style={{ position: "absolute", top, marginTop: RWDHeight(80) }}
        >
          <InstructionContainer.Item style={{ marginBottom: RWDHeight(20) }}>
            Mark your unavailable time
          </InstructionContainer.Item>
          <InstructionContainer.Item>
            Your unavailable time will be shown as blocked
          </InstructionContainer.Item>
          <InstructionContainer.Item>
            when you are invited to a meeting
          </InstructionContainer.Item>
        </InstructionContainer>
      </Base.LeftContainer>
      <Base.RightContainer style={{ gridRow: "2/3", position: "relative" }}>
        {cell.length > 0 && (
          <InfoContainer>
            <InfoContainer.WeekContainer ref={WeekdayRef}>
              {WEEKDAYS.map((w, w_index) => (
                <InfoContainer.WeekContainer.WeekDayContainer key={w_index}>
                  {w}
                </InfoContainer.WeekContainer.WeekDayContainer>
              ))}
            </InfoContainer.WeekContainer>
            <InfoContainer.TimeCellsContainer style={{ width: `${width}px` }}>
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
                        <InfoContainer.TimeCellsContainer.DayColumn.TimeContainer
                          ref={TimeRef}
                        >
                          {slotIDProcessing(t)}
                        </InfoContainer.TimeCellsContainer.DayColumn.TimeContainer>
                      )}
                      {t_index !== TIMESLOTIDS.length - 1 && (
                        <DraggableCell
                          style={{
                            background: cell[w_index][t_index]
                              ? "#808080"
                              : "#F0F0F0",
                          }}
                          ref={t === 43 ? ref : null}
                          drag={drag}
                          index={[w_index, t_index]}
                        />
                      )}
                    </div>
                  ))}
                </InfoContainer.TimeCellsContainer.DayColumn>
              ))}
            </InfoContainer.TimeCellsContainer>
          </InfoContainer>
        )}
      </Base.RightContainer>
    </Base>
  );
};

export default Routine;
