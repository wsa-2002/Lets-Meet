import { InfoCircleOutlined } from "@ant-design/icons";
import {
  Input as AntdInput,
  DatePicker,
  TimePicker,
  Switch,
  Tooltip,
} from "antd";
import moment from "moment";
import React, { useState, Fragment } from "react";
import styled, { css } from "styled-components";
import Member from "./Member";
import Input from "../Input";
import { RWD } from "../../constant";
const ThinnerInput = Input("thinner");
const { RWDWidth, RWDHeight, RWDFontSize, RWDRadius } = RWD;

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
    grid-row-gap: ${({ rowGap }) => RWDWidth(rowGap)};
  `,
  {
    Content: Object.assign(
      styled.div`
        display: flex;
        align-items: center;
        font-size: ${RWDFontSize(16)};
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

// MeetInfoContainer.

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
}) => {
  const [votingddl, setVotingddl] = useState(false);
  const CONTENTMENU = {
    "Meet Name": (
      <ThinnerInput
        onChange={handleMeetDataChange((i) => i.target.value, "meet_name")}
        data-required={true}
      />
    ),
    "Start/End Date": (
      <MeetInfoContainer.Content.DateRangePicker
        onChange={handleMeetDataChange(
          (i) => moment(i.toISOString()).format("YYYY-MM-DD"),
          "start_date",
          "end_date"
        )}
        data-required={true}
      />
    ),
    "Start/End Time": (
      <MeetInfoContainer.Content.TimeRangePicker
        onChange={handleMeetDataChange(
          (i, plus) => (i.hour() * 60 + i.minute()) / 30 + plus,
          "start_time_slot_id",
          "end_time_slot_id"
        )}
        minuteStep={30}
        format={"HH:mm"}
        data-required={true}
      />
    ),
    Member: (
      <Member
        setMeetData={setMeetData}
        Input={ThinnerInput}
        TextArea={TextAreaStyle}
      />
    ),
    Description: (
      <MeetInfoContainer.Content.TextArea
        onChange={handleMeetDataChange((i) => i.target.value, "description")}
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
        />
        {votingddl && (
          <>
            <MeetInfoContainer.Content.DatePicker
              onChange={handleMeetDataChange(
                (i) => moment(i.toISOString()).format("YYYY-MM-DD"),
                "voting_end_date"
              )}
            />
            <MeetInfoContainer.Content.TimePicker
              onChange={handleMeetDataChange(
                (i) => moment(i.toISOString()).format("HH-mm-ss"),
                "voting_end_time"
              )}
            />
          </>
        )}
      </div>
    ),
    "Google Meet URL": (
      <Switch
        data-info={!login}
        disabled={!login}
        onChange={handleMeetDataChange((i) => i, "gen_meet_url")}
      />
    ),
  };

  return (
    <MeetInfoContainer columnGap={columnGap} rowGap={rowGap}>
      {Object.keys(CONTENTMENU).map((title, index) => (
        <Fragment key={index}>
          <MeetInfoContainer.Content
            style={{
              gridColumn: "1/2",
              gridRow: `${index + 1}/${index + 2}`,
              alignSelf:
                (title === "Description" || title === "Member") && "flex-start",
              columnGap: RWDWidth(4),
            }}
          >
            <div>{title}</div>
            {CONTENTMENU[title].props["data-required"] && (
              <div
                style={{
                  fontFamily: "Courier New",
                  alignSelf: "flex-start",
                }}
              >
                &#1645;
              </div>
            )}
            {CONTENTMENU[title].props["data-info"] && (
              <Tooltip
                title="Registered users only"
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
            {CONTENTMENU[title]}
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
