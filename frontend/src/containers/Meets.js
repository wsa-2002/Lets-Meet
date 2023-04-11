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

const Meets = () => {
  const navigate = useNavigate();
  const { cookies, login } = useMeet();
  const [data, setData] = useState("");

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
            Memeber: data.member_infos,
            Description: data.description,
            "Voting Deadline": data.voting_end_time
              ? moment(data.voting_end_time).format("YYYY/MM/DD HH:mm:ss")
              : "not assigned",
            "Invitation URL": data.invite_code,
            "Google Meet URL": data.meet_url ?? "temp",
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

//   useEffect(() => {
//     (async () => {
//       if (cookies.token) {
//         const result = await browseMeet(cookies.token);
//         console.log(result);
//         setData(
//           result.data.map((d) => ({
//             key: d.meet_id,
//             name: d.title,
//             host: d.host_username,
//             votingPeriod: `${d.start_date.replaceAll(
//               "-",
//               "/"
//             )}-${d.end_date.replaceAll("-", "/")}`,
//             status: [d.status],
//             meetingTime: "xx/xx/xx",
//             url: d.meet_url ?? "temp",
//           }))
//         );
//       } else {
//         navigate("/");
//       }
//     })();
//   }, [cookies]);

  return (
    <>
      {login ? <Header location="meet" /> : <Header2 />}
      <div className="wholeContainer">
        <div className="meetTableHeader">
            <div style={{
                    fontFamily: "Roboto", fontStyle: "normal", fontWeight: "500",
                    fontSize: "30px", float: "left"
                }}>My Meets</div>
            <Button style={{float: "right", marginLeft: "10px", backgroundColor: "#5A8EA4", color: "white"}}>Ended Votes</Button>
            <Button style={{float: "right", color: "#5A8EA4"}}>Voting</Button>
        </div>
        {(
          <Table
            dataSource={data}
            className="meetTable"
            onRow={(record) => {
              return {
                onClick: handleMeetInfoClick(record.key),
              };
            }}
          >
            {/* <Table dataSource={data} className="meetTable" rowClassName={(record, index) => index === 0 ? 'table-row-light' :  'table-row-dark'}></Table> */}
            <Column title="Name" dataIndex="name" key="name" />
            <Column title="Host" dataIndex="host" key="host" />
            <Column
              title="Voting Period"
              dataIndex="votingPeriod"
              key="votingPeroid"
            />
            <Column
              title="Status"
              dataIndex="status"
              key="status"
              render={(tags) => (
                <>
                  {tags.map((tag) => (
                    <Tag color={tagMap[tag]} key={tag}>
                      {tag}
                    </Tag>
                  ))}
                </>
              )}
            />
            <Column
              title="Voting Deadline"
              dataIndex="votingDeadline"
              key="votingDeadline"
            />
            <Column
              title="Google Meet URL"
              dataIndex="url"
              key="url"
              render={(tag) => (
                <Link
                  type="link"
                  href={tag}
                  target="_blank"
                  style={{ color: "black" }}
                >
                  {tag}
                </Link> // 跳轉到新的頁面
              )}
            />
            <Column
              title=""
              key="action"
              render={(_, record) => (
                <Button
                  type="link"
                  icon={<ArrowRightOutlined />}
                  style={{ color: "#D8D8D8" }}
                  // onClick={handleMeetInfoClick}
                />
              )}
            />
          </Table>
        )}
      </div>
    </>
  );
};

export default Meets;
