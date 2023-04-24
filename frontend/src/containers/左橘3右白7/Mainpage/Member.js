import { Mentions, Button, Tag } from "antd";
import debounce from "lodash/debounce";
import { useEffect } from "react";
import { useCallback, useRef, useState } from "react";
import { searchMember } from "../../../middleware";
const { Option } = Mentions;

const Member = ({ setMeetData }) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([
    {
      key: "No Result",
      value: "No Result",
      label: "No Result",
      disabled: true,
    },
  ]);
  const [member, setMember] = useState([]);
  const [currentMember, setCurrentMember] = useState({ name: "", id: "" });
  const ref = useRef();
  //   const [showMemberArea, setShowMemberArea] = useState(false);

  //   useEffect(() => {
  //     if (users[0].key !== "No Result") {
  //       setShowMemberArea(true);
  //     }
  //   }, [users]);

  const handleSearchMember = async (key) => {
    if (!key) {
      setUsers([
        {
          key: "No Result",
          value: "No Result",
          label: "No Result",
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
              label: "No Result",
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
        label: "No Result",
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
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Mentions
          style={{
            width: "350px",
          }}
          loading={loading}
          onSearch={onSearch}
          onSelect={(e) => {
            setCurrentMember({ name: e.value, id: e.key });
          }}
          options={users}
        />
        <Button
          style={{ background: "#5A8EA4", color: "white", marginLeft: "10px" }}
          onClick={handleSelectMember}
        >
          +
        </Button>
      </div>
      {member.length > 0 && (
        <div style={{ width: "400px" }}>
          {member.map((item, index) => (
            <Tag closable key={index}>
              {item}
            </Tag>
          ))}
        </div>
      )}
    </div>
  );
};

export default Member;
