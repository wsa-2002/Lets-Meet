/*TODO:********************************************************************************************
  1. RWD, 版面縮小到一定程度時兩個 component 會重疊。 
  2. 物件, 返回鍵按鈕對齊, 可能要使用 useRef。 
**************************************************************************************************/
import styled from "styled-components";
import "@fontsource/roboto/500.css";
import { Button, Tooltip } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useRef } from "react";
import { useMeet } from "../containers/hooks/useMeet";
import _ from "lodash";
import Moment from "moment";
import { extendMoment } from "moment-range";
import Base from "../components/Base/145MeetRelated";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";

const moment = extendMoment(Moment);

const FormWrapper = styled.div`
  width: 40vw;
  min-width: 500px;
  min-height: 500px;
  position: relative;
  margin-top: calc(100vh * 235 / 1080 - 10vh);
  /* top: calc(100vh * 235 / 1080 - 10vh); */
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 10px;
`;

const NameWrapper = styled.div`
  width: 200px;
  position: absolute;
  left: 0;
  top: calc(100vh * 180 / 1080 - 10vh);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Cell = styled.div`
  width: 50px;
  height: 20px;
  cursor: pointer;
  border-radius: 8px;
  /* background-color: aliceblue; */
`;

const DayColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 5px;
  div {
    font-size: 14px;
    text-align: center;
  }
`;

const CellInfo = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        columnGap: "10px",
        background: "antiquewhite",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div>123</div>
        <div>123</div>
        <div>123</div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div>123</div>
        <div>123</div>
        <div>123</div>
      </div>
    </div>
  );
};

