import React, { useState, useEffect } from "react";
import Timer from "./Timer";
import styled from "styled-components";

interface TimerData {
  id: string;
  title: string;
  duration: number;
  timeLeft: number;
  isRunning: boolean;
  position: { x: number; y: number };
  zIndex: number;
}

interface TimerListProps {
  timers: TimerData[];
  onDeleteTimer: (id: string) => void;
  onEditTimer: (id: string, title: string, duration: number) => void;
  onUpdatePosition: (id: string, position: { x: number; y: number }) => void;
  onBringToFront: (id: string) => void;
  onUpdateTimer: (id: string, timeLeft: number, isRunning: boolean) => void;
}

const ResponsiveTimerContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;

  @media (min-width: 768px) {
    position: relative;
    display: block;
  }
`;

export default function TimerList({
  timers,
  onDeleteTimer,
  onEditTimer,
  onUpdatePosition,
  onBringToFront,
  onUpdateTimer,
}: TimerListProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ResponsiveTimerContainer>
      {timers.map((timer) => (
        <Timer
          key={timer.id}
          {...timer}
          onDelete={onDeleteTimer}
          onEdit={onEditTimer}
          onUpdatePosition={onUpdatePosition}
          onBringToFront={onBringToFront}
          onUpdateTimer={onUpdateTimer}
          isMobile={isMobile}
        />
      ))}
    </ResponsiveTimerContainer>
  );
}
