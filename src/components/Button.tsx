import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { hot } from "react-es-hot-loader";

const StyBtn = styled.button`
  border: none;
  background: #198eeb;
  border-radius: 3px;
  color: #fff;
  padding: 11px 20px;
  &:hover {
    background: #4fb1ff;
  }
  &:active {
    background: #197bc9;
  }
`;
function Count(props: any) {
  const [n, setN] = useState(0);
  return (
    <StyBtn {...props}>
      <span onClick={() => setN(n + 1)}>{n}s</span>
    </StyBtn>
  );
}
export default hot(import.meta, Count);
