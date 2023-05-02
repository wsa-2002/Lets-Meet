/*TODO:********************************************************************************************
  1.RWD, 在頁面高度縮小時 create meet 的欄位要產生 scroll, 在小到無法容下 create button 時要浮動 button
  2.RWD, 解決 Footer 在頁面長度和高度縮小時的錯誤, 推測是由 Grid 造成的
  3.功能, 供選擇 23:59
**************************************************************************************************/
import React, { useRef, useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  Button as AntdButton,
  Input,
  DatePicker,
  TimePicker,
  Switch,
  Modal,
  Form,
  Tooltip,
} from "antd";
import { ArrowRightOutlined, InfoCircleOutlined } from "@ant-design/icons";
import Base from "../../../components/Base/orange3_white7";
import Button from "../../../components/Button";
import Title from "../../../components/Title";
import { useMeet } from "../../hooks/useMeet";
import moment from "moment";
import * as AXIOS from "../../../middleware";
import Member from "./Member";
import _ from "lodash";
import { RWD } from "../../../constant";
import { useTranslation } from 'react-i18next';
const { RWDHeight, RWDFontSize, RWDWidth, RWDRadius } = RWD;
const {
  RightContainer: { CreateMeet },
  RightContainer: {
    CreateMeet: { Content },
  },
} = Base;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const PrimaryButton = Button();

