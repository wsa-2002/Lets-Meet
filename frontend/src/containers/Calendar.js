import {
  CopyOutlined,
  CaretLeftOutlined,
  CaretRightOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import "@toast-ui/calendar/dist/toastui-calendar.min.css";
import Calendar from "@toast-ui/react-calendar";
import { Tooltip } from "antd";
import _ from "lodash";
import Moment from "moment";
import { extendMoment } from "moment-range";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useMeet } from "./hooks/useMeet";
import { RWD, ANIME } from "../constant";
import Base from "../components/Base/145MeetRelated";
import Link from "../components/Link";
import Tag from "../components/Tag";
import slotIDProcessing from "../util/slotIDProcessing";
import { Radio } from "antd";
import Button from "../components/Button";
import Modal from "../components/Modal";
const RoundButton = Button("round");
const moment = extendMoment(Moment);
const CalendarModal = Modal("calendar");
const { RWDHeight, RWDWidth, RWDFontSize, RWDRadius } = RWD;
const MemberTag = Tag("member");

function hexToRgbA(hex) {
  var c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = "0x" + c.join("");
    return (
      "rgba(" + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") + ",0.2)"
    );
  }
  throw new Error("Bad Hex");
}

const Floating = styled.div`
  ${ANIME.Float}
`;

const FadeIn = styled.div`
  ${ANIME.FadeIn}
`;

const ContentContainer = styled.div`
  position: relative;
  height: ${RWDHeight(840)};
  width: ${RWDWidth(1260)};
  left: calc(25vw / 3);
  margin-top: ${RWDHeight(60)};
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  row-gap: ${RWDHeight(15)};
`;

const CalendarContainer = styled.div`
  * {
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  border: 2px solid #808080;
  border-radius: ${RWDRadius(10)};
  height: ${RWDHeight(780)};
  width: 100%;
  .toastui-calendar-layout.toastui-calendar-month,
  .toastui-calendar-floating-layer {
    .toastui-calendar-weekday-event-dot {
      display: none;
    }
    .toastui-calendar-weekday-events {
      top: ${RWDHeight(10)} !important;
    }

    .toastui-calendar-see-more-container {
      left: ${({ seeMorePosition: { left } }) =>
        `calc(${left}px - 10vw - calc(25vw / 3))`};
      top: ${({ seeMorePosition: { top } }) =>
        `calc(${top}px - 7.5vh - ${RWDHeight(60)})`} !important;
      .toastui-calendar-see-more {
        border-radius: ${RWDRadius(10)};
        .toastui-calendar-see-more-header {
          height: fit-content !important;
          margin-bottom: ${RWDHeight(20)} !important;
          background-color: transparent !important;
        }
        .toastui-calendar-month-more-list {
          padding: 0 !important;
          padding-bottom: ${RWDHeight(16)} !important;
          max-height: ${RWDHeight(100)};
        }
      }
    }
  }
  .toastui-calendar-day-names.toastui-calendar-month,
  .toastui-calendar-day-names.toastui-calendar-week {
    border-top-left-radius: ${RWDRadius(10)};
    border-top-right-radius: ${RWDRadius(10)};
    padding: 0;
  }
  .toastui-calendar-grid-cell-header {
    display: flex;
    justify-content: flex-end;
    padding-right: ${RWDWidth(20)};
    padding-top: ${RWDHeight(5)};
    .toastui-calendar-grid-cell-more-events {
      display: none;
    }
  }
  .toastui-calendar-grid-cell-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    * {
      line-height: normal !important;
    }
    button {
      //see more button
      width: 100%;
      height: fit-content !important;
      margin: ${RWDHeight(6)} 8px ${RWDHeight(10)} 8px;
      text-align: left !important;
      padding: 0 !important;
      &:hover,
      &:active,
      &:focus {
        background-color: #f0f0f0;
        border-radius: ${RWDRadius(5)} !important;
      }
      .mymore {
        padding: 0 ${RWDWidth(12)};
      }
    }
    .toastui-calendar-grid-cell-date {
      //月份底部會有時間，取消才能將 see more 放置對的位置
      display: none;
    }
  }

  .toastui-calendar-week-view {
    .toastui-calendar-week-view-day-names {
      border-bottom: none !important;
      box-sizing: content-box !important;
    }
    .toastui-calendar-panel-resizer {
      display: none;
    }
    .toastui-calendar-events {
      margin-left: 8px;
      .toastui-calendar-event-time {
        /* height: fit-content !important; */
        background-color: transparent !important;
        border-left: none !important;
        .toastui-calendar-event-time-content {
          padding: 0 !important;
          overflow-y: auto !important;
          border-radius: ${RWDRadius(5)};
        }
      }
    }
    .toastui-calendar-panel-allday-events {
      .toastui-calendar-weekday-event {
        margin: 0 !important;
        border-radius: 0 !important;
      }
    }
  }

  /*common style*/
  .toastui-calendar-weekday-event {
    height: fit-content !important;
    border: none !important;
    line-height: normal !important;
    background-color: transparent !important;
    .toastui-calendar-weekday-event-title {
      overflow: auto !important;
      padding: 0;
    }
  }
  /******************************************************/
`;

