import React, { forwardRef } from "react";
import styled from "styled-components";
import { RWD } from "../constant";
const { RWDHeight, RWDWidth, RWDRadius } = RWD;

const Cell = styled.div`
  width: ${RWDWidth(50)};
  height: ${RWDHeight(20)};
  /* max-width: 50px; */
  max-height: 20px;
  /* min-width: 50px; */
  min-height: 20px;
  cursor: pointer;
  border-radius: ${RWDRadius(10)};
`;

const TimeCell = forwardRef((prop, ref) => <Cell {...prop} ref={ref} />);

export default TimeCell;
