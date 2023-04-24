/*TODO:********************************************************************************************
  1.RWD, 在頁面高度縮小時 create meet 的欄位要產生 scroll, 在小到無法容下 create button 時要浮動 button
  2.RWD, 解決 Footer 在頁面長度和高度縮小時的錯誤, 推測是由 Grid 造成的
**************************************************************************************************/
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  Input,
  Button,
  DatePicker,
  TimePicker,
  Switch,
  Modal,
  Form,
} from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import Base from "../../../components/Base/左橘3右白7";
import { useMeet } from "../../hooks/useMeet";
import moment from "moment";
import * as AXIOS from "../../../middleware";
import Member from "./Member";
import _ from "lodash";

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const JoinMeet = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  top: 16vh;
  p {
    font-style: normal;
    font-weight: 500;
    font-size: max(1.6vw, 20px);
    font-family: Roboto;
    margin: 0;
  }
  div {
    display: flex;
    align-items: center;
    column-gap: 10px;
  }
`;

const Title = styled.span`
  position: relative;
  bottom: 20%;
  font-style: normal;
  font-weight: 500;
  font-size: 4.2vw;
  color: #ffa601;
  font-family: "Lobster";
  width: fit-content;
  margin: 0;
`;

const CreateMeet = styled.div`
  width: fit-content;
  min-width: 300px;
  min-height: 400px;
  position: relative;
  left: 10%;
  top: 16vh;
  p {
    font-style: normal;
    font-weight: 500;
    font-size: max(1.6vw, 20px);
    font-family: Roboto;
    margin: 0;
    margin-bottom: 2.8vh;
  }
`;

const Mainpage = () => {
  const 追蹤LetMEET = useRef(null);
  const [width, setWidth] = useState(追蹤LetMEET?.current?.offsetWidth);
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
    "Meet Name*": (
      <Input
        style={{ borderRadius: "5px", width: "350px" }}
        onChange={handleMeetDataChange((i) => i.target.value, "meet_name")}
      />
    ),
    "Start/End Date*": (
      <RangePicker
        style={{ width: "350px" }}
        onChange={handleMeetDataChange(
          (i) => moment(i.toISOString()).format("YYYY-MM-DD"),
          "start_date",
          "end_date"
        )}
      />
    ),
    "Start/End Time*": (
      <TimePicker.RangePicker
        style={{ width: "350px" }}
        onChange={handleMeetDataChange(
          (i, plus) => (i.hour() * 60 + i.minute()) / 30 + plus,
          "start_time_slot_id",
          "end_time_slot_id"
        )}
        minuteStep={30}
        format={"HH:mm"}
      />
    ),
    Member: (
      <Member style={{ borderRadius: "5px" }} setMeetData={setMeetData} />
    ),
    Description: (
      <TextArea
        style={{
          height: "120px",
          width: "400px",
        }}
        onChange={handleMeetDataChange((i) => i.target.value, "description")}
      />
    ),
    "Voting Deadline": (
      <div style={{ columnGap: "10%" }}>
        <Switch onChange={showDate} />
        <DatePicker
          style={{ visibility: votingButton }}
          onChange={handleMeetDataChange(
            (i) => moment(i.toISOString()).format("YYYY-MM-DD"),
            "voting_end_date"
          )}
        />
        <TimePicker
          style={{ visibility: votingButton }}
          // name="Voting Deadline Time"
          onChange={handleMeetDataChange(
            (i) => moment(i.toISOString()).format("HH-mm-ss"),
            "voting_end_time"
          )}
        />
      </div>
    ),
    "Google Meet URL": (
      <Switch
        disabled={!login}
        onChange={handleMeetDataChange((i) => i, "gen_meet_url")}
      />
    ),
  };

  const leftChild = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <JoinMeet>
        <p>Join Meet</p>
        <div style={{ maxWidth: width }}>
          <Input
            placeholder="Invitation code"
            style={{
              width: "13vw",
              height: "45px",
              borderRadius: "15px",
            }}
            ref={invite}
            onKeyDown={handleInvite}
          />
          <Button
            type="primary"
            icon={<ArrowRightOutlined />}
            size={"large"}
            style={{
              background: "#FFD466",
            }}
          />
        </div>
      </JoinMeet>
      <Title ref={追蹤LetMEET}>Let's meet</Title>
    </div>
  );

  const rightChild = (
    <>
      <CreateMeet>
        <p style={{}}>Create Meet</p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            rowGap: "3vh",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: "1.9vh",
            }}
          >
            {Object.keys(CONTENTMENU).map((c, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <div style={{ width: "200px" }}>{c}</div>
                {CONTENTMENU[c]}
              </div>
            ))}
          </div>
          <Button
            style={{
              borderRadius: "50px",
              background: "#B3DEE5",
              borderColor: "#B3DEE5",
              fontWeight: "bold",
              height: "7vmin",
              width: "16.5vmin",
              maxHeight: "55px",
              maxWidth: "130px",
            }}
            size="large"
            onClick={handleMeetCreate}
          >
            Create
          </Button>
        </div>
      </CreateMeet>
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
    </>
  );

  const throttledHandleResize = _.throttle(() => {
    console.log("Hi");
    setWidth(追蹤LetMEET?.current?.offsetWidth);
  }, 500);

  useEffect(() => {
    window.addEventListener("resize", throttledHandleResize);
    return () => {
      window.removeEventListener("resize", throttledHandleResize);
    };
  }, []);

  return (
    <Base
      leftchild={leftChild}
      rightChild={rightChild}
      title_disable={true}
      header={{ show: true, login }}
    ></Base>
  );
};

export default Mainpage;
