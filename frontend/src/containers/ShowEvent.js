import styled from "styled-components";
import "@fontsource/roboto/500.css";
import { Input, Button, Modal, Form } from "antd";
import "../css/Background.css";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Header, Header2 } from "../components/Header";

let showList = [
  [
    { date: "May 19Wed", time: "9:00", availableNum: 0 },
    { date: "12/8", time: "9:00", availableNum: 0 },
    { date: "12/9", time: "9:00", availableNum: 0 },
  ],
  [
    { date: "12/7", time: "9:30", availableNum: 0 },
    { date: "12/8", time: "9:30", availableNum: 0 },
    { date: "12/9", time: "9:30", availableNum: 0 },
  ],
  [
    { date: "12/7", time: "10:00", availableNum: 0 },
    { date: "12/8", time: "10:00", availableNum: 0 },
    { date: "12/9", time: "10:00", availableNum: 0 },
  ],
  [
    { date: "12/7", time: "10:30", availableNum: 1 },
    { date: "12/8", time: "10:30", availableNum: 0 },
    { date: "12/9", time: "10:30", availableNum: 0 },
  ],
  [
    { date: "12/7", time: "11:00", availableNum: 1 },
    { date: "12/8", time: "11:00", availableNum: 0 },
    { date: "12/9", time: "11:00", availableNum: 0 },
  ],
  [
    { date: "12/7", time: "11:30", availableNum: 1 },
    { date: "12/8", time: "11:30", availableNum: 0 },
    { date: "12/9", time: "11:30", availableNum: 0 },
  ],
  [
    { date: "12/7", time: "12:00", availableNum: 1 },
    { date: "12/8", time: "12:00", availableNum: 2 },
    { date: "12/9", time: "12:00", availableNum: 0 },
  ],
  [
    { date: "12/7", time: "12:30", availableNum: 0 },
    { date: "12/8", time: "12:30", availableNum: 2 },
    { date: "12/9", time: "12:30", availableNum: 0 },
  ],
  [
    { date: "12/7", time: "13:00", availableNum: 0 },
    { date: "12/8", time: "13:00", availableNum: 2 },
    { date: "12/9", time: "13:00", availableNum: 0 },
  ],
  [
    { date: "12/7", time: "13:30", availableNum: 0 },
    { date: "12/8", time: "13:30", availableNum: 2 },
    { date: "12/9", time: "13:30", availableNum: 0 },
  ],
  [
    { date: "12/7", time: "14:00", availableNum: 0 },
    { date: "12/8", time: "14:00", availableNum: 3 },
    { date: "12/9", time: "14:00", availableNum: 0 },
  ],
  [
    { date: "12/7", time: "14:30", availableNum: 0 },
    { date: "12/8", time: "14:30", availableNum: 3 },
    { date: "12/9", time: "14:30", availableNum: 0 },
  ],
  [
    { date: "12/7", time: "15:00", availableNum: 0 },
    { date: "12/8", time: "15:00", availableNum: 3 },
    { date: "12/9", time: "15:00", availableNum: 0 },
  ],
  [
    { date: "12/7", time: "15:30", availableNum: 0 },
    { date: "12/8", time: "15:30", availableNum: 1 },
    { date: "12/9", time: "15:30", availableNum: 0 },
  ],
  [
    { date: "12/7", time: "16:00", availableNum: 0 },
    { date: "12/8", time: "16:00", availableNum: 1 },
    { date: "12/9", time: "16:00", availableNum: 0 },
  ],
  [
    { date: "12/7", time: "16:30", availableNum: 0 },
    { date: "12/8", time: "16:30", availableNum: 0 },
    { date: "12/9", time: "16:30", availableNum: 0 },
  ],
  [
    { date: "12/7", time: "17:00", availableNum: 0 },
    { date: "12/8", time: "17:00", availableNum: 0 },
    { date: "12/9", time: "17:00", availableNum: 0 },
  ],
  [
    { date: "12/7", time: "17:30", availableNum: 0 },
    { date: "12/8", time: "17:30", availableNum: 0 },
    { date: "12/9", time: "17:30", availableNum: 0 },
  ],
  [
    { date: "12/7", time: "18:00", availableNum: 0 },
    { date: "12/8", time: "18:00", availableNum: 0 },
    { date: "12/9", time: "18:00", availableNum: 0 },
  ],
  [
    { date: "12/7", time: "18:30", availableNum: 0 },
    { date: "12/8", time: "18:30", availableNum: 0 },
    { date: "12/9", time: "18:30", availableNum: 0 },
  ],
  [
    { date: "12/7", time: "19:00", availableNum: 0 },
    { date: "12/8", time: "19:00", availableNum: 0 },
    { date: "12/9", time: "19:00", availableNum: 0 },
  ],
  [
    { date: "12/7", time: "19:30", availableNum: 0 },
    { date: "12/8", time: "19:30", availableNum: 0 },
    { date: "12/9", time: "19:30", availableNum: 0 },
  ],
  [
    { date: "12/7", time: "20:00", availableNum: 0 },
    { date: "12/8", time: "20:00", availableNum: 1 },
    { date: "12/9", time: "20:00", availableNum: 0 },
  ],
  [
    { date: "12/7", time: "20:30", availableNum: 1 },
    { date: "12/8", time: "20:30", availableNum: 1 },
    { date: "12/9", time: "20:30", availableNum: 0 },
  ],
  [
    { date: "12/7", time: "21:00", availableNum: 1 },
    { date: "12/8", time: "21:00", availableNum: 0 },
    { date: "12/9", time: "21:00", availableNum: 0 },
  ],
  [
    { date: "12/7", time: "21:30", availableNum: 0 },
    { date: "12/8", time: "21:30", availableNum: 2 },
    { date: "12/9", time: "21:30", availableNum: 0 },
  ],
  [
    { date: "12/7", time: "22:00", availableNum: 0 },
    { date: "12/8", time: "22:00", availableNum: 0 },
    { date: "12/9", time: "22:00", availableNum: 0 },
  ],
  [
    { date: "12/7", time: "22:30", availableNum: 0 },
    { date: "12/8", time: "22:30", availableNum: 0 },
    { date: "12/9", time: "22:30", availableNum: 0 },
  ],
];

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

