/*TODO:********************************************************************************************
  1.RWD, 在頁面高度縮小時 create meet 的欄位要產生 scroll, 在小到無法容下 create button 時要浮動 button
**************************************************************************************************/
import { ArrowRightOutlined } from "@ant-design/icons";
import { Form } from "antd";
import _ from "lodash";
import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useMeet } from "../hooks/useMeet";
import Base from "../../components/Base/orange3_white7";
import Button from "../../components/Button";
import Input from "../../components/Input";
import MeetInfo from "../../components/MeetInfo";
import Modal from "../../components/Modal";
import Title from "../../components/Title";
import { addMeet, meet } from "../../middleware";
import { RWD } from "../../constant";
const { RWDHeight, RWDFontSize, RWDWidth, RWDRadius } = RWD;
const PrimaryButton = Button();
const ShortInput = Input("shorter");
const RectButton = Button("rect");
const joinMeet = meet("join");
const GuestNameModal = Modal("guestName");

const JoinMeet = Object.assign(
  styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    row-gap: ${RWDHeight(20)};
    top: ${RWDHeight(180)};
  `,
  {
    Title: styled.p`
      font-size: ${RWDFontSize(30)}; //max(1.6vw, 20px);
      font-weight: bold;
      margin: 0;
    `,
    InvitationArea: Object.assign(
      styled.div`
        display: flex;
        align-items: center;
        column-gap: ${RWDWidth(10)};
      `,
      {
        Input: styled(ShortInput)`
          border-radius: ${RWDRadius(10)};
          font-size: ${RWDFontSize(16)};
        `,
      }
    ),
  }
);

const Mainpage = () => {
  const [meetData, setMeetData] = useState({
    meet_name: "", //<String>
    start_date: "", //<String>
    end_date: "", //<String>
    start_time_slot_id: 0, //<Number (0, 48]>
    end_time_slot_id: 0, //<Number (0, 48]>
    gen_meet_url: false, //<Boolean>
    voting_end_time: "", //<string ISOString>
    description: "", //<String>
    member_ids: [], //[Number]
    emails: [], //[String]
  });
  const [guestCreateModalOpen, setGuestCreateModalOpen] = useState(false);

  const { login, cookies, setError } = useMeet();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const invite = useRef(null);
  const [form] = Form.useForm();

  /*調整 invitation area 套組*/
  const ref = useRef(null); //追蹤LetMEET
  const [width, setWidth] = useState(ref?.current?.offsetWidth);

  const throttledHandleResize = _.throttle(() => {
    setWidth(ref?.current?.offsetWidth);
  }, 500);

  useEffect(() => {
    window.addEventListener("resize", throttledHandleResize);
    return () => {
      window.removeEventListener("resize", throttledHandleResize);
    };
  }, []);
  /******************************************************/

  const handleInvite = async (e) => {
    if (!invite?.current?.input?.value) {
      return;
    }
    if (e?.key === "Enter" || !e.key) {
      if (cookies.token) {
        const { error } = await joinMeet(
          invite.current.input.value,
          cookies.token
        );
        if (error) {
          setError(error);
          return;
        }
      }
      navigate(`/meets/${invite.current.input.value}`);
    }
  };

  const handleMeetDataChange =
    (func, ...name) =>
    (e) => {
      if (name.length === 1) {
        setMeetData((prev) => ({ ...prev, [name[0]]: func(e) }));
      } else {
        setMeetData((prev) => ({
          ...prev,
          [name[0]]: func(e[0], 1),
          [name[1]]: func(e[1], 0),
        }));
      }
    };

  const handleMeetCreate = async () => {
    try {
      if (!login) {
        setGuestCreateModalOpen(true);
        return;
      }
      const { data } = await addMeet(meetData, cookies.token);
      navigate(`/meets/${data.invite_code}`);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleOk = async () => {
    try {
      if (!form.getFieldValue().name) return;
      const { data } = await addMeet(
        {
          ...meetData,
          guest_name: form.getFieldValue().name,
          guest_password: form.getFieldValue().password,
        },
        cookies.token
      );
      navigate(`/meets/${data.invite_code}`, {
        state: { guestName: form.getFieldValue().name },
      });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Base title_disable={true} login={login}>
      <Base.LeftContainer
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <JoinMeet>
          <JoinMeet.Title>{t("joinMeet")}</JoinMeet.Title>
          <JoinMeet.InvitationArea style={{ maxWidth: width }}>
            <JoinMeet.InvitationArea.Input
              placeholder={t("invitation")}
              ref={invite}
              onKeyDown={handleInvite}
            />
            <RectButton
              buttonTheme="#FFA601"
              variant="solid"
              icon={<ArrowRightOutlined />}
              onClick={handleInvite}
              style={{
                width: RWDFontSize(50),
                height: RWDFontSize(45),
                fontSize: RWDFontSize(16),
              }}
            />
          </JoinMeet.InvitationArea>
        </JoinMeet>
        <Title ref={ref} style={{ position: "relative", bottom: "20%" }}>
          Let's meet
        </Title>
      </Base.LeftContainer>
      <Base.RightContainer
        style={{ justifyContent: "flex-start", flexDirection: "column" }}
      >
        <div
          style={{
            position: "relative",
            marginLeft: RWDWidth(120),
            marginTop: RWDHeight(180),
            alignSelf: "flex-start",
            display: "flex",
            flexDirection: "column",
            rowGap: RWDHeight(35),
          }}
        >
          <MeetInfo.Title>{t("createMeet")}</MeetInfo.Title>
          <MeetInfo
            rowGap={30}
            columnGap={55}
            handleMeetDataChange={handleMeetDataChange}
            login={login}
            setMeetData={setMeetData}
            rawMeetInfo={meetData}
          />
        </div>
        <PrimaryButton
          style={{ position: "relative", top: RWDHeight(8) }}
          onClick={handleMeetCreate}
        >
          {t("create")}
        </PrimaryButton>
      </Base.RightContainer>
      <GuestNameModal
        form={form}
        open={guestCreateModalOpen}
        setOpen={setGuestCreateModalOpen}
        handleVoteOk={handleOk}
      ></GuestNameModal>
    </Base>
  );
};

export default Mainpage;