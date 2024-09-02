import React, { useState, useEffect } from "react";
import { TextField } from "react95";
import styled from "styled-components";

interface TimeInputProps {
  initialSeconds: number;
  onTimeChange: (totalSeconds: number) => void;
}

const TimeInputContainer = styled.div`
  display: flex;
  gap: 8px;
`;

export default function TimeInput({
  initialSeconds,
  onTimeChange,
}: TimeInputProps) {
  const [hours, setHours] = useState(
    Math.floor(initialSeconds / 3600).toString()
  );
  const [minutes, setMinutes] = useState(
    Math.floor((initialSeconds % 3600) / 60).toString()
  );
  const [seconds, setSeconds] = useState((initialSeconds % 60).toString());

  useEffect(() => {
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;
    const totalSeconds = h * 3600 + m * 60 + s;
    onTimeChange(totalSeconds);
  }, [hours, minutes, seconds, onTimeChange]);

  const handleInputChange = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    max: number
  ) => {
    const numValue = parseInt(value) || 0;
    if (numValue > max) {
      setter(max.toString());
    } else {
      setter(value);
    }
  };

  return (
    <TimeInputContainer>
      <TextField
        value={hours}
        onChange={(e) => handleInputChange(e.target.value, setHours, 99)}
        placeholder="HH"
        width="33%"
      />
      <TextField
        value={minutes}
        onChange={(e) => handleInputChange(e.target.value, setMinutes, 59)}
        placeholder="MM"
        width="33%"
      />
      <TextField
        value={seconds}
        onChange={(e) => handleInputChange(e.target.value, setSeconds, 59)}
        placeholder="SS"
        width="33%"
      />
    </TimeInputContainer>
  );
}
