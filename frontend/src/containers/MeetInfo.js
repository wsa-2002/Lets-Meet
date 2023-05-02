import { InfoCircleFilled } from "@ant-design/icons";
import { Button, Modal, Form } from "antd";
import _ from "lodash";
import Moment from "moment";
import { extendMoment } from "moment-range";
import React, { Fragment, useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";
import { useMeet } from "./hooks/useMeet";
import Base from "../components/Base/145MeetRelated";
import TEST from "../components/Button";
import Input from "../components/Input";
import Tag from "../components/Tag";
import TimeCell, { slotIDProcessing } from "../components/TimeCell";
import { RWD, COLORS } from "../constant";
import { useTranslation } from 'react-i18next';
import { getMeetInfo, joinMeet, getGroupAvailability } from "../middleware";
const { RWDHeight, RWDWidth, RWDFontSize } = RWD;
const MemberTag = Tag("member");
const InfoCell = TimeCell("info");
const moment = extendMoment(Moment);
const MainInput = Input("main");
const MainPassword = Input.Password("main");
const BackButton = TEST("back");
const ModalButton = TEST("modal");

const { ContentContainer } = Base.FullContainer;

const {
  GroupAvailability,
  GroupAvailability: { VotingContainer },
  GroupAvailability: {
    VotingContainer: { DayContainer },
  },
  GroupAvailability: {
    VotingContainer: {
      DayContainer: { CellHoverContainer },
    },
  },
} = ContentContainer;

const MeetInfo = () => {
  const { t } = useTranslation();
  const [isModalLeaveOpen, setIsModalLeaveOpen] = useState(false);
  const [isModalVoteOpen, setIsModalVoteOpen] = useState(false);
  const ref = useRef(); //偵測星期三的高度與寬度
  const [DATERANGE, setDATERANGE] = useState([]);
  const [TIMESLOTIDS, setTIMESLOTIDS] = useState([]);
  const [VOTINGINFO, setVOTINGINFO] = useState([]);
  const [CELLCOLOR, setCELLCOLOR] = useState([]);

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
  const { login, cookies, setError } = useMeet();
  const navigate = useNavigate();
  const location = useLocation();
  const { code } = useParams();
  const [form] = Form.useForm();

  const handleMeetInfo = async () => {
    try {
      const { data: votingData } = await getGroupAvailability(
        code,
        cookies.token
      );
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
          slotIDProcessing(data.end_time_slot_id + 1),
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
        _.range(data.start_time_slot_id, data.end_time_slot_id + 2)
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const CONTENTNAME = {
    "Meet Name": t("meetName"),
    "Start / End Date": t("startDate"),
    "Start / End Time": t("startTime"),
    Host: t("host"),
    Member: t("member"),
    Description: t("description"),
    "Voting Deadline": t("votingDeadline"),
    "Invitation URL": t("invitation"),
    "Google Meet URL": t("url")
  }

  useEffect(() => {
    if (code) {
      handleMeetInfo();
    }
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

  const handleLeaveYes = () => {
    if (!login) {
      navigate("/");
    }
  };

  const handleVote = () => {
    if (!login && !location?.state?.guestName) {
      setIsModalVoteOpen(true);
      return;
    }
    navigate(`/voting/${code}`);
  };

  const handleVoteOk = async (e) => {
    // console.log(form);
    await joinMeet(
      { invite_code: code, name: form.getFieldValue().name },
      cookies.token
    );
    navigate(`/voting/${code}`);
    setIsModalVoteOpen(false);
  };

  return (
    <Base login={login}>
      <Base.FullContainer>
        {meetInfo?.EventName && (
          <Base.FullContainer.ContentContainer>
            <ContentContainer.Title>
              <BackButton
                style={{
                  position: "absolute",
                  right: "100%",
                  marginRight: RWDWidth(30),
                }}
                onClick={() => {
                  navigate("/meets");
                }}
              />
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
                  onClick={() => {
                    setIsModalLeaveOpen(true);
                  }}
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
            {t("groupAva")}
            </ContentContainer.GroupAvailability>
            {DATERANGE.length && TIMESLOTIDS.length && (
              <ScrollSync>
                <GroupAvailability.VotingContainer>
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
                              style={{
                                backgroundColor:
                                  CELLCOLOR[
                                    w_index * (TIMESLOTIDS.length - 1) + t_index
                                  ],
                              }}
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
                                    ]?.available_members.map((m, index) => (
                                      <div key={index}>{m}</div>
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
                                    {VOTINGINFO?.[
                                      w_index * (TIMESLOTIDS.length - 1) +
                                        t_index
                                    ]?.unavailable_members.map((m, index) => (
                                      <div key={index}>{m}</div>
                                    ))}
                                  </CellHoverContainer.CellHoverInfo>
                                </DayContainer.CellHoverContainer>
                              }
                            />
                          </DayContainer.CellContainer>
                        ))}
                      </VotingContainer.DayContainer>
                    </ScrollSyncPane>
                  ))}
                </GroupAvailability.VotingContainer>
              </ScrollSync>
            )}
          </Base.FullContainer.ContentContainer>
        )}
        <Modal
          bodyStyle={{ height: RWDHeight(30) }}
          centered
          closable={false}
          footer={
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <ModalButton
                style={{ backgroundColor: "#B8D8BA" }}
                onClick={() => {
                  setIsModalLeaveOpen(false);
                }}
              >
                NO
              </ModalButton>
              <ModalButton
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#B8D8BA",
                }}
                onClick={handleLeaveYes}
                type="default"
              >
                YES
              </ModalButton>
            </div>
          }
          onCancel={() => {
            setIsModalLeaveOpen(false);
          }}
          open={isModalLeaveOpen}
          title={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                columnGap: RWDWidth(12),
              }}
            >
              <InfoCircleFilled style={{ color: "#FAAD14" }} />
              <span>Are you sure you want to leave this meet?</span>
            </div>
          }
        />
        <Modal
          centered
          closable={false}
          footer={null}
          onCancel={() => {
            setIsModalVoteOpen(false);
          }}
          open={isModalVoteOpen}
          title=""
          width={RWDWidth(450)}
        >
          <Form
            form={form}
            style={{
              width: RWDWidth(393),
              height: RWDHeight(192),
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              margin: "15px 0",
            }}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Username is required",
                },
              ]}
              style={{ margin: 0 }}
            >
              <MainInput placeholder="Your name" />
            </Form.Item>
            <Form.Item name="password" style={{ margin: 0 }}>
              <MainPassword placeholder="Password (optional)" />
            </Form.Item>
            <Form.Item style={{ margin: 0, alignSelf: "flex-end" }}>
              <ModalButton
                htmlType="submit"
                style={{ backgroundColor: "#B8D8BA" }}
              >
                OK
              </ModalButton>
            </Form.Item>
          </Form>
        </Modal>
      </Base.FullContainer>
    </Base>
  );
};

export default MeetInfo;
