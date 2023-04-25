/*TODO:********************************************************************************************
  1.Grid, line-name 可以設定成 header start /end 和 footer start / end。
**************************************************************************************************/
import React from "react";
import styled from "styled-components";
import _ from "lodash";

const GridContainer = styled.div`
  display: grid;
  position: relative;
  grid-template-columns: ${({ gridColumn }) => gridColumn};
  grid-template-rows: ${({ gridRow }) => gridRow};
`;

const Grid = (prop) => {
  const { column, row, children } = prop;
  if (
    !column ||
    !row ||
    (!column.find((e) => typeof e === "string") && _.sum(column) !== 100) ||
    (!row.find((e) => typeof e === "string") && _.sum(row) !== 100)
  ) {
    throw new Error("請填入正確數字，加起來要100");
  }
  const gridColumn =
    column.reduce((acc, curr, index) => {
      acc += `[line${index + 1}] ${
        typeof curr === "number" ? `${curr}%` : curr
      } `;
      return acc;
    }, "") + `[line${column.length + 1}]`;

  const gridRow =
    row.reduce((acc, curr, index) => {
      acc += `[line${index + 1}] ${
        typeof curr === "number" ? `${curr}%` : curr
      } `;
      return acc;
    }, "") + `[line${row.length + 1}]`;

  return (
    <GridContainer {...prop} gridColumn={gridColumn} gridRow={gridRow}>
      {children}
    </GridContainer>
  );
};

export default Grid;