const JoinMeet = Object.assign(
  styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    row-gap: ${RWDHeight(20)};
    top: ${RWDHeight(180)};
  `,
  {
    Title: styled.p`
      font-size: ${RWDFontSize(30)}; //max(1.6vw, 20px);
      font-weight: bold;
      margin: 0;
    `,
    InvitationArea: Object.assign(
      styled.div`
        display: flex;
        align-items: center;
        column-gap: ${RWDWidth(10)};
      `,
      {
        Input: styled(Input)`
          width: ${RWDWidth(250)};
          height: ${RWDHeight(45)};
          border-radius: ${RWDRadius(10)};
          font-size: ${RWDFontSize(16)};
        `,
        Button: styled(AntdButton)`
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #ffd466;
          width: ${RWDFontSize(50)};
          height: ${RWDFontSize(45)};
          font-size: ${RWDFontSize(16)};
        `,
      }
    ),
  }
);

const Mainpage = () => {
  const ref = useRef(null); //追蹤LetMEET
  const { t } = useTranslation();
  const [width, setWidth] = useState(ref?.current?.offsetWidth);
  const [votingButton, setVotingButton] = useState("hidden");
  const [meetData, setMeetData] = useState({
    meet_name: "",
    start_date: "",
    end_date: "",
    start_time_slot_id: 0,
    end_time_slot_id: 0,
    gen_meet_url: false,
    description: "",
    member_ids: [],
    emails: [],
  });
  const { login, cookies } = useMeet();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const invite = useRef(null);
  const [form] = Form.useForm();

  const showDate = () => {
    if (votingButton === "hidden") {
      setVotingButton("visible");
    } else {
      setVotingButton("hidden");
    }
  };

  const handleInvite = async (e) => {
    if (e?.key === "Enter" || !e.key) {
      if (cookies.token) {
        await AXIOS.joinMeet(
          { invite_code: invite.current.input.value },
          cookies.token
        );
      }
      navigate(`/meets/${invite.current.input.value}`);
    }
  };

  const handleMeetDataChange =
    (func, ...name) =>
    (e) => {
      if (name.length === 1) {
        setMeetData((prev) => ({ ...prev, [name[0]]: func(e) }));
      } else {
        setMeetData((prev) => ({
          ...prev,
          [name[0]]: func(e[0], 1),
          [name[1]]: func(e[1], 0),
        }));
      }
    };

  const handleMeetCreate = async () => {
    try {
      if (!login) {
        setIsModalOpen(true);
        return;
      }
      let temp = {
        ...meetData,
        voting_end_time: moment(
          meetData.voting_end_date + " " + meetData.voting_end_time,
          "YYYY-MM-DD HH-mm-ss"
        ).toISOString(),
      };
      delete temp["voting_end_date"];
      const { data } = await AXIOS.addMeet(temp, cookies.token);
      navigate(`/meets/${data.invite_code}`);
    } catch (e) {
      console.log(e);
    }
  };

  const handleOk = async () => {
    // 你這邊再加上ok後要做的動作
    try {
      if (!form.getFieldValue().name) return;
      const { data } = await AXIOS.addMeet(
        {
          ...meetData,
          guest_name: form.getFieldValue().name,
          voting_end_time: moment(
            meetData.voting_end_date + " " + meetData.voting_end_time,
            "YYYY-MM-DD HH-mm-ss"
          ).toISOString(),
        },
        cookies.token
      );
      // console.log(data.id);
      navigate(`/meets/${data.invite_code}`, {
        state: { guestName: form.getFieldValue().name },
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const CONTENTMENU = {
    "Meet Name": (
      <Input
        style={{ ...Content.Input }}
        onChange={handleMeetDataChange((i) => i.target.value, "meet_name")}
        data-required={true}
      />
    ),
    "Start/End Date": (
      <RangePicker
        style={{ ...Content.Range }}
        onChange={handleMeetDataChange(
          (i) => moment(i.toISOString()).format("YYYY-MM-DD"),
          "start_date",
          "end_date"
        )}
        data-required={true}
      />
    ),
    "Start/End Time": (
      <TimePicker.RangePicker
        style={{ ...Content.Range }}
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
      <Member style={{ borderRadius: "5px" }} setMeetData={setMeetData} />
    ),
    Description: (
      <TextArea
        style={{ ...Content.TextArea }}
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
        <Switch onChange={showDate} />
        <DatePicker
          style={{ ...Content.Picker }}
          onChange={handleMeetDataChange(
            (i) => moment(i.toISOString()).format("YYYY-MM-DD"),
            "voting_end_date"
          )}
        />
        <TimePicker
          style={{ ...Content.Picker }}
          onChange={handleMeetDataChange(
            (i) => moment(i.toISOString()).format("HH-mm-ss"),
            "voting_end_time"
          )}
        />
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

  const CONTENTNAME = {
    "Meet Name": t("meetName"),
    "Start/End Date": t("startDate"),
    "Start/End Time": t("startTime"),
    Member: t("member"),
    Description: t("description"),
    "Voting Deadline": t("votingDeadline"),
    "Google Meet URL": t("url")
  }

  const throttledHandleResize = _.throttle(() => {
    setWidth(ref?.current?.offsetWidth);
  }, 500);

  useEffect(() => {
    window.addEventListener("resize", throttledHandleResize);
    return () => {
      window.removeEventListener("resize", throttledHandleResize);
    };
  }, []);

  return (
    <Base title_disable={true} header={{ show: true, login }}>
      <Base.LeftContainer
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <JoinMeet>
          <JoinMeet.Title>{t("joinMeet")}</JoinMeet.Title>
          <JoinMeet.InvitationArea style={{ maxWidth: width }}>
            <JoinMeet.InvitationArea.Input
              placeholder={t("invitation")}
              ref={invite}
              onKeyDown={handleInvite}
            />
            <JoinMeet.InvitationArea.Button
              type="primary"
              icon={<ArrowRightOutlined />}
            />
          </JoinMeet.InvitationArea>
        </JoinMeet>
        <Title ref={ref} style={{ position: "relative", bottom: "20%" }}>
          Let's meet
        </Title>
      </Base.LeftContainer>
      <Base.RightContainer
        style={{ justifyContent: "flex-start", flexDirection: "column" }}
      >
        <CreateMeet style={{ alignSelf: "flex-start" }}>
          <CreateMeet.Title>{t("createMeet")}</CreateMeet.Title>
          {Object.keys(CONTENTMENU).map((title, index) => (
            <Fragment key={index}>
              <CreateMeet.Content
                style={{
                  gridColumn: "1/2",
                  gridRow: `${index + 2}/${index + 3}`,
                  alignSelf:
                    (title === "Description" || title === "Member") &&
                    "flex-start",
                  columnGap: RWDWidth(4),
                }}
              >
                <div>{CONTENTNAME[title]}</div>
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
                        fontSize: "bold",
                      }}
                    />
                  </Tooltip>
                )}
              </CreateMeet.Content>
              <CreateMeet.Content
                style={{
                  gridColumn: "2/3",
                  gridRow: `${index + 2}/${index + 3}`,
                  fontWeight: "normal",
                }}
              >
                {CONTENTMENU[title]}
              </CreateMeet.Content>
            </Fragment>
          ))}
        </CreateMeet>
        <PrimaryButton
          style={{ position: "relative", top: RWDHeight(8) }}
          onClick={handleMeetCreate}
        >
          {t("create")}
        </PrimaryButton>
      </Base.RightContainer>
      <Modal
        title=""
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Ok"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical" name="form_in_modal">
          <Form.Item
            name="name"
            label="Please enter your name"
            rules={[
              {
                required: true,
                message: "Error: Please enter your name!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Base>
  );
};

export default Mainpage;
