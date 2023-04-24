/*TODO:********************************************************************************************
  1.RWD, 畫面縮小到一定程度時 MEEET TABLE 會超出畫面。
  2. Style, hover 時的特效。
**************************************************************************************************/
import { Button, Table, ConfigProvider } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Base from "../components/Base/145MeetRelated";
import Tag from "../components/Tag";
import styled from "styled-components";
import { browseMeet } from "../middleware";
import { useMeet } from "./hooks/useMeet";
import { RWD } from "../constant";
const { RWDHeight, RWDWidth } = RWD;
const MemberTag = Tag("member");
const StatusTag = Tag("status");

const tagMap = {
  Voted: { color: "#808080", border: "1px solid #D8D8D8" },
  Confirming: { color: "#808080", border: "1px solid #D8D8D8" },
  Unvoted: { color: "#FFA601", border: "1px solid #FFA601" },
  Comfirmed: { color: "#FFA601", border: "1px solid #FFA601" },
  "Need Confirmation": {
    color: "#FFFFFF",
    border: "none",
    backgroundColor: "#FFA601",
  },
};

const customizeRenderEmpty = () => (
  <div style={{ textAlign: "center" }}>
    <p>There is no meets in your meeting list.</p>
  </div>
);

const MeetContainer = styled.div`
  width: ${RWDWidth(1488)};
  position: relative;
  top: ${RWDHeight(100)};
  display: flex;
  flex-direction: column;
  row-gap: ${RWDHeight(30)};
  thead .meetTableColumn {
    background-color: #fdf3d1 !important;
    color: #7a3e00 !important;
    border-bottom: 1px solid #7a3e00 !important;
  }
`;

const Meets = () => {
  const navigate = useNavigate();
  const { cookies, login } = useMeet();
  const [data, setData] = useState([]);
  const [isVoting, setIsVoting] = useState(true);
  const [showData, setShowData] = useState(data);

  const handleMeetInfoClick = (code) => () => {
    navigate(`/meets/${code}`);
  };

  const handleIsVote = () => {
    setIsVoting(true);
    const temp = data.filter((ele) => ele.status.includes("ote"));
    setShowData(temp);
  };

  const handleEndVote = () => {
    setIsVoting(false);
    const temp = data.filter((ele) => ele.status.includes("onfirm"));
    setShowData(temp);
  };

  useEffect(() => {
    (async () => {
      if (cookies.token) {
        const result = await browseMeet(cookies.token);
        const data = result.data.map((d) => ({
          key: d.meet_id,
          name: d.title,
          host: d.host_username,
          code: d.invite_code,
          votingPeriod: `${d.start_date.replaceAll(
            "-",
            "/"
          )} ~ ${d.end_date.replaceAll("-", "/")}`,
          status: d.status,
          meetingTime: "2023/04/15",
          url: d.meet_url ?? "https://meet.google.com/vft-xolb-mog",
        }));
        setData(data);
        setShowData(data.filter((ele) => ele.status.includes("ote"))); // default display voting
      } else {
        navigate("/");
      }
    })();
  }, [cookies]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: RWDWidth(200),
    },
    {
      title: "Host",
      dataIndex: "host",
      key: "host",
      width: RWDWidth(150),
      render: (tag) => <MemberTag>{tag}</MemberTag>,
    },
    {
      title: "Voting Period",
      dataIndex: "votingPeriod",
      key: "votingPeriod",
      width: RWDWidth(220),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: RWDWidth(200),
      render: (tag) => (
        <StatusTag key={tag} style={tagMap[tag]}>
          {tag}
        </StatusTag>
      ),
    },
    {
      title: isVoting ? "Voting Deadline" : "Meeting Time",
      dataIndex: isVoting ? "votingDeadline" : "meetingTime",
      key: isVoting ? "votingDeadline" : "meetingTime",
      width: RWDWidth(200),
    },
    {
      title: "Google Meet URL",
      dataIndex: "url",
      key: "url",
      width: RWDWidth(300),
      render: (url) => (
        <Link
          type="link"
          href={url}
          target="_blank"
          style={{ color: "black", textDecoration: "underline" }}
        >
          {url}
        </Link> // 跳轉到新的頁面
      ),
    },
    {
      title: "",
      dataIndex: "action",
      align: "right",
      render: (_, record) => (
        <Button
          type="link"
          icon={<ArrowRightOutlined />}
          style={{ color: "#D8D8D8" }}
          // onClick={handleMeetInfoClick}
        />
      ),
    },
  ].map((m) => ({ ...m, className: "meetTableColumn" }));

  return (
    <Base>
      <Base.FullContainer>
        <MeetContainer>
          <div
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                fontSize: "30px",
              }}
            >
              My Meets
            </div>
            <div
              style={{
                display: "flex",
                columnGap: RWDWidth(15),
                alignItems: "center",
              }}
            >
              <Button
                style={{
                  backgroundColor: isVoting ? "white" : "#5A8EA4",
                  color: isVoting ? "#5A8EA4" : "white",
                }}
                onClick={handleEndVote}
              >
                Ended Votes
              </Button>
              <Button
                style={{
                  backgroundColor: isVoting ? "#5A8EA4" : "white",
                  color: isVoting ? "white" : "#5A8EA4",
                }}
                onClick={handleIsVote}
              >
                Voting
              </Button>
            </div>
          </div>
          <ConfigProvider
            renderEmpty={customizeRenderEmpty}
            theme={{
              components: {
                Table: {
                  borderRadiusLG: 0,
                },
              },
            }}
          >
            <Table
              style={{ width: "100%", overflowX: "auto" }}
              dataSource={showData}
              columns={columns}
              onRow={(record) => {
                return {
                  onMouseEnter: (e) => {
                    // console.log(record);
                  },
                  onClick: handleMeetInfoClick(record.code),
                };
              }}
            ></Table>
          </ConfigProvider>
        </MeetContainer>
      </Base.FullContainer>
    </Base>
  );
};

export default Meets;
