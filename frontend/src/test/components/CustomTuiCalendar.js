import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";
import "@toast-ui/calendar/dist/toastui-calendar.min.css";
import Calendar from "@toast-ui/react-calendar";
import { Radio } from "antd";
import moment from "moment";
import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import "./styles.css";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import { RWD } from "../../constant";
const RoundButton = Button("round");
const Test = Modal("calendar");
const { RWDHeight, RWDWidth, RWDFontSize, RWDRadius } = RWD;
// import {} from

const CalendarContainer = styled.div`
  * {
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  margin-top: ${RWDHeight(15)};
  border: 2px solid #808080;
  border-radius: 10px;
  height: ${RWDHeight(780)};
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

const CustomTuiCalendar = ({ events }) => {
  const calendarInstRef = useRef(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [time, setTime] = useState(moment().format("YYYY MMMM"));
  const [mode, setMode] = useState("month");
  const [seeMorePosition, setSeeMorePosition] = useState({ left: 0, top: 0 });

  const EventTemplate = (event) => {
    if (mode === "month") {
      return <div style={{ color: event.color }}>{event.title}</div>;
    }
  };

  const [calendarOption, setCalendarOption] = useState({
    view: "month",
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
          {model.dayName}
        </div>
      ),
      timegridDisplayPrimaryTime: () => {
        return "";
      },
    },
  });

  // useEffect(() => {
  //   calendarInstRef.current = new TuiCalendar(tuiRef.current, {

  //     template: {
  //       allday: function (event) {
  //         return _getTimeTemplate(event, true);
  //       },
  //       alldayTitle: function () {
  //         return '<span class="tui-full-calendar-left-content">ALL DAY</span>';
  //       },
  //       time: function (event) {
  //         return _getTimeTemplate(event, false);
  //       },
  //       goingDuration: function (event) {
  //         return (
  //           '<span class="calendar-icon ic-travel-time"></span>' +
  //           event.goingDuration +
  //           "min."
  //         );
  //       },
  //       comingDuration: function (event) {
  //         return (
  //           '<span class="calendar-icon ic-travel-time"></span>' +
  //           event.comingDuration +
  //           "min."
  //         );
  //       },
  //       weekDayname: function (model) {
  //         return (
  //           '<span class="tui-full-calendar-dayname-date">' +
  //           model.date +
  //           '</span>&nbsp;&nbsp;<span class="tui-full-calendar-dayname-name">' +
  //           model.dayName +
  //           "</span>"
  //         );
  //       },
  //       weekGridFooterExceed: function (hiddenSchedules) {
  //         return "+" + hiddenSchedules;
  //       },
  //       dayGridTitle: function (viewName) {
  //         var title = "";
  //         switch (viewName) {
  //           case "allday":
  //             title =
  //               '<span class="tui-full-calendar-left-content">ALL DAY</span>';
  //             break;
  //           default:
  //             break;
  //         }

  //         return title;
  //       },
  //       collapseBtnTitle: function () {
  //         return '<span class="tui-full-calendar-icon tui-full-calendar-ic-arrow-solid-top"></span>';
  //       },
  //       timegridDisplayPrimayTime: function (time) {
  //         // will be deprecated. use 'timegridDisplayPrimaryTime'
  //         var meridiem = "am";
  //         var hour = time.hour;

  //         if (time.hour > 12) {
  //           meridiem = "pm";
  //           hour = time.hour - 12;
  //         }

  //         return hour + " " + meridiem;
  //       },
  //       timegridDisplayPrimaryTime: function (time) {
  //         var meridiem = "am";
  //         var hour = time.hour;

  //         if (time.hour > 12) {
  //           meridiem = "pm";
  //           hour = time.hour - 12;
  //         }

  //         return hour + " " + meridiem;
  //       },
  //       timegridCurrentTime: function (timezone) {
  //         var templates = [];

  //         if (timezone.dateDifference) {
  //           templates.push(
  //             "[" +
  //               timezone.dateDifferenceSign +
  //               timezone.dateDifference +
  //               "]<br>"
  //           );
  //         }

  //         templates.push(moment(timezone.hourmarker).format("HH:mm a"));

  //         return templates.join("");
  //       },
  //       titlePlaceholder: function () {
  //         return "Subject";
  //       },
  //       locationPlaceholder: function () {
  //         return "Location";
  //       },
  //     },
  //     week: {
  //       showNowIndicator: false,
  //     },
  //     events,
  //     ...rest,

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

  return (
    <>
      <MenuContainer>
        <MenuContainer.TimeOperationContainer>
          <RoundButton
            variant="text"
            buttonTheme="#D8D8D8"
            icon={<CaretLeftOutlined />}
            onClick={() => {
              setTime((prev) =>
                moment(prev, "YYYY MMMM")
                  .subtract(1, "months")
                  .format("YYYY MMMM")
              );
              calendarInstRef.current?.getInstance().prev();
            }}
          />
          <div>{time}</div>
          <RoundButton
            variant="text"
            buttonTheme="#D8D8D8"
            icon={<CaretRightOutlined />}
            onClick={() => {
              setTime((prev) =>
                moment(prev, "YYYY MMMM").add(1, "months").format("YYYY MMMM")
              );
              calendarInstRef.current?.getInstance().next();
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
    </>
  );
};

export default CustomTuiCalendar;
