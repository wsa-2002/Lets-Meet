import { Modal, Form } from "antd";
import React from "react";
import styled, { css } from "styled-components";
import { RWD } from "../constant";
import Input from "./Input";
import Button from "./Button";
const { RWDWidth, RWDHeight } = RWD;
const MainInput = Input("main");
const ModalButton = Button("modal");
const RectButton = Button("rect");
const MainPassword = Input.Password("main");

const ContentContainer = Object.assign(
  styled(Form)`
    width: ${RWDWidth(393)};
    min-width: max-content;
    height: fit-content;
    display: flex;
    flex-direction: column;
    position: relative;
  `,
  {
    Title: styled.div`
      font-weight: 700;
    `,
    Time: styled.div`
      font-weight: 500;
    `,
  }
);

const MODALTYPE = ["guestName", "confirm"];

export default (type) => {
  if (!MODALTYPE.includes(type)) {
    throw new Error(
      `請定義 Modal 種類，有以下可以選擇：\n${MODALTYPE.join(", ")}`
    );
  }
  return ({ open, setOpen, handleModalOk, onCancel, ...prop }) => {
    let Component;
    switch (type) {
      case "guestName":
        const { form } = prop;
        Component = (
          <ContentContainer
            form={form}
            style={{
              position: "relative",
              rowGap: RWDHeight(35),
            }}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Username is required",
                },
              ]}
              style={{ margin: 0 }}
            >
              <MainInput placeholder="Your name" />
            </Form.Item>
            <Form.Item name="password" style={{ margin: 0 }}>
              <MainPassword placeholder="Password (optional)" />
            </Form.Item>
            <Form.Item style={{ margin: 0, alignSelf: "flex-end" }}>
              <ModalButton
                htmlType="submit"
                buttonTheme="#B8D8BA"
                variant="solid"
                onClick={handleModalOk}
              >
                OK
              </ModalButton>
            </Form.Item>
          </ContentContainer>
        );
        break;
      case "confirm":
        const { meetName, time } = prop;
        Component = (
          <ContentContainer>
            <ContentContainer.Title>
              {`Time of ${meetName} is`}
            </ContentContainer.Title>
            <ContentContainer.Time>{time}</ContentContainer.Time>
            <div
              style={{
                margin: 0,
                alignSelf: "flex-end",
                display: "flex",
                columnGap: RWDWidth(18),
                marginTop: RWDHeight(24),
              }}
            >
              <RectButton
                buttonTheme="#D8D8D8"
                variant="hollow"
                onClick={onCancel}
              >
                Cancel
              </RectButton>
              <RectButton
                buttonTheme="#DB8600"
                variant="solid"
                onClick={handleModalOk}
              >
                Confirm
              </RectButton>
            </div>
          </ContentContainer>
        );
      default:
        break;
    }
    return (
      <Modal
        centered
        closable={false}
        footer={null}
        onCancel={
          onCancel ??
          (() => {
            setOpen(false);
          })
        }
        open={open}
        title=""
        width="fit-content"
      >
        {Component}
      </Modal>
    );
  };
};
