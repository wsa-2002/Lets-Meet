import { Input, Button, DatePicker, TimePicker, Space, Table, Tag } from "antd";
import "../css/Background.css";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Header, Header2 } from "../components/Header";
import { browseMeet, meetInfo } from "../middleware";
import { useMeet } from "./hooks/useMeet";
import moment from "moment";

const { Column, ColumnGroup } = Table;

const tagMap = {
  Voted: "#FFA601",
  unVoted: "#D8D8D8",
  Comfirming: "#D8D8D8",
  Comfirmed: "#FFA601",
};

// const tempData = [
//     {
//         name: "SDM",
//         host: "Luisa",
//         votingPeriod: "2023/03/24-2023/04/01",
//         status: "Voted",
//         votingDeadline: "xx/xx/xx",
//         url: "https://meet.google.com/rcb-ffqt-xbn",
//     },
//     {
//         name: "SDM",
//         host: "Lisa",
//         votingPeriod: "2023/03/24-2023/04/01",
//         status: "Unvoted",
//         votingDeadline: "xx/xx/xx",
//         url: "https://meet.google.com/rcb-ffqt-xbn",
//     },
//     {
//         name: "SDM",
//         host: "Luisa",
//         votingPeriod: "2023/03/24-2023/04/01",
//         status: "Comfirmed",
//         meetingTime: "xx/xx/xx",
//         url: "https://meet.google.com/rcb-ffqt-xbn",
//         filterd: true,
//     },
// ];

const Meets = () => {
  const navigate = useNavigate();
  const { cookies, login } = useMeet();
  const [data, setData] = useState([]);
  const [isVoting, setIsVoting] = useState(true);
  const [showData, setShowData] = useState(data);

  const handleMeetInfoClick = (meet_id) => async () => {
    try {
      const { data, error } = await meetInfo(meet_id, cookies.token);
      // console.log(result);
      navigate(`/meets/${meet_id}`, {
        state: {
          meetInfo: {
            EventName: data.meet_name,
            Date:
              data.start_date.replaceAll("-", "/") +
              "~" +
              data.end_date.replaceAll("-", "/"),
            Time: slotIDProcessing(
              data.start_time_slot_id,
              data.end_time_slot_id
            ), //  (data.start_time_slot_id - 1) * 30 % 60
            Host: data.host_info.name ?? data.host_info.id,
            Memeber: data.member_infos.map((m) => m.username).toString(),
            Description: data.description,
            "Voting Deadline": data.voting_end_time
              ? moment(data.voting_end_time).format("YYYY/MM/DD HH:mm:ss")
              : "not assigned",
            "Invitation URL": `https://lets.meet.com?invite=${data.invite_code}`,
            "Google Meet URL":
              data.meet_url ?? "https://meet.google.com/vft-xolb-mog",
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const slotIDProcessing = (start, end) => {
    let hour = String(parseInt(((start - 1) * 30) / 60));
    const startHour = "0".repeat(2 - hour.length) + hour;
    const startMinute = parseInt(((start - 1) * 30) % 60) ? "30" : "00";
    hour = String(parseInt((end * 30) / 60));
    const endHour = "0".repeat(2 - hour.length) + hour;
    const endMinute = parseInt((end * 30) % 60) ? "30" : "00";
    return `${startHour}:${startMinute}~${endHour}:${endMinute}`;
  };

    const handleIsVote = () => {
        setIsVoting(true);
        const temp = data.filter((ele) => ele.status.includes("ote"));
        setShowData(temp);
    }

    const handleEndVote = () => {
        setIsVoting(false);
        const temp = data.filter((ele) => ele.status.includes("onfirm"));
        setShowData(temp);
    }

  useEffect(() => {
    (async () => {
      if (cookies.token) {
        const result = await browseMeet(cookies.token);
        const data = result.data.map((d) => ({
          key: d.meet_id,
          name: d.title,
          host: d.host_username,
          votingPeriod: `${d.start_date.replaceAll(
            "-",
            "/"
          )}-${d.end_date.replaceAll("-", "/")}`,
          status: d.status,
          meetingTime: "2023/04/15",
          url: d.meet_url ?? "https://meet.google.com/vft-xolb-mog",
        }))
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
            dataIndex:"name",
            key: "name"
        },
        {
            title: "Host",
            dataIndex:"host",
            key: "host"
        },
        {
            title: "Voting Period",
            dataIndex:"votingPeriod",
            key: "votingPeriod"
        },
        {
            title: "Status",
            dataIndex:"status",
            key: "status",
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
            dataIndex:isVoting ? "votingDeadline" : "meetingTime",
            key: isVoting ? "votingDeadline" : "meetingTime"
        },
        {
            title: "Google Meet URL",
            dataIndex:"url",
            key: "url",
            render: (tag) => (
                <Link
                  type="link"
                  href={tag}
                  target="_blank"
                  style={{ color: "black" }}
                >
                  {tag}
                </Link> // 跳轉到新的頁面
            ),
        },
        {
            title: "",
            dataIndex:"action",
            render: (_, record) => (
                <Button
                  type="link"
                  icon={<ArrowRightOutlined />}
                  style={{ color: "#D8D8D8" }}
                  // onClick={handleMeetInfoClick}
                />
            ),
        },
    ]

  return (
    <>
      {login ? <Header location="meet" /> : <Header2 />}
      <div className="wholeContainer">
        <div className="meetTableHeader">
          <div
            style={{
              fontStyle: "normal",
              fontWeight: "500",
              fontSize: "30px",
              float: "left",
            }}
          >
            My Meets
          </div>
          <Button
            style= {{
              float: "right",
              marginLeft: "10px",
              backgroundColor: isVoting ? "white": "#5A8EA4",
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
              color: isVoting ? "white" : "#5A8EA4"
            }} 
            onClick={handleIsVote}>Voting</Button>
        </div>
        {(
          <Table
            dataSource={showData}
            className="meetTable"
            columns={columns}
            onRow={(record) => {
              return {
                onClick: handleMeetInfoClick(record.key),
              };
            }}
          >
          </Table>
        )}
      </div>
    </>
  );
};

export default Meets;
