import { Modal, Form } from "antd";
import React, { useRef, useState } from "react";
import styled from "styled-components";
import Button from "./Button";
import Input from "./Input";
import { RWD } from "../constant";
const ModalButton = Button("modal");
const RectButton = Button("rect");
const MainInput = Input("main");
const MainPassword = Input.Password("main");
const { RWDWidth, RWDHeight } = RWD;

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

/**
 * @example
 * const CellHoverContainer = styled.div`
    width: ${RWDWidth(165)};
    display: flex;
    justify-content: space-between;
    color: #000000;
  `;
*/
const CellHoverContainer = Object.assign(
  styled.div`
    min-width: 165px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    /* justify-content: space-between; */
    color: #000000;
  `,
  {
    /**
     * @example
     * const CellHoverInfo = styled.div`
        display: flex;
        flex-direction: column;
        align-items: center;
        row-gap: ${RWDHeight(5)};
      `;
    */
    CellHoverInfo: styled.div`
      display: flex;
      flex-direction: column;
      align-items: center;
      row-gap: ${RWDHeight(5)};
    `,
  }
);

const MODALTYPE = ["guestName", "confirm", "info"];

export default (type) => {
  if (!MODALTYPE.includes(type)) {
    throw new Error(
      `請定義 Modal 種類，有以下可以選擇：\n${MODALTYPE.join(", ")}`
    );
  }

  return ({ open, setOpen, handleModalOk, onCancel, ...prop }) => {
    let Component;
    switch (type) {
      case "info":
        const { available_members = [], unavailable_members = [] } = prop;
        return (
          <CellHoverContainer>
            <CellHoverContainer.CellHoverInfo style={{ gridColumn: "1/2" }}>
              <div
                style={{
                  fontWeight: "bold",
                  textDecoration: "underline",
                }}
              >
                Availble
              </div>
              {available_members.map((m, index) => (
                <div key={index}>{m}</div>
              ))}
            </CellHoverContainer.CellHoverInfo>
            <CellHoverContainer.CellHoverInfo style={{ gridColumn: "2/3" }}>
              <div
                style={{
                  fontWeight: "bold",
                  textDecoration: "underline",
                }}
              >
                Unavailble
              </div>
              {unavailable_members.map((m, index) => (
                <div key={index}>{m}</div>
              ))}
            </CellHoverContainer.CellHoverInfo>
          </CellHoverContainer>
        );

      case "guestName":
        const { handleFormChange, form } = prop;
        Component = (
          <ContentContainer
            style={{
              position: "relative",
              rowGap: RWDHeight(35),
            }}
          >
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Username is required",
                },
              ]}
              style={{ margin: 0 }}
              onChange={handleFormChange("username")}
            >
              <MainInput placeholder="Your name" />
            </Form.Item>
            <Form.Item
              style={{ margin: 0 }}
              onChange={handleFormChange("password")}
            >
              <MainPassword placeholder="Password (optional)" />
            </Form.Item>
            <Form.Item style={{ margin: 0, alignSelf: "flex-end" }}>
              <ModalButton
                htmlType="submit"
                buttonTheme="#B8D8BA"
                variant="solid"
                onClick={handleModalOk}
                disabled={!form.username}
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
        forceRender
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
