"use client";

import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { Window, WindowHeader, WindowContent, ProgressBar } from "react95";

const LoadingContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #008080; // Classic Windows 95 teal background
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const LoadingWindow = styled(Window)`
  width: 300px;
  opacity: 0;
  animation: ${fadeIn} 0.5s ease-in forwards;
`;

const blink = keyframes`
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
`;

const BlinkingCursor = styled.span`
  animation: ${blink} 1s step-end infinite;
`;

export default function Loading() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Delay the appearance of the loading window
    const visibilityTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    const progressTimer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prevProgress + 10;
      });
    }, 200);

    return () => {
      clearTimeout(visibilityTimer);
      clearInterval(progressTimer);
    };
  }, []);

  if (!isVisible) {
    return <LoadingContainer />;
  }

  return (
    <LoadingContainer>
      <LoadingWindow>
        <WindowHeader>
          <span>Windows 95</span>
        </WindowHeader>
        <WindowContent>
          <p>Loading Multi-Timer 95...</p>
          <ProgressBar value={progress} />
          <p style={{ marginTop: "1rem" }}>
            C:\WINDOWS&gt; LOAD MULTITIMER.EXE<BlinkingCursor>_</BlinkingCursor>
          </p>
        </WindowContent>
      </LoadingWindow>
    </LoadingContainer>
  );
}
