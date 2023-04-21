import styled from "styled-components";

const TitleComponent = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 4.2vw;
  color: #ffa601;
  font-family: "Lobster";
  width: fit-content;
  margin: 0;
`;

const Title = ({ style, children }) => {
  return <TitleComponent style={style}>{children}</TitleComponent>;
};

export default Title;
