import "@fontsource/roboto/500.css";
import { Input, Button, DatePicker, TimePicker, Space, Table, Tag } from "antd";
import "../css/Background.css";
import { ArrowRightOutlined} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Header, Header2 } from "../components/Header";
import { browseMeet } from "../middleware";
import { useMeet } from "./hooks/useMeet";

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

  const handleLogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    async function func() {
      if (cookies.token) {
        const result = await browseMeet(cookies.token);
        console.log(result);
        setData(
          result.data.map((d) => ({
            key: d.meet_id,
            name: d.title,
            host: d.host_username,
            votingPeriod: `${d.start_date.replaceAll(
              "-",
              "/"
            )}-${d.end_date.replaceAll("-", "/")}`,
            status: [d.status],
            meetingTime: "xx/xx/xx",
            url: d.meet_url ?? "temp",
          }))
        );
      } else {
        navigate("/");
      }
    }
    func();
  }, [cookies]);

  return (
    <div className="mainContainer">
      {login ? <Header location="meet" /> : <Header2 />}
      <div className="wholeContainer">
        {data && (
          <Table dataSource={data} className="meetTable">
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
              title="Meeting Time"
              dataIndex="meetingTime"
              key="meetingTime"
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
                />
              )}
            />
          </Table>
        )}
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

export default Meets;
