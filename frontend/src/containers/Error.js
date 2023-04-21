import Base from "../components/Base/145MeetRelated";
import styled from "styled-components";

const ErrorContainer = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  row-gap: 1vh;
  p {
    color: #ffa601;
    font-size: 80px;
  }
`;

const Error = () => {
  return (
    <Base>
      <ErrorContainer>
        <p>Page not exists</p>
      </ErrorContainer>
    </Base>
  );
};

export default Error;
