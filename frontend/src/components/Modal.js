import { Modal, Form } from "antd";
import React from "react";
import { RWD } from "../constant";
import Input from "./Input";
import Button from "./Button";
const { RWDWidth, RWDHeight } = RWD;
const MainInput = Input("main");
const ModalButton = Button("modal");
const MainPassword = Input.Password("main");

const MODALTYPE = ["guestName"];

export default (type) => {
  if (!MODALTYPE.includes(type)) {
    throw new Error(
      `請定義 Modal 種類，有以下可以選擇：\n${MODALTYPE.join(", ")}`
    );
  }
  return (prop) => {
    switch (type) {
      case "guestName":
        const { form, open, setOpen, handleVoteOk } = prop;
        return (
          <Modal
            centered
            closable={false}
            footer={null}
            onCancel={() => {
              setOpen(false);
            }}
            open={open}
            title=""
            width="fit-content"
          >
            <Form
              form={form}
              style={{
                width: `max(${RWDWidth(393)}, max-content)`,
                height: "fit-content",
                display: "flex",
                flexDirection: "column",
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
                  onClick={handleVoteOk}
                >
                  OK
                </ModalButton>
              </Form.Item>
            </Form>
          </Modal>
        );
      default:
        break;
    }
  };
};
