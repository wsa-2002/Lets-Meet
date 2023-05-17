import React, { useEffect, useState, useRef } from "react";
import Base from "../components/Base/145MeetRelated";
import Moment from "moment";

import { extendMoment } from "moment-range";
import Link from "../components/Link";
import { useMeet } from "./hooks/useMeet";
import styled from "styled-components";
import { RWD, ANIME } from "../constant";
import { getCalendar, googleLogin } from "../middleware";
import {
  CaretLeftOutlined,
  CaretRightOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import "@toast-ui/calendar/dist/toastui-calendar.min.css";
import Calendar from "@toast-ui/react-calendar";
import { Radio } from "antd";
import Button from "../components/Button";
import Modal from "../components/Modal";
const RoundButton = Button("round");
const Test = Modal("calendar");
const moment = extendMoment(Moment);
const { RWDHeight, RWDWidth, RWDFontSize, RWDRadius } = RWD;
// import {} from

const Floating = styled.div`
  ${ANIME.Float}
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
  border-radius: 10px;
  height: ${RWDHeight(780)};
  width: 100%;
  .toastui-calendar-day-names.toastui-calendar-month,
  .toastui-calendar-day-names.toastui-calendar-week {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
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
    button {
      margin-top: ${RWDHeight(6)};
      margin-bottom: ${RWDHeight(10)};
      text-align: left !important;
      padding: 0 !important;
      &:hover,
      &:active,
      &:focus {
        background-color: #f0f0f0;
        border-radius: 5px !important;
      }
    }
    .toastui-calendar-grid-cell-date {
      display: none;
    }
  }
  .toastui-calendar-weekday-event {
    margin: 0 !important;
    border-radius: 5px !important;
    .toastui-calendar-weekday-event-title {
      overflow: auto !important;
    }
  }
  .toastui-calendar-see-more-header {
  }
  .toastui-calendar-see-more-container {
    left: ${({ seeMorePosition: { left } }) =>
      `calc(${left}px - 10vw - calc(26.7vw / 3))`};
    top: ${({ seeMorePosition: { top } }) =>
      `calc(${top}px - 7.5vh - ${RWDHeight(60)})`} !important;
    .toastui-calendar-see-more {
      border: none !important;
      padding: 0 !important;
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
  .toastui-calendar-week-view {
    .toastui-calendar-week-view-day-names {
      border-bottom: none !important;
      box-sizing: content-box !important;
    }
    .toastui-calendar-panel-resizer {
      display: none;
    }
  }

  .mymore {
    width: calc(${RWDWidth(1260)} / 7 - 16px);
    border-radius: ${RWDRadius(5)} !important;
    padding-left: 3px;
  }
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
  const { login, cookies } = useMeet();
  const [events, setEvents] = useState([]);

  const calendarInstRef = useRef(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [month, setMonth] = useState(moment().format("YYYY MMMM"));
  const [timeRange, setTimeRange] = useState([]);
  const [mode, setMode] = useState("month");
  const [seeMorePosition, setSeeMorePosition] = useState({ left: 0, top: 0 });

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
    setTimeRange([start_date, end_date]);
  };

  const EventTemplate = (event) => {
    if (mode === "month") {
      return <div style={{ color: event.color }}>{event.title}</div>;
    }
  };
  const [calendarOption, setCalendarOption] = useState({
    view: "month",
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
              const { left, top } = e.target.getBoundingClientRect();
              console.log(left, top);
              setSeeMorePosition({
                left,
                top,
              });
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
      time: (event) => {
        return EventTemplate(event);
      },
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
      timegridDisplayPrimaryTime: () => {
        return "";
      },
    },
  });

  useEffect(() => {
    TimeProcessing();
  }, [calendarOption.view]);

  const handleEventClick = (e) => {
    console.log(e.event);
    setDetailOpen(true);
  };
  useEffect(() => {
    if (calendarInstRef.current) {
      calendarInstRef.current?.getInstance().on("clickEvent", handleEventClick);
      return () => {
        calendarInstRef.current
          ?.getInstance()
          .off("clickEvent", handleEventClick);
      };
    }
  }, [calendarInstRef.current]);

  const handleGetEvent = (start_date, end_date) => async () => {
    return await getCalendar({ start_date, end_date }, cookies.token);
  };

  useEffect(() => {
    (async () => {
      if (login && timeRange.length) {
        const { data } = await handleGetEvent(timeRange[0], timeRange[1])();
        console.log(data);
      }
    })();
  }, [login, timeRange]);

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
                setCalendarOption((prev) => ({
                  ...prev,
                  view: e.target.value,
                }));
              }}
              value={mode}
            >
              <Radio value={"week"}>Week</Radio>
              <Radio value={"month"}>Month</Radio>
            </Radio.Group>
          </MenuContainer>
          <CalendarContainer seeMorePosition={seeMorePosition}>
            <Calendar
              ref={calendarInstRef}
              height="100%"
              {...calendarOption}
              events={[
                {
                  id: "1",
                  calendarId: "cal1",
                  title: "SDM Meeting",
                  body: "TOAST UI Calendar",
                  start: "2023-05-26T10:00:00",
                  end: "2023-05-26T11:00:00",
                  location: "Meeting Room A",
                  attendees: ["A", "B", "C"],
                  category: "allday",
                  state: "Free",
                  isReadOnly: true,
                  color: "#935000",
                  borderColor: "none",
                  backgroundColor: "transparent",
                  customStyle: {
                    borderLeft: "none",
                    fontSize: RWDFontSize(12),
                    fontWeight: 500,
                    border: "1px solid #B39559",
                    marginLeft: "8px",
                    marginRight: "8px",
                    // width: `calc(${RWDWidth(1260)} / 7 - 16px)`,
                    borderRadius: "5px",
                    backgroundColor: "#FFD466",
                  },
                },
              ].concat(
                ...new Array(6).fill({
                  id: "1",
                  calendarId: "cal1",
                  title: "SDM Meeting",
                  body: "TOAST UI Calendar",
                  start: "2023-05-26T10:00:00",
                  end: "2023-05-26T11:00:00",
                  location: "Meeting Room A",
                  attendees: ["A", "B", "C"],
                  category: "time",
                  state: "Free",
                  isReadOnly: true,
                  color: "#935000",
                  borderColor: "none",
                  backgroundColor: "transparent",
                  customStyle: {
                    borderLeft: "none",
                    fontSize: RWDFontSize(12),
                    fontWeight: 500,
                    border: "1px solid #B39559",
                    marginLeft: "8px",
                    marginRight: "8px",
                    marginTop: RWDHeight(6),
                    // width: `calc(${RWDWidth(1260)} / 7 - 16px)`,
                    borderRadius: "5px",
                    backgroundColor: "#FFD466",
                  },
                })
              )}
            />
            <Test open={detailOpen} setOpen={setDetailOpen}></Test>
          </CalendarContainer>
          <Link
            linkTheme="#DB8600"
            onClick={() => {
              googleLogin();
            }}
          >
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
          </Link>
        </ContentContainer>
      </Base.FullContainer>
    </Base>
  );
};