const Voting = () => {
  let DATERANGE = [
    ...moment.range(moment("2019-03-13"), moment("2019-03-19")).by("day"),
  ].map((m) => m.format("YYYY-MM-DD"));

  let TIMESLOTIDS = _.range(15, 30); //記得加 1

  const dataFormatProcessing = () => {
    return _.range(DATERANGE.length).map(() => TIMESLOTIDS.map(() => false));
  };

  const [cell, setCell] = useState(dataFormatProcessing());
  const [startDrag, setStartDrag] = useState(false); //啟動拖曳事件
  const [startIndex, setStartIndex] = useState([]); //選取方塊位置
  const [mode, setMode] = useState(true); //選取模式
  const oriCell = useMemo(() => cell, [startDrag]);
  const 偵測userScroll = useRef(null);

  const slotIDProcessing = (id) => {
    let hour = String(parseInt(((id - 1) * 30) / 60));
    const startHour = "0".repeat(2 - hour.length) + hour;
    const startMinute = parseInt(((id - 1) * 30) % 60) ? "30" : "00";
    return `${startHour}:${startMinute}`;
  };

  const handleCellMouseDown = (index) => (e) => {
    e.preventDefault();
    setStartDrag(true);
    setStartIndex(index);
    setMode(!cell[index[0]][index[1]]);
  };

  const handleCellMouseEnter = (index) => (e) => {
    e.preventDefault();
    if (startDrag) {
      const xRange = [startIndex[0], index[0]].sort((a, b) => a - b);
      const yRange = [startIndex[1], index[1]].sort((a, b) => a - b);
      const Processing = (prev) => {
        let temp = JSON.parse(JSON.stringify(prev));
        for (const d_index of _.range(xRange[0], xRange[1] + 1)) {
          for (const t_index of _.range(yRange[0], yRange[1] + 1)) {
            temp[d_index][t_index] = mode;
          }
        }
        return temp;
      };
      setCell(() => Processing(oriCell));
    }
  };

  const handleCellMouseUp = (e) => {
    e.preventDefault();
    setStartDrag(false);
  };

  const { login } = useMeet();

  const chooseColor = (num) => {
    if (num === 0) return "#f0f0f0";
    const hexStr = (
      parseInt("FFF4CC", 16) - parseInt(((num - 1) * 3635).toString(16), 16)
    ).toString(16);
    while (hexStr.length < 6) {
      hexStr = "0" + hexStr;
    } // Zero pad.
    return `#${hexStr}`;
  };

  const handleCellClick = (index) => () => {
    console.log(index);
    setCell((prev) => {
      let result = JSON.parse(JSON.stringify(prev));
      result[index[0]][index[1]] = !result[index[0]][index[1]];
      return result;
    });
  };

  const leftChild = (
    <div style={{ width: "100%", position: "relative" }}>
      <div
        style={{
          borderLeft: "1px #000000 dashed",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <NameWrapper>
          {/* <Button
            icon={<ArrowLeftOutlined />}
            style={{
              borderColor: "white",
              color: "#808080",
              fontSize: "18px",
              margin: 0,
              padding: 0,
            }}
          ></Button> */}
          <div
            style={{
              fontFamily: "Roboto",
              fontStyle: "normal",
              fontWeight: "500",
              fontSize: "calc(100vmin * 30 / 1080)",
            }}
          >
            SDM Class
          </div>
        </NameWrapper>
        <FormWrapper onMouseUp={handleCellMouseUp}>
          <div
            style={{
              fontFamily: "Roboto",
              fontWeight: "500",
              fontSize: "20px",
            }}
          >
            My Availability
          </div>
          <div
            style={{
              display: "flex",
              columnGap: "2px",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <DayColumn
              style={{
                alignItems: "flex-end",
                marginRight: "5px",
                marginTop: "-10px",
              }}
            >
              <div style={{ opacity: "0" }}>Mar 29</div>
              <div style={{ opacity: "0" }}>Wed</div>
              {TIMESLOTIDS.map((t, Tindex) => (
                <div
                  key={Tindex}
                  style={{
                    height: "20px",
                    userSelect: startDrag ? "none" : "text",
                  }}
                >
                  {slotIDProcessing(t)}
                </div>
              ))}
            </DayColumn>
            <ScrollSyncPane>
              <div
                style={{
                  display: "flex",
                  columnGap: "2px",
                  overflowX: "auto",
                  maxWidth: "80%",
                }}
                onScroll={(e) => {
                  console.log(e.target);
                }}
              >
                {DATERANGE.map((date, c_index) => (
                  <DayColumn key={c_index}>
                    <div style={{ userSelect: "none" }}>
                      {moment(date).format("MMM DD")}
                    </div>
                    <div style={{ userSelect: "none" }}>
                      {moment(date).format("ddd")}
                    </div>
                    {TIMESLOTIDS.slice(0, -1).map((_, r_index) => (
                      <Cell
                        key={r_index}
                        style={{
                          background: cell[c_index][r_index]
                            ? "#94C9CD"
                            : "#F0F0F0",
                        }}
                        onMouseDown={handleCellMouseDown([c_index, r_index])}
                        onMouseEnter={handleCellMouseEnter([c_index, r_index])}
                        onClick={handleCellClick([c_index, r_index])}
                      />
                    ))}
                  </DayColumn>
                ))}
              </div>
            </ScrollSyncPane>
          </div>
        </FormWrapper>
      </div>
    </div>
  );

  const rightChild = (
    <div
      style={{
        // borderLeft: "1px #000000 dashed",
        // borderRight: "1px #000000 dashed",
        display: "flex",
        justifyContent: "center",
        width: "100%",
        position: "relative",
      }}
    >
      <FormWrapper>
        <div
          style={{
            fontFamily: "Roboto",
            fontWeight: "500",
            fontSize: "20px",
          }}
        >
          Group Availability
        </div>
        <div
          style={{
            display: "flex",
            columnGap: "2px",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <DayColumn
            style={{
              alignItems: "flex-end",
              marginRight: "5px",
              marginTop: "-10px",
            }}
          >
            <div style={{ opacity: "0" }}>Mar 29</div>
            <div style={{ opacity: "0" }}>Wed</div>
            {TIMESLOTIDS.map((t, Tindex) => (
              <div
                key={Tindex}
                style={{
                  height: "20px",
                  userSelect: startDrag ? "none" : "text",
                }}
              >
                {slotIDProcessing(t)}
              </div>
            ))}
          </DayColumn>
          <ScrollSyncPane>
            <div
              style={{
                display: "flex",
                columnGap: "2px",
                overflowX: "auto",
                maxWidth: "80%",
              }}
            >
              {DATERANGE.map((date, c_index) => (
                <DayColumn key={c_index}>
                  <div style={{ userSelect: "none" }}>
                    {moment(date).format("MMM DD")}
                  </div>
                  <div style={{ userSelect: "none" }}>
                    {moment(date).format("ddd")}
                  </div>
                  {TIMESLOTIDS.slice(0, -1).map((t, r_index) => (
                    <Tooltip
                      key={r_index}
                      placement="bottom"
                      title={<CellInfo />}
                      overlayStyle={{ background: "white" }}
                      overlayInnerStyle={{
                        color: "black",
                        background: "white",
                      }}
                    >
                      <Cell
                        style={{
                          backgroundColor: chooseColor(2),
                        }}
                      />
                    </Tooltip>
                  ))}
                </DayColumn>
              ))}
            </div>
          </ScrollSyncPane>
        </div>
      </FormWrapper>
    </div>
  );

  return (
    <ScrollSync>
      <Base leftChild={leftChild} rightChild={rightChild} />
    </ScrollSync>
  );
};

export default Voting;
