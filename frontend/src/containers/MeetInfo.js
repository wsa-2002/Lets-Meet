import React, { Fragment, useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import "@fontsource/roboto/500.css";
import { Input, Button, Modal, Form } from "antd";
import _ from "lodash";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { getMeetInfo, joinMeet, GroupAvailability } from "../middleware";
import { useMeet } from "./hooks/useMeet";
import Base from "../components/Base/145MeetRelated";
import Tag from "../components/Tag";
import TimeCell from "../components/TimeCell";
import Moment from "moment";
import { extendMoment } from "moment-range";
import { RWD } from "../constant";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";
const { RWDHeight, RWDWidth, RWDFontSize } = RWD;
const MemberTag = Tag("member");
const InfoCell = TimeCell("info");
const moment = extendMoment(Moment);

let showList = [
  "9:00",
  "9:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
].map((m) =>
  [
    "May 19Wed",
    "May 20Wed",
    "May 21Wed",
    "May 22Wed",
    "May 23Wed",
    "May 24Wed",
    "May 25Wed",
  ].map((d) => ({
    date: d,
    time: m,
    availableNum: Math.floor(Math.random() * 3),
  }))
);

const ContentContainer = Object.assign(
  styled.div`
    display: grid;
    position: relative;
    top: ${RWDHeight(100)};
    grid-template-columns: 4fr 5fr;
    grid-template-rows: min-content min-content auto;
    /* border: 2px dashed black; */
  `,
  {
    Title: styled.div`
      display: flex;
      align-items: center;
      grid-column: 1/2;
      grid-row: 1/2;
      font-size: ${RWDFontSize(30)};
      font-weight: bold;
    `,
    InfoContainer: Object.assign(
      styled.div`
        display: flex;
        flex-direction: column;
        grid-column: 1/2;
        grid-row: 3/4;
        row-gap: ${RWDHeight(54)};
      `,
      {
        Info: styled.div`
          display: grid;
          grid-template-columns: repeat(2, max-content);
          grid-template-rows: repeat(8, max-content);
          grid-column-gap: ${RWDWidth(33)};
          grid-row-gap: ${RWDHeight(30)};
          font-size: ${RWDFontSize(20)};
          font-weight: 700;
        `,
      }
    ),
    GroupAvailability: styled.div`
      grid-column: 2/3;
      grid-row: 2/3;
      height: ${RWDHeight(65)};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: ${RWDFontSize(20)};
      font-weight: bold;
    `,
    VotingContainer: Object.assign(
      styled.div`
        grid-column: 2/3;
        grid-row: 3/4;
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: ${RWDWidth(960)};
        max-height: ${RWDHeight(700)};
        overflow-x: auto;
        &::-webkit-scrollbar {
          display: none;
        }
        -ms-overflow-style: none;
        scrollbar-width: none;
      `,
      {
        DayContainer: Object.assign(
          styled.div`
            display: flex;
            max-width: 100%;
            position: relative;
            height: fit-content;
            flex-shrink: 0;
            column-gap: ${RWDWidth(5)};
            overflow-x: auto;
            &::-webkit-scrollbar {
              display: none;
            }
            -ms-overflow-style: none;
            scrollbar-width: none;
          `,
          {
            TimeContainer: styled.span`
              display: flex;
              align-items: center;
              justify-content: flex-end;
              width: ${RWDWidth(32)};
              height: fit-content;
              font-size: ${RWDFontSize(12)};
              align-self: flex-end;
              position: sticky;
              left: 0;
              padding-left: ${RWDWidth(20)};
              padding-top: ${RWDHeight(20)};
              background-color: white;
            `,
            CellContainer: styled.div`
              width: ${RWDWidth(50)};
              font-size: ${RWDFontSize(14)};
              display: flex;
              flex-direction: column;
              align-items: center;
              flex-shrink: 0;
            `,
            CellHoverContainer: Object.assign(
              styled.div`
                width: ${RWDWidth(165)};
                display: flex;
                justify-content: space-between;
                color: #000000;
              `,
              {
                CellHoverInfo: styled.div`
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  row-gap: ${RWDHeight(5)};
                `,
              }
            ),
          }
        ),
      }
    ),
  }
);

const {
  VotingContainer,
  VotingContainer: { DayContainer },
  VotingContainer: {
    DayContainer: { CellHoverContainer },
  },
} = ContentContainer;

const addHexColor = (c1, c2) => {
  var hexStr = (parseInt(c1, 16) - parseInt(c2, 16)).toString(16);
  while (hexStr.length < 6) {
    hexStr = "0" + hexStr;
  } // Zero pad.
  return hexStr;
};

const MeetInfo = () => {
  const [isModalLeaveOpen, setIsModalLeaveOpen] = useState(false);
  const [isModalVoteOpen, setIsModalVoteOpen] = useState(false);
  const ref = useRef(); //偵測星期三的高度與寬度
  const [DATERANGE, setDATERANGE] = useState([]);
  const [TIMESLOTIDS, setTIMESLOTIDS] = useState([]);
  const [VOTINGINFO, setVOTINGINFO] = useState([]);

  const slotIDProcessing = (id) => {
    let hour = String(parseInt(((id - 1) * 30) / 60));
    const startHour = "0".repeat(2 - hour.length) + hour;
    const startMinute = parseInt(((id - 1) * 30) % 60) ? "30" : "00";
    return `${startHour}:${startMinute}`;
  };

  const [meetInfo, setMeetInfo] = useState({
    EventName: "",
    "Start / End Date": "",
    "Start / End Time": "",
    Host: "",
    Member: "",
    Description: "",
    "Voting Deadline": "",
    "Invitation URL": "",
    "Google Meet URL": "",
  });
  const { login, cookies } = useMeet();
  const navigate = useNavigate();
  const location = useLocation();
  const { code } = useParams();
  const [form] = Form.useForm();

  const handleMeetInfo = async () => {
    try {
      const { data: votingData } = await GroupAvailability(code, cookies.token);
      setVOTINGINFO(votingData.data);
      console.log(votingData.data);
      const { data } = await getMeetInfo(undefined, cookies.token, code);
      setMeetInfo({
        EventName: data.meet_name,
        "Start / End Date":
          data.start_date.replaceAll("-", "/") +
          " ~ " +
          data.end_date.replaceAll("-", "/"),
        "Start / End Time":
          slotIDProcessing(data.start_time_slot_id) +
          " ~ " +
          slotIDProcessing(data.end_time_slot_id), //  (data.start_time_slot_id - 1) * 30 % 60
        Host: (
          <MemberTag style={{ fontSize: RWDFontSize(16) }}>
            {data.host_info?.name ??
              data.host_info?.id ??
              location.state.guestName}
          </MemberTag>
        ),
        Member: (
          <div
            style={{
              display: "flex",
              gap: `${RWDFontSize(8)} ${RWDFontSize(8)}`,
              flexWrap: "wrap",
              width: RWDWidth(590),
              alignContent: "flex-start",
            }}
          >
            {data.member_infos.map((m, index) => (
              <MemberTag key={index}>{m.name}</MemberTag>
            ))}
          </div>
        ),
        Description: data.description ?? "None",
        "Voting Deadline": data.voting_end_time
          ? moment(data.voting_end_time).format("YYYY/MM/DD HH:mm:ss")
          : "None",
        "Invitation URL": `https://lets.meet.com?invite=${data.invite_code}`,
        "Google Meet URL":
          data.meet_url ?? "https://meet.google.com/vft-xolb-mog",
      });
      setDATERANGE(
        [
          ...moment
            .range(moment(data.start_date), moment(data.end_date))
            .by("day"),
        ].map((m) => m.format("YYYY-MM-DD"))
      );
      setTIMESLOTIDS(
        _.range(data.start_time_slot_id, data.end_time_slot_id + 1)
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (code) {
      handleMeetInfo();
    }
  }, [code]);

  const showLeaveModal = () => {
    setIsModalLeaveOpen(true);
  };
  const handleLeaveOk = () => {
    setIsModalLeaveOpen(false);
  };
  const handleLeaveCancel = () => {
    setIsModalLeaveOpen(false);
  };

  const handleVote = () => {
    if (!login && !location.state.guestName) {
      setIsModalVoteOpen(true);
      return;
    }
    navigate("/voting");
  };

  const handleVoteOk = async (e) => {
    // console.log(form);
    await joinMeet(
      { invite_code: code, name: form.getFieldValue().name },
      cookies.token
    );
    navigate("/voting");
    setIsModalVoteOpen(false);
  };
  const handleVoteCancel = () => {
    setIsModalVoteOpen(false);
  };

  const chooseColor = (num) => {
    // return addHexColor("F0F0F0", ((Math.max(num-1, 0)*3635)+984028).toString(16));
    if (num === 0) return "f0f0f0";
    else return addHexColor("FFF4CC", ((num - 1) * 3635).toString(16));
  };

  return (
    <Base>
      <Base.FullContainer>
        {meetInfo?.EventName && (
          <ContentContainer>
            <ContentContainer.Title>
              <Button
                icon={<ArrowLeftOutlined />}
                style={{
                  position: "absolute",
                  right: "100%",
                  borderColor: "white",
                  color: "#808080",
                  marginRight: RWDWidth(30),
                }}
                onClick={() => {
                  navigate("/meets");
                }}
              ></Button>
              <span>{meetInfo.EventName}</span>
            </ContentContainer.Title>
            <ContentContainer.InfoContainer>
              <ContentContainer.InfoContainer.Info>
                {Object.keys(meetInfo)
                  .filter((m) => m !== "EventName")
                  .map((title, index) => (
                    <Fragment key={index}>
                      <div
                        style={{
                          gridColumn: "1/2",
                          gridRow: `${index + 1}/${index + 2}`,
                        }}
                      >
                        {title}
                      </div>
                      <div
                        style={{
                          gridColumn: "2/3",
                          gridRow: `${index + 1}/${index + 2}`,
                          fontWeight: "normal",
                          fontSize: RWDFontSize(16),
                        }}
                      >
                        {meetInfo[title]}
                      </div>
                    </Fragment>
                  ))}
              </ContentContainer.InfoContainer.Info>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  alignSelf: "flex-end",
                  columnGap: RWDWidth(15),
                }}
              >
                <Button
                  style={{
                    borderColor: "#FEE9DD",
                    color: "#DB8600",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: RWDFontSize(14),
                  }}
                  onClick={showLeaveModal}
                >
                  Leave Meet
                </Button>
                <Button
                  style={{
                    background: "#DB8600",
                    borderColor: "#DB8600",
                    color: "white",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: RWDFontSize(14),
                  }}
                  onClick={handleVote}
                >
                  Vote
                </Button>
              </div>
            </ContentContainer.InfoContainer>
            <ContentContainer.GroupAvailability>
              Group Availability
            </ContentContainer.GroupAvailability>
            {DATERANGE.length && TIMESLOTIDS.length && (
              <ScrollSync>
                <ContentContainer.VotingContainer>
                  <ScrollSyncPane>
                    <VotingContainer.DayContainer>
                      <DayContainer.TimeContainer
                        style={{ paddingTop: RWDHeight(30) }}
                      >
                        {slotIDProcessing(TIMESLOTIDS[0])}
                      </DayContainer.TimeContainer>
                      {DATERANGE.map((w, index) => (
                        <DayContainer.CellContainer
                          key={index}
                          // ref={w === "WED" ? ref : null}
                        >
                          <div style={{ userSelect: "none" }}>
                            {moment(w).format("MMM DD")}
                          </div>
                          <div
                            style={{ userSelect: "none", fontWeight: "bold" }}
                          >
                            {moment(w).format("ddd")}
                          </div>
                        </DayContainer.CellContainer>
                      ))}
                    </VotingContainer.DayContainer>
                  </ScrollSyncPane>

                  {TIMESLOTIDS.slice(1).map((t, t_index) => (
                    <ScrollSyncPane key={t_index}>
                      <VotingContainer.DayContainer>
                        <DayContainer.TimeContainer>
                          {slotIDProcessing(t)}
                        </DayContainer.TimeContainer>
                        {DATERANGE.map((_, w_index) => (
                          <DayContainer.CellContainer key={w_index}>
                            <InfoCell
                              style={{ backgroundColor: "#F0F0F0" }}
                              info={
                                <DayContainer.CellHoverContainer>
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
                                      w_index * (TIMESLOTIDS.length - 1) +
                                        t_index
                                    ]?.available_members.map((m) => (
                                      <div>{m}</div>
                                    ))}
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
                                    {VOTINGINFO?.[0]?.unavailable_members.map(
                                      (m, index) => (
                                        <div key={index}>{m}</div>
                                      )
                                    )}
                                  </CellHoverContainer.CellHoverInfo>
                                </DayContainer.CellHoverContainer>
                              }
                            />
                          </DayContainer.CellContainer>
                        ))}
                      </VotingContainer.DayContainer>
                    </ScrollSyncPane>
                  ))}
                </ContentContainer.VotingContainer>
              </ScrollSync>
            )}
          </ContentContainer>
        )}
        <Modal
          title="Are you sure you want to leave this meet?"
          open={isModalLeaveOpen}
          onOk={handleLeaveOk}
          onCancel={handleLeaveCancel}
          okText="Yes"
          cancelText="No"
        ></Modal>
        <Modal
          title=""
          open={isModalVoteOpen}
          onOk={handleVoteOk}
          onCancel={handleVoteCancel}
          okText="Ok"
          cancelText="Cancel"
        >
          <Form form={form} layout="vertical" name="form_in_modal">
            <Form.Item
              name="name"
              label="Your name"
              rules={[
                {
                  required: true,
                  message: "Error: Please enter your name!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="Password" label="Password(Optional)">
              <Input.Password />
            </Form.Item>
          </Form>
          <Input
            placeholder="Your name"
            style={{
              borderRadius: "15px",
              marginTop: "30px",
              marginBottom: "20px",
            }}
            name="user_identifier"
          />
          <Input
            placeholder="Password(Optional)"
            style={{
              borderRadius: "15px",
              // marginBttom: "30px",
            }}
            name="password"
          />
        </Modal>
      </Base.FullContainer>
    </Base>
  );
};

export default MeetInfo;
