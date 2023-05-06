/*TODO:********************************************************************************************
  1. 更新時 voting end time 和 description 的資料型態
**************************************************************************************************/
import { InfoCircleFilled, EditFilled } from "@ant-design/icons";
import { Modal, Form } from "antd";
import { motion } from "framer-motion";
import _ from "lodash";
import Moment from "moment";
import { extendMoment } from "moment-range";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";
import { useMeet } from "./hooks/useMeet";
import Base from "../components/Base/145MeetRelated";
import Button from "../components/Button";
import MeetInfoEdit from "../components/MeetInfo";
import Test from "../components/Modal";
import Tag from "../components/Tag";
import TimeCell, { slotIDProcessing } from "../components/TimeCell";
import { RWD, COLORS, PAGE_TRANSITION } from "../constant";
import { meet, getGroupAvailability } from "../middleware";
const { RWDHeight, RWDWidth, RWDFontSize } = RWD;
const MemberTag = Tag("member");
const InfoCell = TimeCell("info");
const moment = extendMoment(Moment);
const BackButton = Button("back");
const ModalButton = Button("modal");
const RectButton = Button("rect");
const GuestNameModal = Test("guestName");

/*AXIOS 串接 API tool*/
const getMeetInfo = meet("read");
const joinMeet = meet("join");
const leaveMeet = meet("leave");
const editMeet = meet("update");
/******************************************************/

const { ContentContainer } = Base.FullContainer;

