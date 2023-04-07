import { Mentions } from "antd";
import debounce from "lodash/debounce";
import { useEffect } from "react";
import { useCallback, useRef, useState } from "react";

const Member = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const ref = useRef();

  const loadGithubUsers = async (key) => {
    if (!key) {
      setUsers([]);
      return;
    }
    const response = await fetch(
      `https://api.github.com/search/users?q=${key}`
    );
    const { items = [] } = await response.json();
    console.log(ref.current, key);
    if (ref.current !== key) return;
    setLoading(false);
    setUsers(items.slice(0, 10));
  };

  const debounceLoadGithubUsers = useCallback(
    debounce(loadGithubUsers, 800),
    []
  );

  const onSearch = (search) => {
    console.log("Search:", search);
    ref.current = search;
    setLoading(!!search);
    setUsers([]);
    debounceLoadGithubUsers(search);
  };

  return (
    <Mentions
      style={{
        width: "100%",
      }}
      loading={loading}
      onSearch={onSearch}
      options={
        users.length !== 0
          ? users.map(({ login, avatar_url: avatar }) => ({
              key: login,
              value: login,
              className: "antd-demo-dynamic-option",
              label: (
                <>
                  <img
                    src={avatar}
                    alt={login}
                    style={{
                      width: "20px",
                      height: "20px",
                      marginRight: "8px",
                    }}
                  />
                  <span>{login}</span>
                </>
              ),
            }))
          : [
              {
                key: "No Result",
                value: "No Result",
                label: "No Result",
                disabled: true,
              },
            ]
      }
    />
  );
};

export default Member;
