import { InfoCircleOutlined } from "@ant-design/icons";
import {
  Input as AntdInput,
  DatePicker,
  TimePicker,
  Switch,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { range } from "lodash";
import React, { useState, Fragment } from "react";
import { useTranslation } from "react-i18next";
import styled, { css } from "styled-components";
import Member from "./Member";
import Input from "../Input";
import { RWD } from "../../constant";
import slotIDProcessing from "../../util/slotIDProcessing";
const ThinnerInput = Input("thinner");
const { RWDWidth, RWDHeight, RWDFontSize, RWDRadius } = RWD;

const CONFIRM_INEDITABLE = [
  "Start / End Date",
  "Start / End Time",
  "Voting Deadline",
];

const RangeStyle = css`
  width: ${RWDWidth(350)};
  height: ${RWDHeight(32)};
  font-size: ${RWDFontSize(14)};
  border: ${RWDRadius(1)} solid #808080;
`;

const PickerStyle = css`
  width: ${RWDWidth(150)};
  height: ${RWDHeight(32)};
  font-size: ${RWDFontSize(14)};
`;

const TextAreaStyle = css`
  width: ${RWDWidth(400)};
  height: ${RWDHeight(106)};
  border: ${RWDRadius(1)} solid #808080;
  border-radius: ${RWDFontSize(15)};
`;

const MeetInfoContainer = Object.assign(
  styled.div`
    display: grid;
    grid-template-columns: repeat(2, max-content);
    grid-template-rows: repeat(7, max-content);
    grid-column-gap: ${({ columnGap }) => RWDWidth(columnGap)};
    grid-row-gap: ${({ rowGap }) => RWDHeight(rowGap)};
  `,
  {
    Content: Object.assign(
      styled.div`
        display: flex;
        align-items: center;
        font-size: ${RWDFontSize(20)};
        font-weight: bold;
      `,
      {
        DateRangePicker: styled(DatePicker.RangePicker)`
          ${RangeStyle}
        `,
        TimeRangePicker: styled(TimePicker.RangePicker)`
          ${RangeStyle}
        `,
        TextArea: styled(AntdInput.TextArea)`
          ${TextAreaStyle}
        `,
        DatePicker: styled(DatePicker)`
          ${PickerStyle}
        `,
        TimePicker: styled(TimePicker)`
          ${PickerStyle}
        `,
      }
    ),
  }
);

/**
 * @example
 * const CreateMeet = styled.div`
    display: grid;
    grid-template-columns: repeat(2, max-content);
    grid-template-rows: repeat(8, max-content);
    `;
*/
const MeetInfo = ({
  columnGap,
  rowGap,
  handleMeetDataChange,
  login,
  setMeetData,
  ElementMeetInfo,
  rawMeetInfo,
  reviseMode = true,
  confirmed = false,
  member,
  ...prop
}) => {
  const { t } = useTranslation();

  const [votingddl, setVotingddl] = useState(
    rawMeetInfo.voting_end_time ? true : false
  );
  const CONTENTMENU = {
    "Meet Name": (
      <ThinnerInput
        onChange={handleMeetDataChange((i) => i.target.value, "meet_name")}
        data-required={true}
        value={rawMeetInfo.meet_name}
      />
    ),
    "Start / End Date": (
      <MeetInfoContainer.Content.DateRangePicker
        placeholder={[t("startDate"), t("endDate")]}
        onChange={handleMeetDataChange(
          (i) => moment(i.toISOString()).format("YYYY-MM-DD"),
          "start_date",
          "end_date"
        )}
        data-required={true}
        // value={[undefined, undefined]}
        value={
          rawMeetInfo.start_date
            ? [dayjs(rawMeetInfo.start_date), dayjs(rawMeetInfo.end_date)]
            : undefined
        }
        disabledDate={(current) =>
          // Can not select days before today and today
          current && current < moment().subtract(1, "days").endOf("day")
        }
      />
    ),
    "Start / End Time": (
      <MeetInfoContainer.Content.TimeRangePicker
        placeholder={[t("startTime"), t("endTime")]}
        onChange={handleMeetDataChange(
          (i, plus) =>
            i.minute() === 59 ? 48 : (i.hour() * 60 + i.minute()) / 30 + plus,
          "start_time_slot_id",
          "end_time_slot_id"
        )}
        disabledTime={() => ({
          disabledMinutes: (hour) =>
            range(60).filter(
              (minute) =>
                minute !== 0 && minute !== 30 && (hour !== 23 || minute !== 59)
            ),
        })}
        hideDisabledOptions={true}
        format={"HH:mm"}
        data-required={true}
        value={
          rawMeetInfo.start_time_slot_id
            ? [
                dayjs(
                  slotIDProcessing(rawMeetInfo.start_time_slot_id),
                  "HH-mm"
                ),
                dayjs(
                  slotIDProcessing(rawMeetInfo.end_time_slot_id + 1),
                  "HH-mm"
                ),
              ]
            : undefined
        }
      />
    ),
    Host: null,
    Member: (
      <Member
        setMeetData={setMeetData}
        Input={ThinnerInput}
        TextArea={TextAreaStyle}
        rawMember={member}
      />
    ),
    Description: (
      <MeetInfoContainer.Content.TextArea
        onChange={handleMeetDataChange((i) => i.target.value, "description")}
        value={rawMeetInfo.description}
      />
    ),
    "Voting Deadline": (
      <div
        style={{
          display: "flex",
          columnGap: RWDWidth(20),
          alignItems: "center",
        }}
      >
        <Switch
          onChange={() => {
            setVotingddl((prev) => !prev);
          }}
          checked={votingddl}
        />
        {votingddl && (
          <>
            <MeetInfoContainer.Content.DatePicker
              placeholder={t("selectDate")}
              onChange={handleMeetDataChange(
                (i) =>
                  i
                    ? rawMeetInfo.voting_end_time
                      ? moment(
                          `${moment(i.toISOString()).format(
                            "YYYY-MM-DD"
                          )} ${moment(rawMeetInfo.voting_end_time).format(
                            "HH-mm-ss"
                          )}`,
                          "YYYY-MM-DD HH-mm-ss"
                        ).toISOString()
                      : i.toISOString()
                    : null,
                "voting_end_time"
              )}
              value={
                rawMeetInfo.voting_end_time
                  ? dayjs(rawMeetInfo.voting_end_time)
                  : null
              }
              disabledDate={(current) =>
                // Can not select days before today and today
                current && current < moment().subtract(1, "days").endOf("day")
              }
            />
            <MeetInfoContainer.Content.TimePicker
              placeholder={t("selectTime")}
              onChange={handleMeetDataChange(
                (i) =>
                  i
                    ? rawMeetInfo.voting_end_time
                      ? moment(
                          `${moment(rawMeetInfo.voting_end_time).format(
                            "YYYY-MM-DD"
                          )} ${moment(i.toISOString()).format("HH-mm-ss")}`,
                          "YYYY-MM-DD HH-mm-ss"
                        ).toISOString()
                      : i.toISOString()
                    : null,
                "voting_end_time"
              )}
              value={
                rawMeetInfo.voting_end_time
                  ? dayjs(rawMeetInfo.voting_end_time)
                  : undefined
              }
            />
          </>
        )}
      </div>
    ),
    "Invitation URL": null,
    "Google Meet URL": (
      <Switch
        data-info={login !== "google"}
        disabled={login !== "google"}
        onChange={handleMeetDataChange((i) => i, "gen_meet_url")}
        checked={rawMeetInfo.gen_meet_url}
      />
    ),
  };

  const CONTENTNAME = {
    "Meet Name": t("meetName"),
    "Start / End Date": t("startDate"),
    "Start / End Time": t("startTime"),
    Host: t("host"),
    Member: t("member"),
    Description: t("description"),
    "Voting Deadline": t("votingDeadline"),
    "Invitation URL": t("invitationURL"),
    "Google Meet URL": t("url"),
  };

  return (
    <MeetInfoContainer columnGap={columnGap} rowGap={rowGap} {...prop}>
      {Object.keys(CONTENTMENU)
        .filter((m) => (reviseMode ? CONTENTMENU[m] : m !== "Meet Name"))
        .map((title, index) => (
          <Fragment key={index}>
            <MeetInfoContainer.Content
              style={{
                gridColumn: "1/2",
                gridRow: `${index + 1}/${index + 2}`,
                alignSelf:
                  (title === "Description" || title === "Member") &&
                  "flex-start",
                columnGap: RWDWidth(4),
              }}
            >
              <div>{CONTENTNAME[title] ?? title}</div>
              {reviseMode && CONTENTMENU[title]?.props["data-required"] && (
                <div
                  style={{
                    fontFamily: "Courier New",
                    alignSelf: "flex-start",
                  }}
                >
                  &#1645;
                </div>
              )}
              {reviseMode && CONTENTMENU[title]?.props["data-info"] && (
                <Tooltip
                  title="Connect with Google to enable"
                  color="#FFFFFF"
                  overlayInnerStyle={{
                    color: "#000000",
                  }}
                >
                  <InfoCircleOutlined
                    style={{
                      marginLeft: RWDWidth(4),
                      cursor: "pointer",
                      color: "darkgray",
                      fontWeight: "bold",
                    }}
                  />
                </Tooltip>
              )}
            </MeetInfoContainer.Content>
            <MeetInfoContainer.Content
              style={{
                gridColumn: "2/3",
                gridRow: `${index + 1}/${index + 2}`,
                fontWeight: "normal",
              }}
            >
              {reviseMode && (!confirmed || !CONFIRM_INEDITABLE.includes(title))
                ? CONTENTMENU[title]
                : ElementMeetInfo[title]}
            </MeetInfoContainer.Content>
          </Fragment>
        ))}
    </MeetInfoContainer>
  );
};

MeetInfo.Title = styled.p`
  font-size: ${RWDFontSize(30)}; //max(1.6vw, 20px);
  font-weight: bold;
  margin: 0;
`;

export default MeetInfo;
