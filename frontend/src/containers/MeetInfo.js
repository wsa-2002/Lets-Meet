/*TODO:********************************************************************************************
  1. 更新時 voting end time 和 description 的資料型態
**************************************************************************************************/
import { EditFilled, CopyOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { CopyToClipboard } from "react-copy-to-clipboard";
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
import Modal from "../components/Modal";
import Notification from "../components/Notification";
import Tag from "../components/Tag";
import TimeCell, { slotIDProcessing } from "../components/TimeCell";
import { RWD, COLORS, PAGE_TRANSITION } from "../constant";
import Error from "./Error";
import { meet, getGroupAvailability } from "../middleware";
const BackButton = Button("back");
const RectButton = Button("rect");
const RoundButton = Button("round");
const moment = extendMoment(Moment);
const GuestNameModal = Modal("guestName");
const InfoTooltip = Modal("info");
const LeaveModal = Modal("leave");
const { RWDHeight, RWDWidth, RWDFontSize } = RWD;
const MemberTag = Tag("member");
const InfoCell = TimeCell("info");

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
  const location = useLocation();
  const { login, cookies, setLoading, ID, error, setError } = useMeet();
  // const oriRawMeetInfo = useMemo(() => rawMeetInfo, [editMode]);
  const navigate = useNavigate();
  const { code } = useParams();
  const ref = useRef(); //偵測星期三的高度與寬度
  const { t } = useTranslation();

  /*檢驗身分*/
  const [exist, setExist] = useState(undefined); // meet是否存在
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

  /*main: get meet info and vote info*/
  const [CELLCOLOR, setCELLCOLOR] = useState([]); //vote info color
  const [confirmed, setConfirmed] = useState(false); //meet 的狀態 (Confirmed)
  const [confirmedTime, setConfirmedTime] = useState({ date: "", timeID: [] }); //confirmed 的時間
  const [DATERANGE, setDATERANGE] = useState([]); //meet 天數範圍
  const [groupAvailabilityInfo, setGroupAvailabilityInfo] = useState([]); //vote info
  const [host, setHost] = useState(false); //是否為 host
  const [TIMESLOTIDS, setTIMESLOTIDS] = useState([]); //meet 時間範圍
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
        member_infos.map((m) => ({
          username: m.name,
          id: m.account_id,
          email: m.email,
        }))
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
        "Voting Deadline": voting_end_time
          ? moment(voting_end_time).format("YYYY/MM/DD HH:mm:ss")
          : "None",
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
      setRawMeetInfo({
        meet_name,
        start_date,
        end_date,
        start_time_slot_id,
        end_time_slot_id,
        description: description ?? "",
        voting_end_time,
        gen_meet_url: meet_url ? true : false,
        member_ids: member_infos
          .filter((m) => m.account_id)
          .map((m) => m.account_id),
        remove_guest_names: [],
        emails: [],
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
      //console.log(error);
    }
  };
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
  /******************************************************/

  /*edit meet 套組*/
  const [editMode, setEditMode] = useState(false); //是否為編輯模式
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
  const [forMemberDataFormat, setForMemberDataFormat] = useState([]); //編輯模式下已存在 member 的資料
  const [rawMeetInfo, setRawMeetInfo] = useState({}); //編輯模式的資料
  const handleMeetDataChange =
    (func, ...name) =>
    (e) => {
      //console.log(e);
      if (name.length === 1) {
        setRawMeetInfo((prev) => ({ ...prev, [name[0]]: func(e) }));
      } else {
        setRawMeetInfo((prev) => ({
          ...prev,
          [name[0]]: e ? func(e[0], 1) : null,
          [name[1]]: e ? func(e[1], 0) : null,
        }));
      }
    };
  const handleEditDone = async () => {
    try {
      await editMeet(code, cookies.token, rawMeetInfo);
      await handleMeetInfo();
      setLoading(false);
      setEditMode(false);
    } catch (error) {
      //console.log(error);
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
  }, [code, ID, exist]); //頁面 render 時 get meet info
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
  /******************************************************/

  /*leave meet 套組*/
  const [leaveOpen, setLeaveOpen] = useState(false);
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
  /******************************************************/

  /*guest name 套組*/
  const [form, setForm] = useState({ username: "", password: "" });
  const [guestNameOpen, setGuestNameOpen] = useState(false);
  const [notification, setNotification] = useState({}); //guest name 輸入失敗提示
  const handleFormChange = (name) => (e) => {
    setForm((prev) => ({ ...prev, [name]: e.target.value }));
  };
  const handleGuestVote = async () => {
    const { username, password } = form;
    const { error } = await joinMeet(code, cookies.token, {
      name: username,
      password,
    });
    //console.log(error);
    if (error) {
      setNotification({
        title: "Incorrect password",
        message: "The password you entered is incorrect.",
      });
    } else {
      navigate(`/voting/${code}`, {
        state: {
          guestName: username,
          guestPassword: password,
        },
      });
      setGuestNameOpen(false);
    }
  };
  /******************************************************/

  const handleVote = () => {
    if (!login && !location?.state?.guestName) {
      setGuestNameOpen(true);
      return;
    }
    navigate(`/voting/${code}`, {
      state: {
        guestName: location?.state?.guestName,
        guestPassword: location?.state?.guestPassword,
      },
    });
  };

  return (
    exist !== undefined &&
    (error ? (
      <Error />
    ) : (
      <motion.div
      //  {...PAGE_TRANSITION.RightSlideIn}
      >
        <Notification
          notification={notification}
          setNotification={setNotification}
        />
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
                    confirmed={confirmed}
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
                          disabled={
                            !rawMeetInfo.meet_name ||
                            !rawMeetInfo.start_date ||
                            !rawMeetInfo.end_date ||
                            !rawMeetInfo.start_time_slot_id ||
                            !rawMeetInfo.end_time_slot_id
                          }
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
                            setLeaveOpen(true);
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
            <LeaveModal
              open={leaveOpen}
              setOpen={setLeaveOpen}
              onOk={handleLeaveYes}
              host={host}
            />
            <GuestNameModal
              form={form}
              open={guestNameOpen}
              setOpen={setGuestNameOpen}
              onOk={handleGuestVote}
              handleFormChange={handleFormChange}
            />
          </Base.FullContainer>
        </Base>
      </motion.div>
    ))
  );
};

export default MeetInfo;
