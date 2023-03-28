import "./App.css";
import styled from "styled-components";
import "@fontsource/roboto/500.css";
import { Input, Button, DatePicker, Space } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;
const CONTENTMENU = {
  "Event Name": <Input style={{ borderRadius: "15px" }} />,
  "Voting Period": <RangePicker />,
};

const AppContainer = styled.div`
  height: 1080px;
  width: 1920px;
  * {
    margin: 0;
  }
  /* position: fixed; */
  overflow-wrap: break-word;
  display: flex;
  justify-content: center;
`;

const Cover = styled.div`
  position: absolute;
  width: 640px;
  height: 1080px;
  left: 0px;
  top: 0px;
  background: #fefcef;
`;

const JoinMeet = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 310px;
  left: 100px;
  top: 180px;
  row-gap: 20px;
`;

const Footer = styled.div`
  position: relative;
  width: 1720px;
  height: 22px;
  /* bottom: 20px; */
  top: 1023px;
  display: flex;
  justify-content: space-between;
  * {
    font-family: "Roboto";
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    color: #808080;
  }
`;

const Title = styled.div`
  position: absolute;
  left: 100px;
  top: 852px;
  /* bottom: 150px; */
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 80px;
  line-height: 46px;
  color: #ffa601;
`;

const CreateMeet = styled.div`
  position: absolute;
  width: 594px;
  height: 616px;
  left: 760px;
  top: 180px;
`;

const CreateContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 10px;
`;

function App() {
  return (
    <AppContainer>
      <Cover>
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
      </Cover>
      <Title>Let's Meet!</Title>
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
          }}
        >
          Create Meet
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", rowGap: "10px" }}
        >
          {Object.keys(CONTENTMENU).map((c, index) => (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                columnGap: "10px",
              }}
            >
              <div style={{ textAlign: "right", width: "500px" }}>{c}</div>
              {CONTENTMENU[c]}
            </div>
          ))}
        </div>

        <CreateContent></CreateContent>
      </CreateMeet>
      <Footer>
        <div>中文 | English</div>
        <div>Copyright 2023</div>
      </Footer>
    </AppContainer>
  );
}

export default App;
