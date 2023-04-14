import styled from "styled-components";
import { Button, Space } from "antd";
import "../css/Background.css";
import { useMeet } from "../containers/hooks/useMeet";

const DialogUp = styled.div`
  max-width: 400px;
  margin-left: 20px;
  position: relative;
`;

const DialogBottom = styled.div`
  position: absolute;
  top: 62px;
  left: 200px;
  border-width: 30px;
  border-color: #002FA7 transparent transparent transparent;
  border-style: solid;
  width: 0px;
  height: 0px;
`;

const ShowDialog = () => {
    // return (
    //   <div>
    //     <DialogUp>
    //       <DialogBottom/>
    //     </DialogUp>
    //   </div>
    // );
    return (
      <div style={{width: "100px", height: "50px", border: "1px solid black"}}>
        <p>hi</p>
      </div>
    );
  };
  
  export default ShowDialog;