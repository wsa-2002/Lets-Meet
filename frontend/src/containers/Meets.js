/*TODO:********************************************************************************************
  1.RWD, 畫面縮小到一定程度時 MEEET TABLE 會超出畫面。
  2. Style, hover 時的特效。
**************************************************************************************************/
import { ArrowRightOutlined } from "@ant-design/icons";
import { Table, ConfigProvider } from "antd";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { useMeet } from "./hooks/useMeet";
import { RWD } from "../constant";
import Base from "../components/Base/145MeetRelated";
import Button from "../components/Button";
import Tag from "../components/Tag";

import { browseMeet } from "../middleware";
const { RWDHeight, RWDWidth } = RWD;
const MemberTag = Tag("member");
const StatusTag = Tag("status");
const RoundButton = Button("round");
const RectButton = Button("rect");

const tagMap = {
  Voted: {
    color: "#808080",
    border: "1px solid #D8D8D8",
    backgroundColor: "#FFFFFF",
  },
  Confirming: {
    color: "#808080",
    border: "1px solid #D8D8D8",
    backgroundColor: "#FFFFFF",
  },
  Unvoted: {
    color: "#FFA601",
    border: "1px solid #FFA601",
    backgroundColor: "#FFFFFF",
  },
  Confirmed: {
    color: "#FFA601",
    border: "1px solid #FFA601",
    backgroundColor: "#FFFFFF",
  },
  "Need Confirmation": {
    color: "#FFFFFF",
    border: "none",
    backgroundColor: "#FFA601",
  },
};

const MeetContainer = styled.div`
  width: ${RWDWidth(1488)};
  position: relative;
  margin-top: ${RWDHeight(100)};
  display: flex;
  flex-direction: column;
  row-gap: ${RWDHeight(30)};
  thead .meetTableColumn {
    background-color: #fdf3d1 !important;
    color: #7a3e00 !important;
    border-bottom: 1px solid #7a3e00 !important;
  }
  tbody .icon {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
`;

const CONFIRMTAG = ["Confirming", "Confirmed", "Need Confirmation"];

const Meets = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { cookies, setLoading } = useMeet();
  const [meetsData, setMeetsData] = useState({});
  const [view, setView] = useState("Voting");

  const customizeRenderEmpty = () => (
    <div style={{ textAlign: "center" }}>
      <p>{t("noData")}</p>
    </div>
  );

  const handleMeetInfoClick = (code) => () => {
    navigate(`/meets/${code}`);
  };

  useEffect(() => {
    (async () => {
      if (cookies.token) {
        setLoading(true);
        const { data } = await browseMeet(undefined, cookies.token);
        setMeetsData(
          data.reduce(
            (acc, curr) => {
              console.log();
              const target = {
                key: curr.meet_id,
                name: curr.title,
                host: curr.host_username,
                code: curr.invite_code,
                votingPeriod: `${curr.start_date.replaceAll(
                  "-",
                  "/"
                )} ~ ${curr.end_date.replaceAll("-", "/")}`,
                status: curr.status,
                meetingTime: "2023/04/15",
                url: curr.meet_url ?? "https://meet.google.com/vft-xolb-mog",
              };
              acc[
                CONFIRMTAG.includes(curr.status) ? "Ended Votes" : "Voting"
              ].push(target);
              return acc;
            },
            { Voting: [], "Ended Votes": [] }
          )
        );
        setLoading(false);
      } else {
        navigate("/");
      }
    })();
  }, [cookies]);

  const columns = [
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
      width: RWDWidth(200),
    },
    {
      title: t("host"),
      dataIndex: "host",
      key: "host",
      width: RWDWidth(150),
      render: (tag) => <MemberTag>{tag}</MemberTag>,
    },
    {
      title: t("votingPeriod"),
      dataIndex: "votingPeriod",
      key: "votingPeriod",
      width: RWDWidth(220),
    },
    {
      title: t("status"),
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
      title: view === "Voting" ? t("votingDeadline") : t("meetingTime"),
      dataIndex: view === "Voting" ? "votingDeadline" : "meetingTime",
      key: view === "Voting" ? "votingDeadline" : "meetingTime",
      width: RWDWidth(200),
    },
    {
      title: t("url"),
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
        </Link> // TODO: 跳轉到新的頁面
      ),
    },
    {
      title: "",
      dataIndex: "action",
      align: "right",
      render: () => (
        <RoundButton
          variant="icon"
          buttonTheme="#D8D8D8"
          icon={<ArrowRightOutlined />}
          style={{ position: "absolute", right: 0 }}
          // onClick={handleMeetInfoClick}
        />
      ),
    },
  ].map((m) => ({
    ...m,
    className: m ? "meetTableColumn" : "meetTableColumn icon",
  }));

  return (
    <Base login={true}>
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
              {t("myMeets")}
            </div>
            <div
              style={{
                display: "flex",
                columnGap: RWDWidth(15),
                alignItems: "center",
              }}
            >
              <RectButton
                buttonTheme="#5A8EA4"
                variant={view === "Voting" ? "solid" : "hollow"}
                onClick={() => {
                  setView("Voting");
                }}
              >
                {t("voting")}
              </RectButton>
              <RectButton
                buttonTheme="#5A8EA4"
                variant={view === "Voting" ? "hollow" : "solid"}
                onClick={() => {
                  setView("Ended Votes");
                }}
              >
                {t("endedVotes")}
              </RectButton>
            </div>
          </div>
          <ConfigProvider
            renderEmpty={customizeRenderEmpty}
            theme={{
              components: {
                Table: {
                  borderRadiusLG: 0,
                  colorFillAlter: "#F0F0F0",
                },
              },
            }}
          >
            <Table
              style={{ width: "100%", overflowX: "auto" }}
              dataSource={meetsData[view]}
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
