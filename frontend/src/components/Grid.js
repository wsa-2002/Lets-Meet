import React from "react";
import styled from "styled-components";
import _ from "lodash";

const GridContainer = styled.div`
  width: 100%;
  height: 100vh;
  /* min-width: 1500px;
  min-height: 900px; */

  display: grid;
  position: relative;
  grid-template-columns: ${({ gridColumn }) => gridColumn};
  grid-template-rows: ${({ gridRow }) => gridRow};
  margin: 0;
`;

const Grid = ({ column, row, children }) => {
  if (!column || !row || _.sum(column) !== 100 || _.sum(row) !== 100) {
    throw new Error("請填入正確數字，加起來要100");
  }
  const gridColumn =
    column.reduce((acc, curr, index) => {
      acc += `[line${index + 1}] ${curr}% `;
      return acc;
    }, "") + `[line${column.length + 1}]`;

  const gridRow =
    row.reduce((acc, curr, index) => {
      acc += `[line${index + 1}] ${curr}% `;
      return acc;
    }, "") + `[line${row.length + 1}]`;

  return (
    <GridContainer gridColumn={gridColumn} gridRow={gridRow}>
      {children}
    </GridContainer>
  );
};

export default Grid;
