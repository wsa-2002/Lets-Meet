import React from "react";
import Grid from "./Grid.js";
import Footer from "./Footer";
import Title from "./Title.js";
import styled from "styled-components";

const 左半 = styled.div`
  grid-column: 1/2;
  grid-row: 1/4;
  display: flex;
  position: relative;
  justify-content: center;
  /* z-index: -1; */
  background: #fefcef;
`;

const 右半 = styled.div`
  grid-column: 2/3;
  grid-row: 1/4;
`;

const Base = ({ leftchild, rightChild, title_disable = false }) => {
  return (
    <Grid column={[35, 65]} row={[7, 88, 5]}>
      <左半>
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
        {leftchild}
      </左半>
      <右半>{rightChild}</右半>
      <Footer style={{ gridColumn: "1/3", gridRow: "3/4" }} />
    </Grid>
  );
};

export default Base;
