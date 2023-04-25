/*TODO:********************************************************************************************
  1.Grid, 左半、右半不需定義在這裡, Grid 和 Flex 一樣都可以寫 align-items 和 justify-content, 建議改掉。
**************************************************************************************************/
import React from "react";
import Grid from "../Grid.js";
import Header from "../Header.js";
import Footer from "../Footer.js";
import styled from "styled-components";

// const ContentContainer = styled.div`
//   grid-column: 2/4;
//   grid-row: 2/3;
//   display: flex;
//   position: relative;
// `;

// const 左半 = styled.div`
//   grid-column: 2/3;
//   grid-row: 2/4;
// `;

// const 右半 = styled.div`
//   grid-column: 3/4;
//   grid-row: 2/3;
// `;

const Base = ({ children, rightChild, leftChild }) => {
  return (
    <Grid column={[10, 40, 50]} row={["7.5vh", "minmax(84vh, auto)", "8.5vh"]}>
      <Header
        style={{ gridRow: "1/2", gridColumn: "1/4", zIndex: 600000 }}
        login={true}
      />

      {/* {children && <ContentContainer>{children}</ContentContainer>}
      {leftChild && <左半>{leftChild}</左半>}
      {rightChild && <右半>{rightChild}</右半>} */}
      {children}
      <Footer style={{ gridColumn: "1/4", gridRow: "3/4" }} />
    </Grid>
  );
};

/**
 * @example
 * const LeftContainer = styled.div`
    grid-column: 2/3;
    grid-row: 2/4;
  `;
 */
Base.LeftContainer = styled.div`
  grid-column: 2/3;
  grid-row: 2/4;
`;
/**
 * @example
 * const LeftContainer = styled.div`
    grid-column: 3/4;
    grid-row: 2/3;
  `;
 */
Base.RightContainer = styled.div`
  grid-column: 3/4;
  grid-row: 2/3;
`;
Base.FullContainer = styled.div`
  grid-column: 2/4;
  grid-row: 2/3;
`;

export default Base;
