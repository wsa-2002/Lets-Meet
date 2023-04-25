/*TODO:********************************************************************************************
  1.RWD, 畫面縮小到一定程度時 MEEET TABLE 會超出畫面。
**************************************************************************************************/
import { Button, Table, Tag, ConfigProvider } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Base from "../components/Base/145MeetRelated";
import styled from "styled-components";
import { browseMeet } from "../middleware";
import { useMeet } from "./hooks/useMeet";
import { useTranslation } from 'react-i18next';

const tagMap = {
  Voted: "#FFA601",
  unVoted: "#D8D8D8",
  Comfirming: "#D8D8D8",
  Comfirmed: "#FFA601",
};

const MeetContainer = styled.div`
  width: 86.1%;
  position: relative;
  top: calc(180 / 1080 * 100%);
  display: flex;
  flex-direction: column;
  row-gap: 1vh;
`;

const Meets = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { cookies, login } = useMeet();
  const [data, setData] = useState([]);
  const [isVoting, setIsVoting] = useState(true);
  const [showData, setShowData] = useState(data);

  const customizeRenderEmpty = () => (
    <div style={{ textAlign: "center" }}>
      <p>{t("noData")}</p>
    </div>
  );

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

  //   useEffect(() => {
  //     (async () => {
  //       if (cookies.token) {
  //         const result = await browseMeet(cookies.token);
  //         const data = result.data.map((d) => ({
  //           key: d.meet_id,
  //           name: d.title,
  //           host: d.host_username,
  //           code: d.invite_code,
  //           votingPeriod: `${d.start_date.replaceAll(
  //             "-",
  //             "/"
  //           )}-${d.end_date.replaceAll("-", "/")}`,
  //           status: d.status,
  //           meetingTime: "2023/04/15",
  //           url: d.meet_url ?? "https://meet.google.com/vft-xolb-mog",
  //         }));
  //         setData(data);
  //         setShowData(data.filter((ele) => ele.status.includes("ote"))); // default display voting
  //       } else {
  //         navigate("/");
  //       }
  //     })();
  //   }, [cookies]);

  const columns = [
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
      // width: 200,
      className: "meetTableColumn",
      // style: { backgroundColor: "black" },
    },
    {
      title: t("host"),
      dataIndex: "host",
      key: "host",
      // width: 150,
      className: "meetTableColumn",
    },
    {
      title: t("votingPeriod"),
      dataIndex: "votingPeriod",
      key: "votingPeriod",
      // width: 220,
      className: "meetTableColumn",
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      // width: 200,
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
      title: isVoting ? t("votingDeadline") : t("meetingTime"),
      dataIndex: isVoting ? "votingDeadline" : "meetingTime",
      key: isVoting ? "votingDeadline" : "meetingTime",
      // width: 200,
      className: "meetTableColumn",
    },
    {
      title: t("url"),
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
    <Base>
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
              fontWeight: "700",
              fontSize: "30px",
            }}
          >
            {t("myMeets")}
          </div>
          <div
            style={{
              display: "flex",
              columnGap: "2px",
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
              {t("endedVotes")}
            </Button>
            <Button
              style={{
                backgroundColor: isVoting ? "#5A8EA4" : "white",
                color: isVoting ? "white" : "#5A8EA4",
              }}
              onClick={handleIsVote}
            >
              {t("voting")}
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
          {
            <Table
              style={{ width: "100%", overflowX: "auto" }}
              dataSource={showData}
              // className="meetTable"
              columns={columns}
              onRow={(record) => {
                console.log(record);
                return {
                  onClick: handleMeetInfoClick(record.code),
                };
              }}
            ></Table>
          }
        </ConfigProvider>
      </MeetContainer>
    </Base>
  );
};

export default Meets;
