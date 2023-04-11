import styled from "styled-components";
import "@fontsource/roboto/500.css";
import { Input, Button, Modal, Form } from "antd";
import "../css/Background.css";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useMeet } from "./hooks/useMeet";
import { Header, Header2 } from "../components/Header";

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

const CreateMeet = styled.div`
  width: 70%;
  height: 70%;
  min-width: 500px;
  min-height: 500px;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  // border: 1px solid #D8D8D8;
  padding: 5% 0%;
`;

const FormWrapper = styled.div`
  width: 60%;
  height: 60%;
  min-width: 500px;
  min-height: 500px;
  position: relative;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
  // border: 1px solid #D8D8D8;
  padding: 5% 0%;
`;

const addHexColor = (c1, c2) => {
  var hexStr = (parseInt(c1, 16) - parseInt(c2, 16)).toString(16);
  while (hexStr.length < 6) {
    hexStr = "0" + hexStr;
  } // Zero pad.
  return hexStr;
};

const MeetInfo = () => {
  const [isLogin, setIsLogin] = useState(true); // 如果login會顯示header，沒有的話會顯示login
  const [isModalLeaveOpen, setIsModalLeaveOpen] = useState(false);
  const [isModalVoteOpen, setIsModalVoteOpen] = useState(false);
  const { login } = useMeet();
  const navigate = useNavigate();
  const {
    state: { meetInfo },
  } = useLocation();
  const [form] = Form.useForm();

  const handleMeet = () => {
    navigate("/meets");
  };

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
    if (!login) {
      setIsModalVoteOpen(true);
    }
    navigate("/voting");
  };
  const handleVoteOk = () => {
    setIsModalVoteOpen(false);
  };
  const handleVoteCancel = () => {
    setIsModalVoteOpen(false);
  };

  const handleShow = (i, j) => {
    // setAvaList(showList[i][j].availablePpl);
    // setNotAvaList(showList[i][j].notAvailablePpl);
  };

  const chooseColor = (num) => {
    // return addHexColor("F0F0F0", ((Math.max(num-1, 0)*3635)+984028).toString(16));
    if (num === 0) return "f0f0f0";
    else return addHexColor("FFF4CC", ((num - 1) * 3635).toString(16));
  };

  return (
    <>
      {isLogin ? <Header location="timeslot" /> : <Header2 />}
      <div className="leftContainer" style={{ background: "white" }}>
        <CreateMeet>
          <Button
            icon={<ArrowLeftOutlined />}
            style={{ marginBottom: "20px" }}
            onClick={handleMeet}
          ></Button>
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
            {meetInfo.EventName}
          </div>
          {/* <div style={{ display: "flex", flexDirection: "column", rowGap: "20px" }}>
                    <div style={{display: "flex", alignItems: "center", columnGap: "10%",
                }}>Start/End Date<div>{meetInfo.Date}</div></div>
                </div> */}
          <div
            style={{ display: "flex", flexDirection: "column", rowGap: "30px" }}
          >
            {Object.keys(meetInfo).map((c, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  columnGap: "10%",
                }}
              >
                <div style={{ width: "200px", fontSize: "20px" }}>{c}</div>
                <div style={{ fontSize: "16px" }}>{meetInfo[c]}</div>
              </div>
            ))}
          </div>
          <Button
            style={{ marginLeft: "65%", marginTop: "35px", marginRight: "5px" }}
            onClick={showLeaveModal}
          >
            Leave Meet
          </Button>
          <Button style={{ marginTop: "35px" }} onClick={handleVote}>
            Vote
          </Button>
        </CreateMeet>
      </div>
      <div className="rightContainer">
        <FormWrapper>
          <div
            style={{
              fontFamily: "Roboto",
              fontWeight: "500",
              fontSize: "20px",
              position: "absolute",
              left: "50%",
              transform: "translate(-50%, 0%)",
            }}
          >
            Group Avaiability
          </div>
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "15%",
              transform: "translate(-50%, 0%)",
            }}
          >
            <div className="cellIntroBlock">
              {showList.length !== 0 ? (
                showList[0].map((item, j) => (
                  <div className="cellIntro" key={j}>
                    {item.date.slice(0, 6)}
                  </div>
                ))
              ) : (
                <></>
              )}
            </div>
            <div className="cellIntroBlock">
              {showList.length !== 0 ? (
                showList[0].map((item, j) => (
                  <div className="cellIntro" key={j}>
                    {item.date.slice(6, 9)}
                  </div>
                ))
              ) : (
                <></>
              )}
            </div>
            {showList.map((items, i) => (
              <div key={"row" + i} id={"row" + i} style={{ display: "flex" }}>
                <div className="cellIntro">{items[0].time}</div>
                {items.map((item, j) => (
                  // <div className='cell' key={j} id={j} date={item.date} time={item.time}
                  // available={item.availableNum} onMouseOver={() => handleShow(i, j)}
                  // style={{ backgroundColor: "#"+chooseColor(item.availableNum) }}></div>
                  <div
                    className="cell"
                    key={j}
                    id={j}
                    date={item.date}
                    time={item.time}
                    available={item.availableNum}
                    style={{
                      backgroundColor: "#" + chooseColor(item.availableNum),
                    }}
                  ></div>
                ))}
              </div>
            ))}
          </div>
        </FormWrapper>
        <Modal
          title="Are you sure you want to leave this meet?"
          style={{ fontFamily: "Nunito" }}
          open={isModalLeaveOpen}
          onOk={handleLeaveOk}
          onCancel={handleLeaveCancel}
          okText="Yes"
          cancelText="No"
        ></Modal>
        <Modal
          title=""
          style={{ fontFamily: "Nunito" }}
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
              <Input />
            </Form.Item>
          </Form>
          {/* <Input
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
                /> */}
        </Modal>
      </div>
    </>
  );
};

export default MeetInfo;
