import styled from "styled-components";
import "@fontsource/roboto/500.css";
import { Input, Button, DatePicker, TimePicker, Switch, Space } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import "../../css/Background.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { useMeet } from "../hooks/useMeet";
import moment from "moment";
import * as AXIOS from "../../middleware";
import Member from "./Member";
import { Header } from "../../components/Header";

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const JoinMeet = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 310px;
  left: 50%;
  top: 180px;
  transform: translate(-50%, 0);
  row-gap: 20px;
`;

const CreateMeet = styled.div`
  width: 60%;
  height: 60%;
  min-width: 300px;
  min-height: 400px;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  // border: 1px solid #D8D8D8;
  padding: 5% 10%;
`;

const CreateContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 10px;
`;

const Mainpage = () => {
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
  const navigate = useNavigate();
  const invite = useRef(null);

  const handleLogin = () => {
    navigate("/login");
  };

  const showDate = (e) => {
    if (votingButton === "hidden") {
      setVotingButton("visible");
    } else {
      setVotingButton("hidden");
    }
  };

  const handleInvite = (e) => {
    if (e?.key === "Enter" || !e.key) {
      alert(invite.current.input.value);
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
      const result = await AXIOS.addMeet(
        {
          ...meetData,
          voting_end_time: moment(
            meetData.voting_end_date + " " + meetData.voting_end_time,
            "YYYY-MM-DD HH-mm-ss"
          ).toISOString(),
        },
        cookies.token
      );
    } catch (e) {
      console.log(e);
    }
  };

  const CONTENTMENU = {
    "Event Name*": (
      <Input
        style={{ borderRadius: "5px", width: "60%" }}
        onChange={handleMeetDataChange((i) => i.target.value, "meet_name")}
      />
    ),
    "Voting Period*": (
      <RangePicker
        style={{ width: "60%" }}
        onChange={handleMeetDataChange(
          (i) => moment(i.toISOString()).format("YYYY-MM-DD"),
          "start_date",
          "end_date"
        )}
      />
    ),
    "Meet Time Period*": (
      <TimePicker.RangePicker
        style={{ width: "60%" }}
        onChange={handleMeetDataChange(
          (i, plus) => (i.hour() * 60 + i.minute()) / 30 + plus,
          "start_time_slot_id",
          "end_time_slot_id"
        )}
        minuteStep={30}
        format={"HH:mm"}
      />
    ),
    Description: (
      <TextArea
        style={{
          height: "120px",
          width: "60%",
        }}
        onChange={handleMeetDataChange((i) => i.target.value, "description")}
      />
    ),
    Member: (
      <div>
        <Member style={{ borderRadius: "5px", width: "80%" }} />
        <Button style={{ background: "#5A8EA4", color: "white" }}>+</Button>
      </div>
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

  return (
    <div className="mainContainer">
      {login && <Header />}
      <div className="leftContainer">
        <JoinMeet>
          <div
            style={{
              fontFamily: "Roboto",
              fontStyle: "normal",
              fontWeight: 500,
              fontSize: "30px",
              lineHeight: "40px",
            }}
          >
            Join Meet
          </div>
          <div
            style={{ display: "flex", alignItems: "center", columnGap: "10px" }}
          >
            <Input
              placeholder="Invite code"
              style={{
                width: "250px",
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
              onClick={handleInvite}
            />
          </div>
        </JoinMeet>
        <p className="title">Let's Meet!</p>
      </div>
      <div className="rightContainer">
        {!login ? (
          <Button
            style={{
              position: "absolutive",
              left: "90%",
              top: "3%",
              borderRadius: "15px",
              borderColor: "#FFA601",
              color: "#FFA601",
            }}
            onClick={handleLogin}
          >
            Login
          </Button>
        ) : (
          <></>
        )}
        <CreateMeet>
          <div
            style={{
              top: 0,
              left: 0,
              fontFamily: "Roboto",
              fontStyle: "normal",
              fontWeight: "500",
              fontSize: "30px",
              lineHeight: "40px",
              color: "#000000",
              marginBottom: "30px",
            }}
          >
            Create Meet
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", rowGap: "20px" }}
          >
            {Object.keys(CONTENTMENU).map((c, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  columnGap: "10%",
                }}
              >
                <div style={{ width: "200px" }}>{c}</div>
                {CONTENTMENU[c]}
              </div>
            ))}
          </div>
          <CreateContent></CreateContent>
          <Button
            style={{
              position: "absolutive",
              left: "50%",
              top: "30px",
              borderRadius: "15px",
              background: "#B3DEE5",
              transform: "translate(-50%, 0)",
            }}
            size="large"
            onClick={handleMeetCreate}
          >
            Create
          </Button>
        </CreateMeet>
      </div>
      <div className="leftFooter">
        <div>中文 | English</div>
      </div>
      <div className="rightFooter">
        <div>Copyright 2023</div>
      </div>
    </div>
  );
};

export default Mainpage;
