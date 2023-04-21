import { Mentions, Button, Tag, Input } from "antd";
import debounce from "lodash/debounce";
import { useCallback, useRef, useState } from "react";
import { searchMember } from "../../../middleware";
import { RWD } from "../../../constant";
import Base from "../../../components/Base/左橘3右白7";
const { RWDHeight, RWDFontSize, RWDWidth, RWDRadius } = RWD;
const {
  RightContainer: { CreateMeet },
  RightContainer: {
    CreateMeet: { Content },
  },
} = Base;

const Label = (
  <div style={{ width: "400px", background: "blue" }}>No Result</div>
);

const Member = ({ setMeetData }) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([
    {
      key: "No Result",
      value: "No Result",
      label: Label,
      disabled: true,
    },
  ]);
  const [member, setMember] = useState([
    "yclai",
    "jtc",
    "b09705015@gmail.com",
    "benson",
    "Ericaaaa",
    "lichi",
    "daphne",
    "陳亮瑾",
  ]);
  const [currentMember, setCurrentMember] = useState({ name: "", id: "" });
  const ref = useRef();

  const handleSearchMember = async (key) => {
    if (!key) {
      setUsers([
        {
          key: "No Result",
          value: "No Result",
          label: Label,
          disabled: true,
        },
      ]);
      return;
    }
    const {
      data: { accounts },
    } = await searchMember(key);
    console.log(
      accounts.slice(0, 10).map((m) => ({
        key: m.id,
        value: m.username,
        label: m.username,
      }))
    );
    if (ref.current !== key) return;
    setLoading(false);
    console.log(accounts);
    setUsers(
      accounts.length !== 0
        ? accounts.slice(0, 10).map((m) => ({
            key: String(m.id),
            value: m.username,
            label: m.username,
          }))
        : [
            {
              key: "No Result",
              value: "No Result",
              label: Label,
              disabled: true,
            },
          ]
    );
  };

  const debouncesearchMember = useCallback(
    debounce(handleSearchMember, 800),
    []
  );

  const onSearch = (search) => {
    console.log("Search:", search);
    ref.current = search;
    setLoading(!!search);
    setUsers([
      {
        key: "No Result",
        value: "No Result",
        label: Label,
        disabled: true,
      },
    ]);
    debouncesearchMember(search);
  };

  const handleSelectMember = () => {
    setMember((prev) => [...prev, currentMember?.name]);
    setMeetData((prev) => ({
      ...prev,
      member_ids: [...prev.member_ids, parseInt(Number(currentMember?.id))],
    }));
    setCurrentMember({ name: "", id: "" });
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", rowGap: RWDHeight(6) }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: Content.TextArea.width,
          justifyContent: "space-between",
          // columnGap: RWDWidth(4),
        }}
      >
        <Input
          style={{ ...Content.Input, display: "flex", alignItems: "center" }}
          loading={loading}
          // onSearch={onSearch}
          // onSelect={(e) => {
          //   setCurrentMember({ name: e.value, id: e.key });
          // }}
          // options={users}
        />
        <Button
          style={{
            background: "#5A8EA4",
            color: "white",
            width: RWDWidth(42),
            height: RWDHeight(35),
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: RWDFontSize(24),
          }}
          onClick={handleSelectMember}
        >
          +
        </Button>
      </div>

      {member.length > 0 && (
        <div style={{ ...Content.TextArea }}>
          <div
            style={{
              margin: `${RWDFontSize(8)} ${RWDFontSize(12)}`,
              display: "flex",
              flexWrap: "wrap",
              gap: `${RWDFontSize(8)} ${RWDFontSize(8)}`,
              overflowY: "auto",
              height: "90%",
            }}
          >
            {member.map((item, index) => (
              <Tag
                key={index}
                closable
                // key={index}
                style={{
                  width: "fit-content",
                  height: RWDHeight(26),
                  borderRadius: RWDRadius(10),
                  // padding: `${RWDHeight(2)} ${RWDWidth(8)}`,
                  fontSize: RWDFontSize(14),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#E0F6F5",
                }}
              >
                {item}
              </Tag>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Member;
