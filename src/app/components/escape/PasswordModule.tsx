import { useRef, useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { CheckCircle2, Lock, Unlock } from "lucide-react";
import { Button, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { palette } from "../../theme";

interface PasswordModuleProps {
  roomIndex: number;
  onSuccess: () => void;
  onError: (attempt: string) => void;
  label?: string;
}

const PASSWORDS: Record<number, string> = {
  1: "OBSERVE",
  2: "CLARITY",
  3: "CONFIDENCE",
  4: "APRH",
  5: "USERFOUND",
};

export function PasswordModule({ roomIndex, onSuccess, onError, label }: PasswordModuleProps) {
  const [input, setInput] = useState("");
  const [errorState, setErrorState] = useState(false);
  const [successState, setSuccessState] = useState(false);
  const [locked, setLocked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (locked) return;

    const normalized = input.trim().toUpperCase();
    if (normalized === PASSWORDS[roomIndex]) {
      setSuccessState(true);
      setLocked(true);
      setTimeout(() => onSuccess(), 650);
    } else {
      onError(input);
      setAttempts((a) => a + 1);
      setErrorState(true);
      setLocked(true);
      setTimeout(() => {
        setErrorState(false);
        setLocked(false);
        inputRef.current?.select();
      }, 900);
    }
  };

  const helper = errorState
    ? "Incorrect keyword — check your evidence"
    : successState
      ? "Keyword verified — lead secured"
      : attempts > 0
        ? `${attempts} wrong ${attempts === 1 ? "attempt" : "attempts"}`
        : " ";

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-md flex-col gap-1.5">
      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {label ?? "Recovered keyword"}
      </Typography>

      <Stack direction="row" gap={1} alignItems="flex-start">
        <motion.div
          className="flex-1"
          animate={errorState ? { x: [-6, 6, -4, 4, 0] } : successState ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 0.35 }}
        >
          <TextField
            inputRef={inputRef}
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter password"
            error={errorState}
            color={successState ? "primary" : "secondary"}
            focused={successState || undefined}
            autoComplete="off"
            helperText={helper}
            slotProps={{
              htmlInput: {
                readOnly: locked,
                spellCheck: false,
                "aria-label": label ?? "Recovered keyword",
                style: { textTransform: "uppercase", letterSpacing: "0.2em", fontFamily: "ui-monospace, monospace", textAlign: "center" },
              },
              input: {
                sx: { borderRadius: 999, bgcolor: palette.surface2 },
                startAdornment: (
                  <InputAdornment position="start">
                    {successState ? <Unlock size={16} color={palette.lime} /> : <Lock size={16} color={errorState ? palette.rose : palette.textDim} />}
                  </InputAdornment>
                ),
              },
              formHelperText: {
                sx: { color: successState ? palette.lime : errorState ? undefined : "text.secondary", mx: 2 },
                "aria-live": "polite",
              } as object,
            }}
          />
        </motion.div>

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={(locked && !successState) || !input.trim()}
          sx={{ height: 56, minWidth: 110 }}
        >
          {successState ? <CheckCircle2 size={18} /> : "Submit"}
        </Button>
      </Stack>
    </form>
  );
}
