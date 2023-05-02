/*TODO:********************************************************************************************
  1. RWD, 版面縮小到一定程度時兩個 component 會重疊。  
**************************************************************************************************/
import _ from "lodash";
import Moment from "moment";
import { extendMoment } from "moment-range";
import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";
import { useMeet } from "./hooks/useMeet";
import { RWD } from "../constant";
import Base from "../components/Base/145MeetRelated";
import Button from "../components/Button";
import TimeCell, { slotIDProcessing } from "../components/TimeCell";
import { useTranslation } from 'react-i18next';
import {
  getGroupAvailability,
  getMyAvailability,
  addMyAvailability,
  deleteMyAvailability,
  getMeetInfo,
  getRoutine,
} from "../middleware";
const BackButton = Button("back");
const { ContentContainer } = Base.FullContainer;
const { RWDWidth } = RWD;
const DraggableCell = TimeCell("draggable");
const moment = extendMoment(Moment);

const Voting = () => {
  /*調整 time gap 套組*/
  const WeekdayRef = useRef(null); //追蹤天數高度
  const TimeCellRef = useRef(null); //追蹤 TimeCell 高度
  const TimeRef = useRef(null);
  const [timeTop, setTimeTop] = useState(0);
  /******************************************************/

  /*可拖曳 time cell 套組*/
  const [cell, setCell] = useState([]);
  const { t } = useTranslation();
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

  const [DATERANGE, setDATERANGE] = useState([]);
  const [TIMESLOTIDS, setTIMESLOTIDS] = useState([]);
  const [VOTINGINFO, setVOTINGINFO] = useState([]);
  const [ROUTINE, setROUTINE] = useState("");

  const { code } = useParams();
  const { cookies, login } = useMeet();
  const navigate = useNavigate();

  const handleMeetInfo = async () => {
    try {
      const { data: votingData } = await getGroupAvailability(
        code,
        cookies.token
      );
      setVOTINGINFO(votingData.data);

      const { data: routine } = await getRoutine(undefined, cookies.token);
      setROUTINE(routine);

      const { data } = await getMeetInfo(undefined, cookies.token, code);
      setDATERANGE(
        [
          ...moment
            .range(moment(data.start_date), moment(data.end_date))
            .by("day"),
        ].map((m) => m.format("YYYY-MM-DD"))
      );
      setTIMESLOTIDS(
        _.range(data.start_time_slot_id, data.end_time_slot_id + +2)
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      if (DATERANGE.length && TIMESLOTIDS.length && ROUTINE) {
        const { data: myAvailability } = await getMyAvailability(
          code,
          cookies.token
        );
        setCell(
          DATERANGE.map((w) =>
            TIMESLOTIDS.map((t) =>
              myAvailability.find((d) => d.date === w && d.time_slot_id === t)
                ? true
                : ROUTINE.find(
                    (r) =>
                      r.weekday === moment(w).format("ddd").toUpperCase() &&
                      r.time_slot_id === t
                  )
                ? null
                : false
            )
          )
        );
      }
    })();
  }, [DATERANGE, TIMESLOTIDS]);

  useEffect(() => {
    if (code) {
      handleMeetInfo();
    }
  }, [code]);

  const chooseColor = (num) => {
    if (num === 0) return "#f0f0f0";
    const hexStr = (
      parseInt("FFF4CC", 16) - parseInt(((num - 1) * 3635).toString(16), 16)
    ).toString(16);
    while (hexStr.length < 6) {
      hexStr = "0" + hexStr;
    } // Zero pad.
    return `#${hexStr}`;
  };

  const throttledHandleResize = _.throttle(() => {
    if (WeekdayRef?.current) {
      setTimeTop(WeekdayRef.current.offsetHeight);
    }
  }, 100);

  useEffect(() => {
    if (WeekdayRef?.current) {
      setTimeTop(WeekdayRef.current.offsetHeight);
    } //load 時
    window.addEventListener("resize", throttledHandleResize);
    return () => {
      window.removeEventListener("resize", throttledHandleResize);
    };
  }, [cell]);

  const handleCellMouseUp = async (e) => {
    e.preventDefault();
    try {
      if (!updatedCell) {
        return;
      }
      setStartDrag(false);
      const API = mode ? addMyAvailability : deleteMyAvailability;
      await API(
        code,
        {
          time_slots: updatedCell.map((u) => ({
            date: DATERANGE[u[0]],
            time_slot_id: u[1] + 1,
          })),
        },
        cookies.token
      );
    } catch (error) {
      throw error;
    } finally {
      setUpdatedCell("");
    }
  };

  return (
    <ScrollSync>
      <Base login={login} onMouseUp={handleCellMouseUp}>
        <Base.FullContainer>
          {cell.length > 0 && (
            <Base.FullContainer.ContentContainer>
              <ContentContainer.Title>
                <BackButton
                  style={{
                    position: "absolute",
                    right: "100%",
                    marginRight: RWDWidth(30),
                  }}
                  onClick={() => {
                    navigate(`/meets/${code}`);
                  }}
                ></BackButton>
                <span>{"SDM"}</span>
              </ContentContainer.Title>
              <ContentContainer.MyAvailability>
                {t("myAva")}
              </ContentContainer.MyAvailability>
              <ContentContainer.GroupAvailability>
              {t("groupAva")}
              </ContentContainer.GroupAvailability>
              <ContentContainer.MyAvailability.VotingContainer>
                <ContentContainer.MyAvailability.VotingContainer.TimeContainer
                  style={{
                    marginTop: `${timeTop - 3}px`,
                  }}
                >
                  {TIMESLOTIDS.map((m, index) => (
                    <div ref={TimeRef} key={index}>
                      {slotIDProcessing(m)}
                    </div>
                  ))}
                </ContentContainer.MyAvailability.VotingContainer.TimeContainer>
                <ContentContainer.MyAvailability.VotingContainer.CellsContainer>
                  {DATERANGE.map((m, d_index) => (
                    <ContentContainer.MyAvailability.VotingContainer.CellsContainer.DayColumn
                      key={d_index}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                        ref={WeekdayRef}
                      >
                        <div style={{ userSelect: "none" }}>
                          {moment(m).format("MMM D")}
                        </div>
                        <div style={{ userSelect: "none", fontWeight: "700" }}>
                          {moment(m).format("ddd")}
                        </div>
                      </div>
                      {TIMESLOTIDS.map(
                        (_, t_index) =>
                          t_index !== TIMESLOTIDS.length - 1 && (
                            <DraggableCell
                              style={{
                                background:
                                  cell[d_index][t_index] === null
                                    ? "#808080"
                                    : cell[d_index][t_index]
                                    ? "#94C9CD"
                                    : "#F0F0F0",
                              }}
                              // ref={t === 43 ? ref : null}
                              drag={drag}
                              index={[d_index, t_index]}
                              key={t_index}
                              ref={TimeCellRef}
                            />
                          )
                      )}
                    </ContentContainer.MyAvailability.VotingContainer.CellsContainer.DayColumn>
                  ))}
                </ContentContainer.MyAvailability.VotingContainer.CellsContainer>
              </ContentContainer.MyAvailability.VotingContainer>
            </Base.FullContainer.ContentContainer>
          )}
        </Base.FullContainer>

        {/* <div style={{ width: "100%", position: "relative" }}>
          <div
            style={{
              borderLeft: "1px #000000 dashed",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <NameWrapper>
              <div
                style={{
                  fontFamily: "Roboto",
                  fontStyle: "normal",
                  fontWeight: "500",
                  fontSize: "calc(100vmin * 30 / 1080)",
                }}
              >
                SDM Class
              </div>
<<<<<<< HEAD
            </ScrollSyncPane>
          </div>
        </FormWrapper>
      </div>
    </div>
  );

  const rightChild = (
    <div
      style={{
        // borderLeft: "1px #000000 dashed",
        // borderRight: "1px #000000 dashed",
        display: "flex",
        justifyContent: "center",
        width: "100%",
        position: "relative",
      }}
    >
      <FormWrapper>
        <div
          style={{
            fontFamily: "Roboto",
            fontWeight: "500",
            fontSize: "20px",
          }}
        >
          {t("groupAva")}
        </div>
        <div
          style={{
            display: "flex",
            columnGap: "2px",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <DayColumn
            style={{
              alignItems: "flex-end",
              marginRight: "5px",
              marginTop: "-10px",
            }}
          >
            <div style={{ opacity: "0" }}>Mar 29</div>
            <div style={{ opacity: "0" }}>Wed</div>
            {TIMESLOTIDS.map((t, Tindex) => (
=======
            </NameWrapper>
            <FormWrapper onMouseUp={handleCellMouseUp}>
>>>>>>> origin/main
              <div
                style={{
                  fontFamily: "Roboto",
                  fontWeight: "500",
                  fontSize: "20px",
                }}
              >
                My Availability
              </div>
              <div
                style={{
                  display: "flex",
                  columnGap: "2px",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <DayColumn
                  style={{
                    alignItems: "flex-end",
                    marginRight: "5px",
                    marginTop: "-10px",
                  }}
                >
                  <div style={{ opacity: "0" }}>Mar 29</div>
                  <div style={{ opacity: "0" }}>Wed</div>
                  {TIMESLOTIDS.map((t, Tindex) => (
                    <div
                      key={Tindex}
                      style={{
                        height: "20px",
                        userSelect: startDrag ? "none" : "text",
                      }}
                    >
                      {slotIDProcessing(t)}
                    </div>
                  ))}
                </DayColumn>
                <ScrollSyncPane>
                  <div
                    style={{
                      display: "flex",
                      columnGap: "2px",
                      overflowX: "auto",
                      maxWidth: "80%",
                    }}
                    onScroll={(e) => {
                      console.log(e.target);
                    }}
                  >
                    {DATERANGE.map((date, c_index) => (
                      <DayColumn key={c_index}>
                        <div style={{ userSelect: "none" }}>
                          {moment(date).format("MMM DD")}
                        </div>
                        <div style={{ userSelect: "none" }}>
                          {moment(date).format("ddd")}
                        </div>
                        {TIMESLOTIDS.slice(0, -1).map((_, r_index) => (
                          <Cell
                            key={r_index}
                            style={{
                              background: cell[c_index][r_index]
                                ? "#94C9CD"
                                : "#F0F0F0",
                            }}
                            onMouseDown={handleCellMouseDown([
                              c_index,
                              r_index,
                            ])}
                            onMouseEnter={handleCellMouseEnter([
                              c_index,
                              r_index,
                            ])}
                            onClick={handleCellClick([c_index, r_index])}
                          />
                        ))}
                      </DayColumn>
                    ))}
                  </div>
                </ScrollSyncPane>
              </div>
            </FormWrapper>
          </div>
        </div> */}
      </Base>
    </ScrollSync>
  );
};

export default Voting;