const MenuContainer = Object.assign(
  styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  {
    TimeOperationContainer: styled.div`
      display: flex;
      column-gap: ${RWDWidth(20)};
      align-items: center;
      font-size: ${RWDFontSize(24)};
      button {
        font-size: ${RWDFontSize(28)};
      }
    `,
  }
);

export default () => {
  const navigate = useNavigate();
  const { login, loading, setLoading, MIDDLEWARE } = useMeet();
  const { getCalendar, googleLogin, getGoogleCalendar, getMeetInfo } =
    MIDDLEWARE;

  const [initial, setInitial] = useState(true);
  const calendarInstRef = useRef(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [mode, setMode] = useState("week"); //month or week
  const [month, setMonth] = useState(moment().format("YYYY MMMM")); //標題月份
  const [timeRange, setTimeRange] = useState([]); //整個日曆的範圍
  const [key, setKey] = useState(0);

  /*resize seeMore 套組*/
  const [seeMorePosition, setSeeMorePosition] = useState({ left: 0, top: 0 });
  const [seeMoreMode, setSeeMoreMode] = useState(false);
  const seeMoreRef = useRef(null);

  const throttledHandleResize = _.throttle(() => {
    if (seeMoreRef?.current) {
      const { left, top } = seeMoreRef.current.getBoundingClientRect();
      setSeeMorePosition({
        left,
        top,
      });
    }
    setKey((prev) => prev + 1);
  }, 100);

  useEffect(() => {
    window.addEventListener("resize", throttledHandleResize);
    return () => {
      window.removeEventListener("resize", throttledHandleResize);
    };
  }, []); //resize 時 see more 改變位置

  const handleCloseSeeMore = (e) => {
    if (
      seeMoreMode &&
      document.querySelector(".toastui-calendar-see-more-container")
    ) {
      if (
        (!document
          .querySelector(".toastui-calendar-see-more-container")
          ?.contains(e.target) &&
          !document
            .querySelector(".ant-modal-wrap.ant-modal-centered")
            ?.contains(e.target) &&
          document
            .querySelector(".toastui-calendar-popup-overlay")
            ?.contains(e.target)) ||
        document
          .querySelector(".toastui-calendar-template-monthMoreClose")
          .contains(e.target)
      ) {
        setSeeMoreMode(false);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleCloseSeeMore, { capture: true });
    return () => {
      document.removeEventListener("click", handleCloseSeeMore, {
        capture: true,
      });
    };
  }, [seeMoreMode]); // 取消 see more mode
  /******************************************************/

  const TimeProcessing = () => {
    const start_date = moment(
      calendarInstRef.current.getInstance().getDateRangeStart().d.d
    ).format("YYYY-MM-DD");
    const end_date = moment(
      calendarInstRef.current.getInstance().getDateRangeEnd().d.d
    ).format("YYYY-MM-DD");
    if (mode === "month") {
      setMonth(
        [
          ...moment
            .range(
              moment(start_date, "YYYY-MM-DD"),
              moment(end_date, "YYYY-MM-DD")
            )
            .by("day"),
        ][10].format("YYYY MMMM")
      );
    } else {
      if (
        moment(start_date, "YYYY-MM-DD").format("MMMM") ===
        moment(end_date, "YYYY-MM-DD").format("MMMM")
      ) {
        setMonth(`${moment(start_date, "YYYY-MM-DD").format("YYYY MMMM")}`);
      } else {
        setMonth(
          `${moment(start_date, "YYYY-MM-DD").format("YYYY MMMM")} / ${moment(
            end_date,
            "YYYY-MM-DD"
          ).format("MMMM")}`
        );
      }
    }
    setTimeRange((prev) =>
      prev[0] ===
        moment(start_date)
          // .subtract(2, "months")
          .format("YYYY-MM-DD") &&
      prev[1] ===
        moment(end_date)
          // .add(2, "months")
          .format("YYYY-MM-DD")
        ? prev
        : [
            moment(start_date)
              // .subtract(2, "months")
              .format("YYYY-MM-DD"),
            moment(end_date)
              // .add(2, "months")
              .format("YYYY-MM-DD"),
          ]
    );
  };

  const EventTemplate = (event) => {
    //.toastui-calendar-template-time
    let style = {
      height: "100%",
      fontSize: RWDFontSize(12),
      fontWeight: 500,
      borderRadius: RWDRadius(5),
      display: "flex",
      flexDirection: "column",
    };
    if (!event.raw.isGoogle) {
      style = {
        ...style,
        color: "#935000",
        backgroundColor: "#FFD466",
        border: "1px solid #B39559",
      };
    } else {
      style = {
        ...style,
        color: event.color,
        backgroundColor: hexToRgbA(event.color),
        cursor: "default",
      };
    }
    if (mode === "month") {
      style = {
        ...style,
        padding: `${RWDHeight(2)} ${RWDWidth(12)}`,
        width: "fit-content",
        minWidth: "100%",
      };
      return <div style={style}>{event.title}</div>;
    } else {
      style = {
        ...style,
        padding: `${RWDHeight(2)} ${RWDWidth(12)}`,
        whiteSpace: "pre-wrap",
        wordWrap: "break-word",
        height: "fit-content",
        minHeight: "100%",
      };
      if (event.category === "time") {
        return (
          <div style={style}>
            {`${event.title}\n${moment(new Date(event.start)).format(
              "HH:mm"
            )} - ${moment(new Date(event.end)).format("HH:mm")}`}
          </div>
        );
      } else {
        return (
          <div style={{ ...style, borderRadius: 0 }}>
            {event.title}
            {/* {`${event.title} ${moment(event.start).format("HH:mm")}`} */}
          </div>
        );
      }
    }
  };

  const calendarOption = useMemo(
    () => ({
      view: mode,
      isReadOnly: true,
      theme: {
        common: {
          backgroundColor: "transparent",
        },
        month: {
          dayName: {
            borderLeft: "none",
            backgroundColor: "#FDF3D1",
          },
          gridCell: {
            headerHeight: 30,
            footerHeight: 30,
          },
          moreView: {
            border: "1px solid grey",
            boxShadow: "0 2px 6px 0 grey",
            backgroundColor: "white",
            width: `calc(${RWDWidth(1260)} / 7)`,
            height: "fit-content",
          },
        },
        week: {
          timeGridHourLine: {
            borderBottom: "none",
          },
          dayName: {
            borderLeft: "none",
            borderTop: "none",
            borderBottom: "none",
            backgroundColor: "#FDF3D1",
          },
          panelResizer: {
            border: "none",
          },
          today: { backgroundColor: "transparent" },
        },
      },
      gridSelection: false,
      month: {
        isAlways6Weeks: false,
        visibleEventCount: 5,
      },
      week: {
        taskView: false,
        showNowIndicator: false,
      },
      events,
      template: {
        monthGridHeaderExceed: () => <div></div>,
        monthGridFooterExceed: function (hiddenSchedules) {
          return (
            <div
              className="mymore"
              onMouseEnter={(e) => {
                if (!seeMoreMode) {
                  const { left, top } =
                    e.target.parentNode.parentNode.parentNode.getBoundingClientRect();
                  setSeeMorePosition({
                    left,
                    top,
                  });
                  seeMoreRef.current =
                    e.target.parentNode.parentNode.parentNode;
                }
              }}
            >
              {hiddenSchedules} more
            </div>
          );
        },
        monthMoreTitleDate: () => <div></div>,
        monthMoreClose: () => <div>&times;</div>,
        monthDayName: (model) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#575757",
            }}
          >
            {model.label}
          </div>
        ),
        monthGridHeader(model) {
          let format = "D";
          const date = parseInt(model.date.split("-")[2], 10);
          if (date === 1) {
            format = "MMM D";
          }

          return (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                fontSize: RWDFontSize(16),
                color: model.isToday ? "#935000" : "#808080",
                fontWeight: model.isToday ? 800 : "normal",
              }}
            >
              {moment(model.date).format(format)}
            </div>
          );
        },
        time: EventTemplate,
        allday: EventTemplate,
        weekDayName: (model) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#575757",
            }}
          >
            {model.dayName + " " + model.date}
          </div>
        ),
        // timegridDisplayPrimaryTime: () => {
        //   return "";
        // },
      },
    }),
    [mode, events]
  );

  /*meet info 套組*/
  const [elementMeetInfo, setElementMeetInfo] = useState({
    "Meet Name": "",
    "Start / End Date": "",
    "Start / End Time": "",
    Host: "",
    Member: "",
    Description: "",
    "Voting Deadline": "",
    "Invitation URL": "",
    "Google Meet URL": "",
  }); //非編輯模式下的資料
  const [copy, setCopy] = useState(false); //非編輯模式下複製 invite code
  const [code, setCode] = useState("");
  const handleEventClick = async (e) => {
    if (e.event.raw.isGoogle) {
      return;
    }
    const {
      data: {
        meet_name,
        finalized_start_date,
        finalized_start_time_slot_id,
        host_info,
        member_infos,
        description,
        invite_code,
        meet_url,
      },
    } = await getMeetInfo(e.event.raw.invite_code);
    setCode(e.event.raw.invite_code);
    setElementMeetInfo({
      "Meet Time":
        `${finalized_start_date} ` +
        slotIDProcessing(finalized_start_time_slot_id),
      "Meet Name": meet_name,

      Host: (
        <MemberTag style={{ fontSize: RWDFontSize(16) }}>
          {host_info?.name}
        </MemberTag>
      ),
      Member: member_infos.length ? (
        <div
          style={{
            display: "flex",
            gap: `${RWDFontSize(8)} ${RWDFontSize(8)}`,
            flexWrap: "wrap",
            width: RWDWidth(590),
            alignContent: "flex-start",
          }}
        >
          {member_infos.map((m, index) => (
            <MemberTag key={index}>{m.name}</MemberTag>
          ))}
        </div>
      ) : (
        "None"
      ),
      Description: description ? description : "None",
      "Invitation URL": (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            columnGap: RWDWidth(8),
          }}
        >
          <div>
            {process.env.REACT_APP_SERVER_USE_HTTPS === "true"
              ? "https"
              : "http"}
            ://{process.env.REACT_APP_SERVER_DOMAIN}/meets/{invite_code}
          </div>
          <CopyToClipboard
            text={`${
              process.env.REACT_APP_SERVER_USE_HTTPS === "true"
                ? "https"
                : "http"
            }://${process.env.REACT_APP_SERVER_DOMAIN}/meets/${invite_code}`}
          >
            <Tooltip title="copy to clipboard" open={copy}>
              <RoundButton
                variant="text"
                buttonTheme="#D8D8D8"
                icon={<CopyOutlined />}
                onClick={() => {
                  setCopy(true);
                }}
              />
            </Tooltip>
          </CopyToClipboard>
        </div>
      ),
      "Google Meet URL": meet_url ? (
        <a
          target="_blank"
          href={meet_url}
          style={{ color: "#000000", textDecoration: "underline" }}
          rel="noreferrer"
        >
          {meet_url}
        </a>
      ) : (
        "None"
      ),
    });
    setDetailOpen(true);
  };
  /******************************************************/

  /*get calendar events 套組*/ //每更新一次 date range 會敲一次
  useEffect(() => {
    setKey((prev) => prev + 1);
  }, [mode]);

  useEffect(() => {
    if (timeRange.length) {
      calendarInstRef.current?.getInstance().setDate(new Date(timeRange[0]));
    }
    TimeProcessing();
  }, [key]);

  useEffect(() => {
    (async () => {
      if (login && timeRange.length) {
        if (initial) {
          setLoading(true);
          setInitial(false);
        }
        try {
          const { data: normalEvent } = await getCalendar({
            start_date: timeRange[0],
            end_date: timeRange[1],
          });
          let temp = normalEvent.map((e, id) => ({
            id,
            title: e.title,
            start: moment(
              `${e.start_date} ` + slotIDProcessing(e.start_time_slot_id),
              "YYYY-MM-DD HH:mm"
            ),
            end: moment(
              `${e.end_date} ` +
                slotIDProcessing(
                  // e.end_time_slot_id + 1
                  48
                ),
              "YYYY-MM-DD HH:mm"
            ),
            category:
              e.start_time_slot_id === 1 && e.end_time_slot_id === 48
                ? "allday"
                : "time",
            isReadOnly: true,
            raw: { ...e, isGoogle: false },
          }));
          if (login === "google") {
            const { data: googleEvent } = await getGoogleCalendar({
              start_date: timeRange[0],
              end_date: timeRange[1],
            });
            temp = [
              ...temp,
              ...googleEvent.map((e, id) => ({
                id: id + temp.length,
                title: e.title,
                start: moment(e.start_date),
                end: moment(e.end_date),
                category: "time",
                isReadOnly: true,
                color: e.color,
                raw: { ...e, isGoogle: true },
              })),
            ];
          }
          setEvents(temp);
          setLoading(false);
        } catch (error) {
          throw error;
        }
      }
      if (!login) {
        navigate("/");
      }
    })();
  }, [login, timeRange]);
  /******************************************************/

  useEffect(() => {
    const url = `${
      process.env.REACT_APP_SERVER_USE_HTTPS === "true" ? "https" : "http"
    }://${process.env.REACT_APP_SERVER_DOMAIN}/meets/${code}`;
    setElementMeetInfo((prev) => ({
      ...prev,
      "Invitation URL": (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            columnGap: RWDWidth(8),
          }}
        >
          <div>{url}</div>
          <CopyToClipboard text={url}>
            <Tooltip title="copy to clipboard" open={copy}>
              <RoundButton
                variant="text"
                buttonTheme="#D8D8D8"
                icon={<CopyOutlined />}
                onClick={() => {
                  setCopy(true);
                }}
              />
            </Tooltip>
          </CopyToClipboard>
        </div>
      ),
    }));
    if (copy) {
      const timer = setTimeout(() => {
        setCopy(false);
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    }
  }, [copy]); //copy 轉換時重新設定非編輯模式下的資料

  return (
    <Base login={login}>
      <Base.FullContainer>
        <ContentContainer>
          <MenuContainer>
            <MenuContainer.TimeOperationContainer>
              <RoundButton
                variant="text"
                buttonTheme="#D8D8D8"
                icon={<CaretLeftOutlined />}
                onClick={() => {
                  calendarInstRef.current?.getInstance().prev();
                  TimeProcessing();
                }}
              />
              <div>{month}</div>
              <RoundButton
                variant="text"
                buttonTheme="#D8D8D8"
                icon={<CaretRightOutlined />}
                onClick={() => {
                  calendarInstRef.current?.getInstance().next();
                  TimeProcessing();
                }}
              />
            </MenuContainer.TimeOperationContainer>

            <Radio.Group
              onChange={(e) => {
                setMode(e.target.value);
              }}
              value={mode}
            >
              <Radio value={"week"}>Week</Radio>
              <Radio value={"month"}>Month</Radio>
            </Radio.Group>
          </MenuContainer>
          <CalendarContainer seeMorePosition={seeMorePosition}>
            <Calendar
              key={String(key)}
              ref={calendarInstRef}
              height="100%"
              {...calendarOption}
              onClickEvent={handleEventClick}
              onClickMoreEventsBtn={() => {
                setSeeMoreMode(true);
              }}
            />
            <CalendarModal
              open={detailOpen}
              setOpen={setDetailOpen}
              elementMeetInfo={elementMeetInfo}
              onOk={() => {
                navigate(`/meets/${code}`);
              }}
            />
          </CalendarContainer>
          {!loading && (
            <Link
              linkTheme={login === "google" ? "#5C9B6B" : "#DB8600"}
              onClick={() => {
                if (login !== "google") {
                  googleLogin();
                }
              }}
              style={{
                cursor: login === "google" ? "default" : "pointer",
              }}
            >
              {login === "google" ? (
                <FadeIn
                  style={{
                    fontSize: RWDFontSize(12),
                    display: "flex",
                    columnGap: RWDWidth(6),
                    alignItems: "center",
                  }}
                >
                  <div>Linked to Google Calendar</div>
                  <CheckCircleOutlined />
                </FadeIn>
              ) : (
                <Floating
                  style={{
                    fontSize: RWDFontSize(12),
                    display: "flex",
                    columnGap: RWDWidth(6),
                    alignItems: "center",
                  }}
                >
                  <div>Link to Google Calendar</div>
                  <InfoCircleOutlined />
                </Floating>
              )}
            </Link>
          )}
        </ContentContainer>
      </Base.FullContainer>
    </Base>
  );
};
