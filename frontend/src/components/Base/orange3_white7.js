/*TODO:********************************************************************************************
  1.Grid, 左半、右半不需定義在這裡, Grid 和 Flex 一樣都可以寫 align-items 和 justify-content, 建議改掉。
**************************************************************************************************/
import React, { forwardRef } from "react";
import Header from "../Header";
import Grid from "../Grid.js";
import Footer from "../Footer.js";
import Title from "../Title.js";
import Button from "../Button";
import styled from "styled-components";
import { Input as AntdInput, Form } from "antd";
import { RWD, FONTS } from "../../constant";
const { RWDWidth, RWDRadius, RWDFontSize, RWDHeight } = RWD;
const { main } = FONTS;

const Base = ({
  children,
  title_disable = false,
  header = { show: false, login: false },
}) => {
  if (header.show === undefined || header.login === undefined) {
    throw new Error(
      "Header 需包含「顯示狀態」和「Login狀態」，prop 應如下輸入\nheader:{show:Boolean, login:Boolean}"
    );
  }
  return (
    <Grid column={[35, 65]} row={["7.5vh", "minmax(84vh, auto)", "8.5vh"]}>
      {header?.show && (
        <Header
          style={{ gridRow: "1/2", gridColumn: "1/3", zIndex: 600000 }}
          login={header.login}
        />
      )}
      <div
        style={{
          gridColumn: "1/2",
          gridRow: "1/4",
          background: "#fefcef",
          display: "flex",
          position: "relative",
          justifyContent: "center",
          zIndex: -1,
        }}
      >
        {!title_disable && (
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "100%",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <Title style={{ position: "relative", bottom: "20%" }}>
              Let's meet
            </Title>
          </div>
        )}
      </div>
      {children}
      <Footer style={{ gridColumn: "1/3", gridRow: "3/4" }} />
    </Grid>
  );
};

Base.LeftContainer = styled.div`
  grid-column: 1/2;
  grid-row: 1/4;
`;

const Input = styled(AntdInput)`
  width: 100%;
  height: ${RWDHeight(45)};
  border-radius: ${RWDRadius(10)};
  font-size: ${RWDFontSize(16)};
  border: ${RWDRadius(1)} solid #808080;
`;

const Password = styled(AntdInput.Password)`
  width: 100%;
  height: ${RWDHeight(45)};
  border-radius: ${RWDRadius(10)};
  font-size: ${RWDFontSize(16)};
  border: ${RWDRadius(1)} solid #808080;
  input::-ms-reveal,
  input::-ms-clear {
    display: none;
  }
  /* input {
    &::placeholder {
      font-size: ${RWDFontSize(16)};
    }
  } */
  /* span {
    margin: 0;
  } */
`;
const PrimaryButton = Button("primary");

/**
 * @example
 * const RightContainer = styled.div`
    grid-column: 2/3;
    grid-row: 1/4;
    display: flex;
    justify-content: center;
    align-items: center;
  `;
  */