const {
  GroupAvailability,
  GroupAvailability: { VotingArea, VotingContainer },
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
  const [groupAvailabilityInfo, setGroupAvailabilityInfo] = useState([]);
  const [CELLCOLOR, setCELLCOLOR] = useState([]);

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
  });
  const [rawMeetInfo, setRawMeetInfo] = useState({});
  const [forMemberDataFormat, setForMemberDataFormat] = useState([]);
  const [host, setHost] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [exist, setExist] = useState(undefined);

  const { login, cookies, ID, setError, setLoading } = useMeet();
  const navigate = useNavigate();
  const location = useLocation();
  const { code } = useParams();
  const [form] = Form.useForm();
  // const oriRawMeetInfo = useMemo(() => rawMeetInfo, [editMode]);

  const handleMeetInfo = async () => {
    try {
      setLoading(true);
      const { data: votingData, error } = await getGroupAvailability(
        code,
        cookies.token
      );
      if (error) throw new Error(error);

      setGroupAvailabilityInfo(votingData.data);
      const {
        data: {
          meet_name,
          start_date,
          end_date,
          start_time_slot_id,
          end_time_slot_id,
          host_info,
          member_infos,
          description,
          voting_end_time,
          invite_code,
          meet_url,
        },
      } = await getMeetInfo(code, cookies.token);
      setHost(host_info?.account_id === ID);
      setForMemberDataFormat(
        member_infos.map((m) => ({ username: m.name, id: m.account_id }))
      );
      setElementMeetInfo({
        "Meet Name": meet_name,
        "Start / End Date":
          start_date.replaceAll("-", "/") +
          " ~ " +
          end_date.replaceAll("-", "/"),
        "Start / End Time":
          slotIDProcessing(start_time_slot_id) +
          " ~ " +
          slotIDProcessing(end_time_slot_id + 1),
        Host: (
          <MemberTag style={{ fontSize: RWDFontSize(16) }}>
            {host_info?.name ?? location.state?.guestName}
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
            {member_infos.map((m, index) => (
              <MemberTag key={index}>{m.name}</MemberTag>
            ))}
          </div>
        ),
        Description: description ?? "None",
        "Voting Deadline": voting_end_time
          ? moment(voting_end_time).format("YYYY/MM/DD HH:mm:ss")
          : "None",
        "Invitation URL": `https://lets.meet.com?invite=${invite_code}`,
        "Google Meet URL": meet_url ?? "None",
      });
      setRawMeetInfo({
        meet_name,
        start_date,
        end_date,
        start_time_slot_id,
        end_time_slot_id,
        description: description ?? "",
        voting_end_time,
        gen_meet_url: meet_url ? true : false,
        member_ids: member_infos.map((m) => m.account_id),
      });
      setDATERANGE(
        [...moment.range(moment(start_date), moment(end_date)).by("day")].map(
          (m) => m.format("YYYY-MM-DD")
        )
      );
      setTIMESLOTIDS(_.range(start_time_slot_id, end_time_slot_id + 2));
      setLoading(false);
    } catch (error) {
      setError(error.message);
      // setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      if (code && exist) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        await handleMeetInfo();
        setLoading(false);
      }
    })();
  }, [code, ID]);

  useEffect(() => {
    (async () => {
      if (exist === undefined) {
        const { error } = await getMeetInfo(code, cookies.token);
        if (error) {
          setExist(false);
          setError(error);
          return;
        }
        setExist(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (groupAvailabilityInfo.length) {
      const allMembersNum =
        groupAvailabilityInfo?.[0]?.available_members.length +
        groupAvailabilityInfo?.[0]?.unavailable_members.length;
      const gap =
        Math.floor(allMembersNum / 5) < 1 ? 1 : Math.floor(allMembersNum / 5);
      setCELLCOLOR(
        groupAvailabilityInfo.map(
          (v) => COLORS.orange[Math.ceil(v.available_members.length / gap)]
        )
      );
    }
  }, [groupAvailabilityInfo]); //設定 time cell 顏色

  const handleLeaveYes = async () => {
    try {
      setLoading(true);
      const { error } = await leaveMeet(code, cookies.token);
      if (!error) {
        setLoading(false);
        navigate("/meets");
      }
    } catch (error) {
      throw error;
    }
  };

  const handleVote = () => {
    if (!login && !location?.state?.guestName) {
      setIsModalVoteOpen(true);
      return;
    }
    navigate(`/voting/${code}`, {
      state: { guestName: location?.state?.guestName },
    });
  };

  const handleVoteOk = async (e) => {
    const { username, password } = form.getFieldValue();
    console.log(form.getFieldValue());
    await joinMeet(code, cookies.token, { name: username, password });
    // navigate(`/voting/${code}`);
    // setIsModalVoteOpen(false);
  };

  const handleMeetDataChange =
    (func, ...name) =>
    (e) => {
      if (name.length === 1) {
        setRawMeetInfo((prev) => ({ ...prev, [name[0]]: func(e) }));
      } else {
        setRawMeetInfo((prev) => ({
          ...prev,
          [name[0]]: func(e[0], 1),
          [name[1]]: func(e[1], 0),
        }));
      }
    };

  const handleEditDone = async () => {
    try {
      const data = await editMeet(code, cookies.token, rawMeetInfo);
      console.log(data);
      await handleMeetInfo();
      setLoading(false);
      setEditMode(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <motion.div
    //  {...PAGE_TRANSITION.RightSlideIn}
    >
      <Base login={login}>
        <Base.FullContainer>
          {elementMeetInfo?.["Meet Name"] && (
            <Base.FullContainer.ContentContainer>
              <ContentContainer.Title style={{ columnGap: RWDWidth(10) }}>
                {editMode ? (
                  "Edit Meet"
                ) : (
                  <>
                    <BackButton
                      style={{
                        position: "absolute",
                        right: "100%",
                        marginRight: RWDWidth(30),
                      }}
                      onClick={() => {
                        if (cookies.token) {
                          navigate("/meets");
                        } else {
                          navigate("/");
                        }
                      }}
                    />
                    {elementMeetInfo["Meet Name"]}
                    {host && (
                      <EditFilled
                        onClick={() => {
                          setEditMode((prev) => !prev);
                        }}
                      />
                    )}
                  </>
                )}
              </ContentContainer.Title>
              <ContentContainer.InfoContainer>
                <MeetInfoEdit
                  handleMeetDataChange={handleMeetDataChange}
                  columnGap={20}
                  rowGap={30}
                  login={login}
                  setMeetData={setRawMeetInfo}
                  ElementMeetInfo={elementMeetInfo}
                  rawMeetInfo={rawMeetInfo}
                  reviseMode={editMode}
                  member={forMemberDataFormat}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    alignSelf: "flex-end",
                    columnGap: RWDWidth(15),
                  }}
                >
                  {editMode ? (
                    <>
                      <RectButton
                        buttonTheme="#D8D8D8"
                        variant="hollow"
                        onClick={() => {
                          setEditMode(false);
                        }}
                      >
                        Cancel
                      </RectButton>
                      <RectButton
                        buttonTheme="#5A8EA4"
                        variant="solid"
                        onClick={handleEditDone}
                        // disabled={_.isEqual(rawMeetInfo, oriRawMeetInfo)}
                      >
                        Done
                      </RectButton>
                    </>
                  ) : (
                    <>
                      <RectButton
                        buttonTheme="#FBAE98"
                        variant="hollow"
                        onClick={() => {
                          if (!login) {
                            navigate("/");
                          }
                          setIsModalLeaveOpen(true);
                        }}
                      >
                        {host ? "Delete" : "Leave"} Meet
                      </RectButton>
                      <RectButton
                        buttonTheme="#DB8600"
                        variant="solid"
                        onClick={handleVote}
                      >
                        Vote
                      </RectButton>
                    </>
                  )}
                </div>
              </ContentContainer.InfoContainer>
              <ContentContainer.GroupAvailability>
                {t("groupAva")}
              </ContentContainer.GroupAvailability>
              {DATERANGE.length && TIMESLOTIDS.length && (
                <ScrollSync>
                  <VotingArea>
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
                                style={{
                                  userSelect: "none",
                                  fontWeight: "bold",
                                }}
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
                                        w_index * (TIMESLOTIDS.length - 1) +
                                          t_index
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
                                        {groupAvailabilityInfo?.[
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
                                        {groupAvailabilityInfo?.[
                                          w_index * (TIMESLOTIDS.length - 1) +
                                            t_index
                                        ]?.unavailable_members.map(
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
                    </GroupAvailability.VotingContainer>
                  </VotingArea>
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
                  buttonTheme="#B8D8BA"
                  variant="solid"
                  onClick={() => {
                    setIsModalLeaveOpen(false);
                  }}
                >
                  NO
                </ModalButton>
                <ModalButton
                  buttonTheme="#B8D8BA"
                  variant="hollow"
                  onClick={handleLeaveYes}
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
                <span>
                  Are you sure you want to {host ? "delete" : "leave"} this
                  meet?
                </span>
              </div>
            }
          />
          <GuestNameModal
            form={form}
            open={isModalVoteOpen}
            setOpen={setIsModalVoteOpen}
            handleVoteOk={handleVoteOk}
          ></GuestNameModal>
        </Base.FullContainer>
      </Base>
    </motion.div>
  );
};

export default MeetInfo;
