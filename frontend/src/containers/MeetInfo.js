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
import Error from "./Error";
import { meet, getGroupAvailability } from "../middleware";
const { RWDHeight, RWDWidth, RWDFontSize } = RWD;
const MemberTag = Tag("member");
const InfoCell = TimeCell("info");
const moment = extendMoment(Moment);
const BackButton = Button("back");
const ModalButton = Button("modal");
const RectButton = Button("rect");
const GuestNameModal = Test("guestName");
const InfoTooltip = Test("info");

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
  const [host, setHost] = useState(false); //是否為 host
  const [confirmed, setConfirmed] = useState(false); // meet 的狀態 (Confirmed)
  const [confirmedTime, setConfirmedTime] = useState({ date: "", timeID: [] });
  const [editMode, setEditMode] = useState(false); //是否為編輯模式

  const { login, cookies, setLoading } = useMeet();
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
          status,
          finalized_start_date,
          finalized_start_time_slot_id,
          finalized_end_time_slot_id,
        },
      } = await getMeetInfo(code, cookies.token);
      setHost(ID ? host_info?.account_id === ID : false);
      setConfirmed(status === "Confirmed");
      setConfirmedTime({
        date: finalized_start_date,
        timeID: finalized_start_time_slot_id
          ? _.range(
              finalized_start_time_slot_id,
              finalized_end_time_slot_id + 1
            )
          : [],
      });
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
        Description: description ? description : "None",
        "Voting Deadline": voting_end_time
          ? moment(voting_end_time).format("YYYY/MM/DD HH:mm:ss")
          : "None",
        "Invitation URL": `${
          process.env.REACT_APP_SERVER_USE_HTTPS === "true" ? "https" : "http"
        }://${process.env.REACT_APP_SERVER_DOMAIN}/meets/${invite_code}`,
        "Google Meet URL":
          (
            <a
              target="_blank"
              href={meet_url}
              style={{ color: "#000000", textDecoration: "underline" }}
              rel="noreferrer"
            >
              {meet_url}
            </a>
          ) ?? "None",
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

  /*檢驗身分*/
  const [exist, setExist] = useState(undefined); // meet是否存在
  const { ID, error, setError } = useMeet();

  useEffect(() => {
    (async () => {
      if (code && exist) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        await handleMeetInfo();
        setLoading(false);
      }
    })();
  }, [code, ID, exist]);

  useEffect(() => {
    (async () => {
      if (exist === undefined) {
        const { error } = await getMeetInfo(code, cookies.token);
        if (error) {
          setError(error);
          setExist(false);
          return;
        }
        setError("");
        setExist(true);
      }
    })();
  }, []);
  /******************************************************/

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

  const handleModalOk = async () => {
    const { username, password } = form.getFieldValue();
    const { error } = await joinMeet(code, cookies.token, {
      name: username,
      password,
    });
    console.log(error);
    // navigate(`/voting/${code}`, {
    //   state: {
    //     guestName: username,
    //     guestPassword: password,
    //   },
    // });
    setIsModalVoteOpen(false);
  };

  const handleMeetDataChange =
    (func, ...name) =>
    (e) => {
      console.log(e);
      if (name.length === 1) {
        setRawMeetInfo((prev) => ({ ...prev, [name[0]]: func(e) }));
      } else {
        setRawMeetInfo((prev) => ({
          ...prev,
          [name[0]]: e ? func(e[0], 1) : undefined,
          [name[1]]: e ? func(e[1], 0) : undefined,
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
    exist !== undefined &&
    (error ? (
      <Error />
    ) : (
      <motion.div
      //  {...PAGE_TRANSITION.RightSlideIn}
      >
        <Base login={login}>
          <Base.FullContainer>
            {elementMeetInfo?.["Meet Name"] && (
              <Base.FullContainer.ContentContainer>
                <ContentContainer.Title
                  style={{ columnGap: RWDWidth(10), position: "relative" }}
                >
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
                        <>
                          <EditFilled
                            onClick={() => {
                              setEditMode((prev) => !prev);
                            }}
                          />
                          {!confirmed && (
                            <RectButton
                              buttonTheme="#DB8600"
                              variant="solid"
                              onClick={() => {
                                navigate(`/confirm/${code}`);
                              }}
                              style={{ position: "absolute", right: 0 }}
                            >
                              {t("confirmMeet")}
                            </RectButton>
                          )}
                        </>
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
                          {t("cancel")}
                        </RectButton>
                        <RectButton
                          buttonTheme="#5A8EA4"
                          variant="solid"
                          onClick={handleEditDone}
                          // disabled={_.isEqual(rawMeetInfo, oriRawMeetInfo)}
                        >
                          {t("done")}
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
                          {host ? t("deleteMeet") : t("leaveMeet")}
                        </RectButton>
                        {!confirmed && (
                          <RectButton
                            buttonTheme="#DB8600"
                            variant="solid"
                            onClick={handleVote}
                          >
                            {t("vote")}
                          </RectButton>
                        )}
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
                              {DATERANGE.map((date, w_index) => (
                                <DayContainer.CellContainer key={w_index}>
                                  <InfoCell
                                    style={{
                                      backgroundColor:
                                        date === confirmedTime.date &&
                                        confirmedTime.timeID.includes(t - 1)
                                          ? "#F25C54"
                                          : confirmed
                                          ? "#F0F0F0"
                                          : CELLCOLOR[
                                              w_index *
                                                (TIMESLOTIDS.length - 1) +
                                                t_index
                                            ],
                                    }}
                                    info={
                                      <InfoTooltip
                                        available_members={
                                          groupAvailabilityInfo?.[
                                            w_index * (TIMESLOTIDS.length - 1) +
                                              t_index
                                          ]?.available_members
                                        }
                                        unavailable_members={
                                          groupAvailabilityInfo?.[
                                            w_index * (TIMESLOTIDS.length - 1) +
                                              t_index
                                          ]?.unavailable_members
                                        }
                                      />
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
                    {t("no")}
                  </ModalButton>
                  <ModalButton
                    buttonTheme="#B8D8BA"
                    variant="hollow"
                    onClick={handleLeaveYes}
                  >
                    {t("yes")}
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
                  <span>{host ? t("deleteConfirm") : t("leaveConfirm")}</span>
                </div>
              }
            />
            <GuestNameModal
              form={form}
              open={isModalVoteOpen}
              setOpen={setIsModalVoteOpen}
              handleModalOk={handleModalOk}
            />
          </Base.FullContainer>
        </Base>
      </motion.div>
    ))
  );
};

export default MeetInfo;