Base.RightContainer = Object.assign(
  styled.div`
    grid-column: 2/3;
    grid-row: 1/4;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  {
    /**
     * @example
     * const InfoContainer = styled.div`
        width: ${RWDWidth(470)};
        height: auto;
        border: 1px solid #d8d8d8;
        border-radius: ${RWDRadius(15)};
        display: flex;
        flex-direction: column;
        align-items: center;
      `;
     */
    InfoContainer: Object.assign(
      styled.div`
        width: ${RWDWidth(470)};
        height: auto;
        border: 1px solid #d8d8d8;
        border-radius: ${RWDRadius(15)};
        display: flex;
        flex-direction: column;
        align-items: center;
      `,
      {
        /**
         * @example
         * const InputContainer = styled.div`
            width: ${RWDWidth(350)};
            gap: ${RWDHeight(30)};
            display: flex;
            flex-direction: column;
          `;
        */
        InputContainer: styled.div`
          width: ${RWDWidth(350)};
          gap: ${RWDHeight(30)};
          display: flex;
          flex-direction: column;
        `,
        /**
         * @example
         * const Title = styled.div`
            ${main}
            font-weight: bold;
            font-size: ${RWDFontSize(30)};
            padding: 0;
            margin: 0;
          `;
        */
        Title: styled.h1`
          ${main}
          font-weight: bold;
          font-size: ${RWDFontSize(30)};
          padding: 0;
          margin: 0;
        `,
        /**
         * @example
         * const Input = styled.div`
            width: 100%;
            height: ${RWDHeight(45)};
            border-radius: ${RWDRadius(10)};
            font-size: ${RWDFontSize(16)};
            border: ${RWDRadius(1)} solid #808080;
          `;
        */
        Input: forwardRef((prop, ref) => (
          <Form autoComplete="off">
            <Input {...prop} ref={ref} />
          </Form>
        )),
        /**
         * @example
         * const Password = styled.div`
            width: 100%;
            height: ${RWDHeight(45)};
            border-radius: ${RWDRadius(10)};
            font-size: ${RWDFontSize(16)};
            border: ${RWDRadius(1)} solid #808080;
            input::-ms-reveal,
            input::-ms-clear {
              display: none;
            }
          `;
        */
        Password: forwardRef((prop, ref) => (
          <Form autoComplete="off">
            <Password {...prop} ref={ref} />
          </Form>
        )),
        Button: (prop) => <PrimaryButton {...prop} />,
      }
    ),

    /**
     * @example
     * const CreateMeet = styled.div`
        position: relative;
        margin-left: ${RWDWidth(120)};
        margin-top: ${RWDHeight(180)};
        display: grid;
        grid-template-columns: repeat(2, max-content);
        grid-template-rows: repeat(8, max-content);
        grid-column-gap: ${RWDWidth(55)};
        grid-row-gap: ${RWDHeight(30)};
      `;
    */
    CreateMeet: Object.assign(
      styled.div`
        position: relative;
        margin-left: ${RWDWidth(120)};
        margin-top: ${RWDHeight(180)};
        display: grid;
        grid-template-columns: repeat(2, max-content);
        grid-template-rows: repeat(8, max-content);
        grid-column-gap: ${RWDWidth(55)};
        grid-row-gap: ${RWDHeight(30)};
      `,
      {
        /**
         * @example
         * const Title = styled.div`
            font-size: ${RWDFontSize(30)}; //max(1.6vw, 20px);
            font-weight: bold;
            margin: 0;
            grid-column: 1/3;
            grid-row: 1/2;
          `;
        */
        Title: styled.p`
          font-size: ${RWDFontSize(30)}; //max(1.6vw, 20px);
          font-weight: bold;
          margin: 0;
          grid-column: 1/3;
          grid-row: 1/2;
        `,
        /**
         * @example
         * const Content = styled.div`
            display: flex;
            align-items: center;
            font-size: ${RWDFontSize(16)};
            font-weight: bold;
          `;
        */
        Content: Object.assign(
          styled.div`
            display: flex;
            align-items: center;
            font-size: ${RWDFontSize(16)};
            font-weight: bold;
          `,
          {
            Input: {
              width: RWDWidth(350),
              height: RWDHeight(35),
              border: `${RWDRadius(1)} solid #808080`,
              borderRadius: RWDRadius(10),
            },
            Range: {
              width: RWDWidth(350),
              height: RWDHeight(32),
              fontSize: RWDFontSize(14),
              border: `${RWDRadius(1)} solid #808080`,
            },
            TextArea: {
              width: RWDWidth(400),
              height: RWDHeight(106),
              border: `${RWDRadius(1)} solid #808080`,
              borderRadius: RWDFontSize(15),
            },
            Picker: {
              width: RWDWidth(150),
              height: RWDHeight(32),
              fontSize: RWDFontSize(14),
            },
          }
        ),
      }
    ),
  }
);

export default Base;
