import { motion } from "motion/react";
import { ArrowRight, MapPin, CheckCircle2, Circle } from "lucide-react";
import { Box, Button, Chip, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { ROOMS } from "./gameData";
import { palette } from "../../theme";

/* The detective board — recovered leads pinned along the thread.
   Shown after each solve as the payoff + orientation for what's next. */
export function ProgressBoard({
  solvedCount,
  onContinue,
  lastFile,
}: {
  solvedCount: number;
  onContinue: () => void;
  lastFile: boolean;
}) {
  const pct = Math.round((solvedCount / ROOMS.length) * 100);

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-14">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full"
      >
        <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 6 }}>
          <Stack direction="row" alignItems="flex-end" justifyContent="space-between" gap={2} flexWrap="wrap">
            <Box>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>Investigation board</Typography>
              <Typography sx={{ mt: 0.5, fontSize: "clamp(1.5rem,4vw,2.1rem)", fontWeight: 700, color: "text.primary" }}>
                {solvedCount} of {ROOMS.length} leads recovered
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 36, fontWeight: 700, color: palette.lime, lineHeight: 1 }}>
              {pct}%
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={pct}
            sx={{ mt: 2.5, "& .MuiLinearProgress-bar": { background: `linear-gradient(90deg, ${palette.violet}, ${palette.lime})` } }}
          />

          <Stack spacing={1.25} sx={{ mt: 3.5 }}>
            {ROOMS.map((r, i) => {
              const found = i < solvedCount;
              const isNew = i === solvedCount - 1;
              const upcoming = i === solvedCount;

              return (
                <motion.div
                  key={r.id}
                  initial={isNew ? { opacity: 0, x: -16 } : false}
                  animate={{ opacity: found ? 1 : upcoming ? 0.7 : 0.35, x: 0 }}
                  transition={{ duration: 0.4, delay: isNew ? 0.1 : 0 }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: 4,
                      bgcolor: palette.surface2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      borderColor: isNew ? palette.lime : upcoming ? "rgba(143,124,245,0.4)" : palette.line,
                      boxShadow: isNew ? `0 0 0 3px rgba(212,243,107,0.12)` : "none",
                    }}
                  >
                    <Box sx={{ flexShrink: 0, display: "flex" }}>
                      {found ? (
                        <motion.span
                          initial={isNew ? { scale: 0 } : false}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.2 }}
                          style={{ display: "flex" }}
                        >
                          <CheckCircle2 size={20} color={palette.lime} />
                        </motion.span>
                      ) : (
                        <Circle size={20} color={upcoming ? palette.violet : palette.textDim} />
                      )}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>{r.fileNo}</Typography>
                      <Typography variant="body2" sx={{ color: found ? "text.primary" : "text.secondary", fontStyle: found ? "normal" : "italic" }}>
                        {found ? `“${r.lead}”` : upcoming ? "Next case file — evidence still scattered…" : "Evidence still scattered…"}
                      </Typography>
                    </Box>
                    {found && <Chip label={r.recovered} size="small" color="secondary" variant="outlined" />}
                  </Paper>
                </motion.div>
              );
            })}
          </Stack>
        </Paper>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Button
          variant="contained"
          size="large"
          onClick={onContinue}
          autoFocus
          endIcon={lastFile ? <MapPin size={16} /> : <ArrowRight size={16} />}
          sx={{ mt: 4 }}
        >
          {lastFile ? "Name the missing user" : "Open next case file"}
        </Button>
      </motion.div>
    </div>
  );
}
