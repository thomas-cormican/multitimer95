import React, { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";
import {
  Window,
  WindowHeader,
  WindowContent,
  Button,
  TextField,
} from "react95";
import styled from "styled-components";
import TimeInput from "./TimeInput";

interface TimerProps {
  id: string;
  title: string;
  duration: number;
  timeLeft: number;
  isRunning: boolean;
  position: { x: number; y: number };
  zIndex: number;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string, duration: number) => void;
  onUpdatePosition: (id: string, position: { x: number; y: number }) => void;
  onBringToFront: (id: string) => void;
  onUpdateTimer: (id: string, timeLeft: number, isRunning: boolean) => void;
  isMobile: boolean;
}

const TimerWindow = styled(Window)<{ isMobile: boolean }>`
  width: ${(props) => (props.isMobile ? "100%" : "300px")};
  margin-bottom: ${(props) => (props.isMobile ? "16px" : "0")};
  position: ${(props) => (props.isMobile ? "static" : "absolute")};
`;

const StyledWindowHeader = styled(WindowHeader)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default function Timer({
  id,
  title,
  duration,
  timeLeft,
  isRunning,
  position,
  zIndex,
  onDelete,
  onEdit,
  onUpdatePosition,
  onBringToFront,
  onUpdateTimer,
  isMobile,
}: TimerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDuration, setEditDuration] = useState(duration);
  const [localTimeLeft, setLocalTimeLeft] = useState(timeLeft);
  const [localIsRunning, setLocalIsRunning] = useState(isRunning);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/alarm.mp3");
  }, []);

  useEffect(() => {
    const updateTimer = () => {
      if (startTimeRef.current === null || !localIsRunning) return;

      const now = Date.now();
      const elapsed = Math.floor((now - startTimeRef.current) / 1000);
      const newTimeLeft = Math.max(0, duration - elapsed);

      setLocalTimeLeft(newTimeLeft);
      onUpdateTimer(id, newTimeLeft, localIsRunning);

      if (newTimeLeft > 0) {
        animationFrameRef.current = requestAnimationFrame(updateTimer);
      } else {
        setLocalIsRunning(false);
        audioRef.current?.play();
      }
    };

    if (localIsRunning) {
      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now() - (duration - localTimeLeft) * 1000;
      }
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      startTimeRef.current = null;
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [localIsRunning, duration, id, onUpdateTimer]);

  useEffect(() => {
    setLocalTimeLeft(timeLeft);
    setLocalIsRunning(isRunning);
    if (isRunning && startTimeRef.current === null) {
      startTimeRef.current = Date.now() - (duration - timeLeft) * 1000;
    }
  }, [timeLeft, isRunning, duration]);

  const handleDragStart = () => {
    onBringToFront(id);
  };

  const handleDragStop = (e: any, data: { x: number; y: number }) => {
    onUpdatePosition(id, { x: data.x, y: data.y });
  };

  const deleteTimer = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
  };

  const handleEdit = () => {
    onEdit(id, editTitle, editDuration);
    setIsEditing(false);
  };

  const toggleTimer = () => {
    const newIsRunning = !localIsRunning;
    setLocalIsRunning(newIsRunning);
    if (newIsRunning) {
      startTimeRef.current = Date.now() - (duration - localTimeLeft) * 1000;
    }
    onUpdateTimer(id, localTimeLeft, newIsRunning);
  };

  const resetTimer = () => {
    setLocalTimeLeft(duration);
    setLocalIsRunning(false);
    startTimeRef.current = null;
    onUpdateTimer(id, duration, false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const timerContent = (
    <TimerWindow
      isMobile={isMobile}
      style={{ zIndex, ...(isMobile ? {} : position) }}
    >
      <StyledWindowHeader className="handle">
        <span>{title}</span>
        <Button onClick={deleteTimer} size="sm" square>
          <span style={{ fontWeight: "bold", transform: "translateY(-1px)" }}>
            x
          </span>
        </Button>
      </StyledWindowHeader>
      <WindowContent>
        {isEditing ? (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <TextField
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Timer Title"
              fullWidth
            />
            <TimeInput
              initialSeconds={editDuration}
              onTimeChange={(newDuration) => setEditDuration(newDuration)}
            />
            <Button onClick={handleEdit} fullWidth>
              Save
            </Button>
          </div>
        ) : (
          <>
            <p
              style={{
                fontSize: "24px",
                textAlign: "center",
                marginBottom: "16px",
              }}
            >
              {formatTime(localTimeLeft)}
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "8px",
              }}
            >
              <Button onClick={toggleTimer} style={{ flex: 1 }}>
                {localIsRunning ? "Pause" : "Play"}
              </Button>
              <Button onClick={resetTimer} style={{ flex: 1 }}>
                Reset
              </Button>
              <Button onClick={() => setIsEditing(true)} style={{ flex: 1 }}>
                Edit
              </Button>
            </div>
          </>
        )}
      </WindowContent>
    </TimerWindow>
  );

  if (isMobile) {
    return timerContent;
  }

  return (
    <Draggable
      handle=".handle"
      position={position}
      onStart={handleDragStart}
      onStop={handleDragStop}
    >
      {timerContent}
    </Draggable>
  );
}
