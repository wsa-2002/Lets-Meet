import { Button, Table, Tag } from "antd";
import "../css/Background.css";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Header, Header2 } from "../components/Header";
import { browseMeet } from "../middleware";
import { useMeet } from "./hooks/useMeet";
const { Column } = Table;

const tagMap = {
  Voted: "#FFA601",
  unVoted: "#D8D8D8",
  Comfirming: "#D8D8D8",
  Comfirmed: "#FFA601",
};

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
          )}-${d.end_date.replaceAll("-", "/")}`,
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
      width: 200,
      className: "meetTableColumn",
    },
    {
      title: "Host",
      dataIndex: "host",
      key: "host",
      width: 150,
      className: "meetTableColumn",
    },
    {
      title: "Voting Period",
      dataIndex: "votingPeriod",
      key: "votingPeriod",
      width: 220,
      className: "meetTableColumn",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 200,
      className: "meetTableColumn",
      render: (tag) => (
        <>
          <Tag color={tagMap[tag]} key={tag}>
            {tag}
          </Tag>
        </>
      ),
    },
    {
      title: isVoting ? "Voting Deadline" : "Meeting Time",
      dataIndex: isVoting ? "votingDeadline" : "meetingTime",
      key: isVoting ? "votingDeadline" : "meetingTime",
      width: 200,
      className: "meetTableColumn",
    },
    {
      title: "Google Meet URL",
      dataIndex: "url",
      key: "url",
      className: "meetTableColumn",
      render: (tag) => (
        <Link type="link" href={tag} target="_blank" style={{ color: "black" }}>
          {tag}
        </Link> // 跳轉到新的頁面
      ),
    },
    {
      title: "",
      dataIndex: "action",
      className: "meetTableColumn",
      render: (_, record) => (
        <Button
          type="link"
          icon={<ArrowRightOutlined />}
          style={{ color: "#D8D8D8" }}
          // onClick={handleMeetInfoClick}
        />
      ),
    },
  ];

  return (
    <>
      {login ? <Header location="meet" /> : <Header2 />}
      <div className="wholeContainer">
        <div className="meetTableHeader">
          <div
            style={{
              // fontStyle: "normal",
              fontWeight: "700",
              fontSize: "30px",
              float: "left",
              marginLeft: 145,
              marginTop: "4.5%",
            }}
          >
            My Meets
          </div>
          <div style={{ marginTop: "5%", marginRight: 145 }}>
            <Button
              style={{
                float: "right",
                marginLeft: "10px",
                backgroundColor: isVoting ? "white" : "#5A8EA4",
                color: isVoting ? "#5A8EA4" : "white",
              }}
              onClick={handleEndVote}
            >
              Ended Votes
            </Button>
            <Button
              style={{
                float: "right",
                backgroundColor: isVoting ? "#5A8EA4" : "white",
                color: isVoting ? "white" : "#5A8EA4",
              }}
              onClick={handleIsVote}
            >
              Voting
            </Button>
          </div>
        </div>
        {
          <Table
            style={{ width: 1200, marginTop: "8%" }}
            dataSource={showData}
            className="meetTable"
            columns={columns}
            onRow={(record) => {
              console.log(record);
              return {
                onClick: handleMeetInfoClick(record.code),
              };
            }}
          ></Table>
        }
      </div>
    </>
  );
};

export default Meets;
