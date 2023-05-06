/*TODO:********************************************************************************************
  1. RWD, 版面縮小到一定程度時兩個 component 會重疊。  
**************************************************************************************************/
import { motion } from "framer-motion";
import _ from "lodash";
import Moment from "moment";
import { extendMoment } from "moment-range";
import { useState, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";
import { useMeet } from "./hooks/useMeet";
import { RWD, COLORS, PAGE_TRANSITION } from "../constant";
import Base from "../components/Base/145MeetRelated";
import Button from "../components/Button";
import TimeCell, { slotIDProcessing } from "../components/TimeCell";
import {
  getGroupAvailability,
  getMyAvailability,
  addMyAvailability,
  deleteMyAvailability,
  meet,
  getRoutine,
} from "../middleware";
const getMeetInfo = meet("read");
const BackButton = Button("back");
const { ContentContainer } = Base.FullContainer;
const {
  GroupAvailability: {
    VotingContainer: {
      DayContainer: { CellHoverContainer },
    },
  },
} = ContentContainer;
const { RWDWidth } = RWD;
const DraggableCell = TimeCell("draggable");
const InfoCell = TimeCell("info");
const moment = extendMoment(Moment);

const Voting = () => {
  const [title, setTitle] = useState("");
  const [DATERANGE, setDATERANGE] = useState([]);
  const [TIMESLOTIDS, setTIMESLOTIDS] = useState([]);
  const [VOTINGINFO, setVOTINGINFO] = useState([]);
  const [CELLCOLOR, setCELLCOLOR] = useState([]);
  const [ROUTINE, setROUTINE] = useState("");

  /*調整 time gap 套組*/
  const WeekdayRef = useRef(null); //追蹤天數高度
  const TimeCellRef = useRef(null); //追蹤 TimeCell 高度
  const TimeRef = useRef(null);
  const [timeTop, setTimeTop] = useState(0);
  /******************************************************/

  /*可拖曳 time cell 套組*/
  const [cell, setCell] = useState([]);
  const [block, setBlock] = useState(false);
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
    block,
    setBlock,
    setStartIndex,
    mode,
    setMode,
    setUpdatedCell,
    oriCell,
    setVOTINGINFO,
  };
  /******************************************************/

  const { code } = useParams();
  const { cookies, login, setLoading } = useMeet();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleMeetInfo = async () => {
    try {
      setLoading(true);
      const { data: votingData } = await getGroupAvailability(
        code,
        cookies.token
      );
      setVOTINGINFO(votingData.data);

      if (cookies.token) {
        const { data: routine } = await getRoutine(undefined, cookies.token);
        setROUTINE(routine);
      } else {
        setROUTINE([]);
      }

      const { data } = await getMeetInfo(code, cookies.token);
      setTitle(data.meet_name);
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
          cookies.token,
          location?.state?.guestName
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
        setLoading(false);
      }
    })();
  }, [DATERANGE, TIMESLOTIDS]);

  useEffect(() => {
    (async () => {
      if (code) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        handleMeetInfo();
      }
    })();
  }, [code]);

  useEffect(() => {
    if (VOTINGINFO.length) {
      const allMembersNum =
        VOTINGINFO?.[0]?.available_members.length +
        VOTINGINFO?.[0]?.unavailable_members.length;
      const gap =
        Math.floor(allMembersNum / 5) < 1 ? 1 : Math.floor(allMembersNum / 5);
      setCELLCOLOR(
        VOTINGINFO.map(
          (v) => COLORS.orange[Math.ceil(v.available_members.length / gap)]
        )
      );
    }
  }, [VOTINGINFO]); //設定 time cell 顏色

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
      const { data: votingData } = await getGroupAvailability(
        code,
        cookies.token
      );
      setVOTINGINFO(votingData.data);
    } catch (error) {
      throw error;
    } finally {
      setUpdatedCell("");
    }
  };
  return (
    <ScrollSync>
      <motion.div {...PAGE_TRANSITION.RightSlideIn}>
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
                  {title}
                </ContentContainer.Title>
                <ContentContainer.MyAvailability>
                  {t("myAva")}
                </ContentContainer.MyAvailability>
                <ContentContainer.GroupAvailability>
                  {t("groupAva")}
                </ContentContainer.GroupAvailability>
                <ContentContainer.MyAvailability.VotingArea>
                  {" "}
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
                    <ScrollSyncPane>
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
                              <div
                                style={{
                                  userSelect: "none",
                                  fontWeight: "700",
                                }}
                              >
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
                    </ScrollSyncPane>
                  </ContentContainer.MyAvailability.VotingContainer>
                </ContentContainer.MyAvailability.VotingArea>
                <ContentContainer.MyAvailability.VotingArea
                  style={{ gridColumn: "2/3" }}
                >
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
                    <ScrollSyncPane>
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
                              <div
                                style={{
                                  userSelect: "none",
                                  fontWeight: "700",
                                }}
                              >
                                {moment(m).format("ddd")}
                              </div>
                            </div>
                            {TIMESLOTIDS.map(
                              (_, t_index) =>
                                t_index !== TIMESLOTIDS.length - 1 && (
                                  <InfoCell
                                    key={t_index}
                                    style={{
                                      backgroundColor:
                                        CELLCOLOR[
                                          d_index * (TIMESLOTIDS.length - 1) +
                                            t_index
                                        ],
                                    }}
                                    info={
                                      <CellHoverContainer>
                                        <CellHoverContainer.CellHoverInfo>
                                          <div
                                            style={{
                                              fontWeight: "bold",
                                              textDecoration: "underline",
                                            }}
                                          >
                                            Availble
                                          </div>
                                          {VOTINGINFO?.[
                                            d_index * (TIMESLOTIDS.length - 1) +
                                              t_index
                                          ]?.available_members.map(
                                            (m, index) => (
                                              <div key={index}>{m}</div>
                                            )
                                          )}
                                        </CellHoverContainer.CellHoverInfo>
                                        <CellHoverContainer.CellHoverInfo>
                                          <div
                                            style={{
                                              fontWeight: "bold",
                                              textDecoration: "underline",
                                            }}
                                          >
                                            Unavailble
                                          </div>
                                          {VOTINGINFO?.[
                                            d_index * (TIMESLOTIDS.length - 1) +
                                              t_index
                                          ]?.unavailable_members.map(
                                            (m, index) => (
                                              <div key={index}>{m}</div>
                                            )
                                          )}
                                        </CellHoverContainer.CellHoverInfo>
                                      </CellHoverContainer>
                                    }
                                  />
                                )
                            )}
                          </ContentContainer.MyAvailability.VotingContainer.CellsContainer.DayColumn>
                        ))}
                      </ContentContainer.MyAvailability.VotingContainer.CellsContainer>
                    </ScrollSyncPane>
                  </ContentContainer.MyAvailability.VotingContainer>
                </ContentContainer.MyAvailability.VotingArea>
              </Base.FullContainer.ContentContainer>
            )}
          </Base.FullContainer>
        </Base>
      </motion.div>
    </ScrollSync>
  );
};

export default Voting;