const ShowEvent = () => {
  const [isLogin, setIsLogin] = useState(true); // 如果login會顯示header，沒有的話會顯示login
<<<<<<< Updated upstream
  const [isModalLeaveOpen, setIsModalLeaveOpen] = useState(false);
  const [isModalVoteOpen, setIsModalVoteOpen] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
=======
  const navigate = useNavigate();
>>>>>>> Stashed changes

  const handleMeet = () => {
    navigate("/meets");
  };

<<<<<<< Updated upstream
  const showLeaveModal = () => {
    setIsModalLeaveOpen(true);
  };
  const handleLeaveOk = () => {
    setIsModalLeaveOpen(false);
  };
  const handleLeaveCancel = () => {
    setIsModalLeaveOpen(false);
  };

  const showVoteModal = () => {
    setIsModalVoteOpen(true);
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

=======
  const handleShow = (i, j) => {
    // setAvaList(showList[i][j].availablePpl);
    // setNotAvaList(showList[i][j].notAvailablePpl);
  };

  const chooseColor = (num) => {
    // return addHexColor("F0F0F0", ((Math.max(num-1, 0)*3635)+984028).toString(16));
    if (num === 0) return "f0f0f0";
    else return addHexColor("FFF4CC", ((num - 1) * 3635).toString(16));
  };

>>>>>>> Stashed changes
  const meetInfo = {
    EventName: "SDM Class",
    Date: "2023/01/03 ~ 2023/02/03",
    Time: "09:00~18:00",
    Host: "Luisa",
    Memeber: ["Luisa", "Tom", "Jerry"],
    Description: "None",
    "Voting Deadline": "None",
    "Invitation URL": "http://xxx",
    "Google Meet URL": "http://ppp",
  };

  return (
    <div className="meetMainContainer">
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
<<<<<<< Updated upstream
            onClick={showLeaveModal}
          >
            Leave Meet
          </Button>
          <Button style={{ marginTop: "35px" }} onClick={showVoteModal}>
            Vote
          </Button>
=======
          >
            Leave Meet
          </Button>
          <Button style={{ marginTop: "35px" }}>Vote</Button>
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
>>>>>>> Stashed changes
      </div>
      <div className="leftFooter" style={{ background: "white" }}>
        <div>中文 | English</div>
      </div>
      <div className="rightFooter">
        <div>Copyright 2023</div>
      </div>
    </div>
  );
};

export default ShowEvent;
