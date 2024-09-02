import React, { useState } from "react";
import { Button, TextField } from "react95";
import TimeInput from "./TimeInput";

interface NewTimerFormProps {
  onAddTimer: (title: string, duration: number) => void;
}

export default function NewTimerForm({ onAddTimer }: NewTimerFormProps) {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(60);
  const [timeInputKey, setTimeInputKey] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (duration > 0) {
      onAddTimer(title, duration);
      setTitle("");
      setDuration(60);
      setTimeInputKey((prevKey) => prevKey + 1); // This will force the TimeInput to remount
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "16px" }}
    >
      <TextField
        placeholder="Timer Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TimeInput
        key={timeInputKey}
        initialSeconds={60} // Set this to your desired default time
        onTimeChange={setDuration}
      />
      <Button type="submit" fullWidth>
        Add Timer
      </Button>
    </form>
  );
}
