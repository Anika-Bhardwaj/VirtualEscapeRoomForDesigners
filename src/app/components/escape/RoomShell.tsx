import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useEffect, useState, useRef } from "react";
import { ArrowRight, Clock, CheckCircle2, Lightbulb } from "lucide-react";
import { Box, Button, Chip, Collapse, Dialog, Paper, Stack, Tooltip, Typography } from "@mui/material";
import type { RoomMeta } from "./gameData";
import { ROOMS } from "./gameData";
import { Stamp } from "./materials";
import { palette } from "../../theme";

/* ── Live timer ──────────────────────────────────────────────────── */
function useTimer(running: boolean) {
  const [seconds, setSeconds] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else if (ref.current) {
      clearInterval(ref.current);
    }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]);

  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

/* ── Room progress pills ─────────────────────────────────────────── */
function RoomSteps({ current }: { current: number }) {
  return (
    <Stack direction="row" spacing={0.75} alignItems="center" aria-label={`Case ${current + 1} of ${ROOMS.length}`}>
      {ROOMS.map((r, i) => (
        <Tooltip key={r.id} title={r.title} arrow>
          <motion.div
            animate={{
              width: i === current ? 22 : 8,
              backgroundColor: i < current ? palette.violet : i === current ? palette.lime : "rgba(255,255,255,0.14)",
            }}
            transition={{ duration: 0.35 }}
            style={{ height: 8, borderRadius: 999 }}
          />
        </Tooltip>
      ))}
    </Stack>
  );
}

/* Frame that every case-file board shares. Keeps the player oriented. */
export function RoomShell({
  meta,
  hint,
  children,
  solved,
  onAdvance,
}: {
  meta: RoomMeta;
  hint: string;
  children: ReactNode;
  solved: boolean;
  onAdvance: () => void;
}) {
  const time = useTimer(!solved);
  const [hintOpen, setHintOpen] = useState(false);

  useEffect(() => {
    if (!solved) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") onAdvance();
    };
    const t = setTimeout(() => document.addEventListener("keydown", onKey), 400);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
  }, [solved, onAdvance]);

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 pb-8 pt-6 md:px-8">

      {/* ── Top bar ── */}
      <Stack
        className="noir-in"
        direction="row"
        flexWrap="wrap"
        alignItems="flex-end"
        justifyContent="space-between"
        gap={2}
        sx={{ mb: 2.5, pr: { xs: 8, md: 10 } }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap">
            <Chip
              label={meta.fileNo}
              size="small"
              sx={{ bgcolor: palette.lime, color: "#111", height: 24, fontSize: 11 }}
            />
            <RoomSteps current={meta.index} />
          </Stack>
          <Typography
            component="h1"
            className="font-display"
            sx={{ mt: 1.5, fontSize: "clamp(1.6rem,3.5vw,2.4rem)", lineHeight: 1.05, color: "text.primary" }}
          >
            {meta.title}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, color: "text.secondary" }}>
            {meta.location}
          </Typography>
        </Box>

        <Stack direction="row" alignItems="center" gap={1}>
          <Chip
            icon={<Clock size={14} />}
            label={time}
            aria-label="Time elapsed"
            sx={{ bgcolor: palette.surface2, border: `1px solid ${palette.line}`, fontVariantNumeric: "tabular-nums" }}
          />
          <Button
            variant="outlined"
            size="small"
            startIcon={<Lightbulb size={14} />}
            onClick={() => setHintOpen((v) => !v)}
            aria-expanded={hintOpen}
          >
            {hintOpen ? "Hide hint" : "Need a hint?"}
          </Button>
        </Stack>
      </Stack>

      <Collapse in={hintOpen}>
        <Paper
          sx={{
            mb: 2,
            px: 2.5,
            py: 1.75,
            borderRadius: 3,
            bgcolor: "rgba(143,124,245,0.1)",
            borderColor: "rgba(143,124,245,0.3)",
            display: "flex",
            gap: 1.5,
            alignItems: "flex-start",
          }}
        >
          <Lightbulb size={16} color={palette.violet} style={{ marginTop: 2, flexShrink: 0 }} />
          <Typography variant="body2" sx={{ color: "text.primary", lineHeight: 1.6 }}>
            {hint}
          </Typography>
        </Paper>
      </Collapse>

      {/* ── Main content surface ── */}
      <Paper
        sx={{ position: "relative", flex: 1, overflow: "hidden", borderRadius: 6, p: { xs: 2.5, md: 3.5 } }}
      >
        <div className="relative">{children}</div>
      </Paper>

      {/* ── Solved dialog ── */}
      <Dialog
        open={solved}
        maxWidth="xs"
        fullWidth
        aria-label={`${meta.fileNo} solved`}
        slotProps={{
          backdrop: { sx: { bgcolor: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" } },
          paper: { sx: { overflow: "visible", p: 4, textAlign: "center" } },
        }}
      >
        <div className="absolute -top-5 right-6">
          <Stamp label="Lead Recovered" slam />
        </div>

        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
          style={{
            margin: "0 auto 16px",
            width: 56,
            height: 56,
            borderRadius: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(212,243,107,0.14)",
          }}
        >
          <CheckCircle2 size={28} color={palette.lime} />
        </motion.div>

        <Typography variant="overline" sx={{ color: palette.lime, letterSpacing: "0.2em" }}>
          {meta.fileNo} · Solved
        </Typography>

        <Typography className="font-display" sx={{ mt: 1.5, fontSize: "1.35rem", lineHeight: 1.35, color: "text.primary" }}>
          &ldquo;{meta.lead}&rdquo;
        </Typography>

        <Stack direction="row" gap={1} justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>Recovered</Typography>
          <Chip label={meta.recovered} size="small" color="secondary" variant="outlined" />
        </Stack>

        <Button
          variant="contained"
          size="large"
          endIcon={<ArrowRight size={16} />}
          onClick={onAdvance}
          autoFocus
          sx={{ mt: 3.5 }}
        >
          Follow the lead
        </Button>
      </Dialog>
    </div>
  );
}
