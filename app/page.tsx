"use client";

import { useState, useEffect } from "react";
import TimerList from "../components/TimerList";
import NewTimerForm from "../components/NewTimerForm";
import {
  Window,
  WindowHeader,
  WindowContent,
  Button,
  Toolbar,
  Panel,
} from "react95";
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

const AppContainer = styled.div`
  background: teal;
  min-height: 100vh;
  padding: 16px;
  box-sizing: border-box;
`;

const MainWindow = styled(Window)`
  width: 100%;
  height: auto;
  min-height: calc(100vh - 32px);
  display: flex;
  flex-direction: column;
`;

const ContentArea = styled(WindowContent)`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  overflow: hidden;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const SidePanel = styled(Panel)`
  width: 100%;
  margin-bottom: 16px;
  padding: 16px;

  @media (min-width: 768px) {
    width: 30%;
    margin-right: 16px;
    margin-bottom: 0;
  }
`;

const TimerPanel = styled(Panel)`
  width: 100%;
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

export default function Home() {
  const [timers, setTimers] = useState<TimerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [maxZIndex, setMaxZIndex] = useState(0);

  useEffect(() => {
    const savedTimers = localStorage.getItem("timers");
    if (savedTimers) {
      const parsedTimers: TimerData[] = JSON.parse(savedTimers);
      const pausedTimers = parsedTimers.map((timer) => ({
        ...timer,
        isRunning: false, // Ensure all timers are paused on load
      }));
      setTimers(pausedTimers);
      setMaxZIndex(Math.max(...pausedTimers.map((t) => t.zIndex), 0));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("timers", JSON.stringify(timers));
    }
  }, [timers, isLoading]);

  const addTimer = (title: string, duration: number) => {
    const newZIndex = maxZIndex + 1;
    setMaxZIndex(newZIndex);
    const newTimer: TimerData = {
      id: Date.now().toString(),
      title: title || `Timer ${timers.length + 1}`,
      duration,
      timeLeft: duration,
      isRunning: false,
      position: getNewTimerPosition(),
      zIndex: newZIndex,
    };
    setTimers([...timers, newTimer]);
  };

  const deleteTimer = (id: string) => {
    setTimers((prevTimers) => prevTimers.filter((timer) => timer.id !== id));
  };

  const editTimer = (id: string, title: string, duration: number) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) =>
        timer.id === id
          ? {
              ...timer,
              title: title || `Timer ${timer.id}`,
              duration,
              timeLeft: duration,
            }
          : timer
      )
    );
  };

  const updateTimerPosition = (
    id: string,
    position: { x: number; y: number }
  ) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) =>
        timer.id === id ? { ...timer, position } : timer
      )
    );
  };

  const bringToFront = (id: string) => {
    setMaxZIndex((prevMaxZIndex) => {
      const newZIndex = prevMaxZIndex + 1;
      setTimers((prevTimers) =>
        prevTimers.map((timer) =>
          timer.id === id ? { ...timer, zIndex: newZIndex } : timer
        )
      );
      return newZIndex;
    });
  };

  const updateTimer = (id: string, timeLeft: number, isRunning: boolean) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) =>
        timer.id === id ? { ...timer, timeLeft, isRunning } : timer
      )
    );
  };

  const getNewTimerPosition = () => {
    const baseX = 20;
    const baseY = 20;
    const offset = 30;
    const index = timers.length;
    return {
      x: baseX + ((index * offset) % 200),
      y: baseY + Math.floor(index / 6) * offset,
    };
  };

  const clearAllTimers = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all timers? This action cannot be undone."
      )
    ) {
      setTimers([]);
      setMaxZIndex(0);
      localStorage.removeItem("timers");
    }
  };

  return (
    <AppContainer>
      <MainWindow>
        <WindowHeader>
          <span>Multi-Timer 95</span>
        </WindowHeader>
        <Toolbar>
          <Button variant="menu" size="sm" onClick={clearAllTimers}>
            Clear All Timers
          </Button>
        </Toolbar>
        <ContentArea>
          <SidePanel variant="well">
            <NewTimerForm onAddTimer={addTimer} />
          </SidePanel>
          <TimerPanel>
            <TimerList
              timers={timers}
              onDeleteTimer={deleteTimer}
              onEditTimer={editTimer}
              onUpdatePosition={updateTimerPosition}
              onBringToFront={bringToFront}
              onUpdateTimer={updateTimer}
            />
          </TimerPanel>
        </ContentArea>
      </MainWindow>
    </AppContainer>
  );
}
