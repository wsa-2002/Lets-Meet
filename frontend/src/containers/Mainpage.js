import styled from "styled-components";
import "@fontsource/roboto/500.css";
import { Input, Button, DatePicker, TimePicker, Switch, Space } from "antd";
import { ArrowRightOutlined, LogoutOutlined } from "@ant-design/icons";
import "../css/Background.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {Header} from "../components/Header";

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
  const [isLogin, setIsLogin] = useState(true); // 如果login會顯示header，沒有的話會顯示login
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  }

  const showDate = () => {
    if(votingButton === "hidden")
      setVotingButton("visible");
    else
      setVotingButton("hidden");
  }

  const CONTENTMENU = {
    "Event Name*": <Input style={{ borderRadius: "5px", width: "60%" }} />,
    "Voting Period*": <RangePicker style={{ width: "60%" }}/>,
    "Meet Time Period*": <TimePicker.RangePicker  style={{ width: "60%" }}/>,
    "Description": <TextArea
                    style={{
                      height: "120px",
                      width: "60%",
                    }}
                  />,
    "Member": <div><Input style={{ borderRadius: "5px", width: "80%" }} />
                <Button style={{ background: "#5A8EA4", color: "white" }}>+</Button></div>,
    "Voting Deadline": <div style={{ columnGap: "10%"}}><Switch onChange={showDate}/>
                        <DatePicker style={{visibility: votingButton}}/>
                        <TimePicker style={{visibility: votingButton}}/></div>,
    "Google Meet URL": <Switch disabled={true}/>
  };

  return (
    <div className="mainContainer">
      {isLogin ? <Header/>: <></>}
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
        <p className="title">Let's Meet!</p>
      </div>
      <div className="rightContainer">
        {!isLogin ? <Button style={{position: "absolutive", left: "90%", top: "3%", borderRadius: "15px",
             borderColor: "#FFA601", color: "#FFA601"}} onClick={handleLogin}>Login</Button> : <></>}
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
              <div key={index}
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
          <Button style={{position: "absolutive", left: "50%", top: "30px", borderRadius: "15px",
              background: "#B3DEE5", transform: "translate(-50%, 0)"}} size="large">Create</Button>
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
}

export default Mainpage;