import styled from "styled-components";
import "@fontsource/roboto/500.css";
import { Input, Button, DatePicker, TimePicker, Space, Table, Tag } from "antd";
import "../css/Background.css";
import { ArrowRightOutlined, LogoutOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Header, Header2 } from "../components/Header";

const { Column, ColumnGroup } = Table;
const data = [
    {
        name: "SDM",
        host: "Luisa",
        votingPeriod: "2023/03/24-2023/04/01",
        status: ["Voted"],
        meetingTime: "xx/xx/xx",
        url: "https://meet.google.com/rcb-ffqt-xbn",
    },
    {
        name: "SDM",
        host: "Lisa",
        votingPeriod: "2023/03/24-2023/04/01",
        status: ["Unvoted"],
        meetingTime: "xx/xx/xx",
        url: "https://meet.google.com/rcb-ffqt-xbn",
    },
    {
        name: "SDM",
        host: "Luisa",
        votingPeriod: "2023/03/24-2023/04/01",
        status: ["Comfirmed"],
        meetingTime: "xx/xx/xx",
        url: "https://meet.google.com/rcb-ffqt-xbn",
    },
];

const tagMap = {"Voted": "#FFA601", "unVoted": "#D8D8D8", "Comfirming": "#D8D8D8", "Comfirmed": "#FFA601"};

const TimeSlot = () => {
  const [isLogin, setIsLogin] = useState(true); // 如果login會顯示header，沒有的話會顯示login
  const navigate = useNavigate();

  return (
    <div className="mainContainer">
        {isLogin ? <Header/>: <Header2/>}
        <div className="wholeContainer">
            <Table dataSource={data} className="meetTable">
            {/* <Table dataSource={data} className="meetTable" rowClassName={(record, index) => index === 0 ? 'table-row-light' :  'table-row-dark'}></Table> */}
                <Column title="Name" dataIndex="name" key="name" />
                <Column title="Host" dataIndex="host" key="host" />
                <Column title="Voting Period" dataIndex="votingPeriod" key="votingPeroid" />
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
                <Column title="Meeting Time" dataIndex="meetingTime" key="meetingTime" />
                <Column
                    title="Google Meet URL"
                    dataIndex="url"
                    key="url"
                    render={(tag) => (
                        <Link type="link" href={tag} target="_blank" style={{color: "black"}}>
                        {tag}</Link> // 跳轉到新的頁面
                    )}
                />
                <Column
                    title=""
                    key="action"
                    render={(_, record) => (
                        <Button type="link" icon={<ArrowRightOutlined />} style={{color: "#D8D8D8"}}/>
                    )}
                />
            </Table>
        </div>
        <div className="leftFooter" style={{background: "white"}}>
            <div>中文 | English</div>
        </div>
        <div className="rightFooter">
            <div>Copyright 2023</div>
        </div>
    </div>
  );
}

export default TimeSlot;