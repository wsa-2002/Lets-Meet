import { notification, ConfigProvider } from "antd";
import React, { useEffect, useState, useMemo } from "react";
import { RWD } from "../constant";
const { RWDFontSize } = RWD;

const Notification = ({ message, description, setDescription }) => {
  const [api, contextHolder] = notification.useNotification();
  const [margin, setMargin] = useState(0);

  useEffect(() => {
    if (description !== undefined) {
      api.open({
        message,
        description,
        placement: "top",
        duration: 1,
        closeIcon: <></>,
        style: {
          fontSize: RWDFontSize(20),
          fontWeight: 700,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          border: "1px solid#D8D8D8",
          boxShadow: "none",
        },
      });
      setMargin(description ? 8 : 0);
      setDescription(undefined);
    }
  }, [description]);

  return (
    <ConfigProvider
      theme={{
        token: {
          marginXS: margin,
          borderRadiusLG: 15,
        },
      }}
    >
      {contextHolder}
    </ConfigProvider>
  );
};

export default Notification;
