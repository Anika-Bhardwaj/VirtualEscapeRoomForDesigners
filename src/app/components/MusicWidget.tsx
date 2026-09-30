import { useState, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { Volume1, Volume2, VolumeX } from "lucide-react";
import { IconButton, Paper, Popover, Slider, Stack, Tooltip, Typography } from "@mui/material";
import { bgMusic } from "../bgMusic";
import { palette } from "../theme";

export function MusicWidget() {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const volume = useSyncExternalStore(bgMusic.subscribe, bgMusic.getVolume);
  const muted = useSyncExternalStore(bgMusic.subscribe, bgMusic.isMuted);

  const silent = muted || volume === 0;
  const VolumeIcon = silent ? VolumeX : volume < 0.3 ? Volume1 : Volume2;
  const pct = Math.round((silent ? 0 : volume) * 100);

  return (
    <div className="fixed top-4 right-4 z-[200]">
      <Tooltip title="Background music">
        <IconButton
          onClick={(e) => setAnchor(e.currentTarget)}
          aria-label="Background music settings"
          aria-expanded={!!anchor}
          sx={{ width: 40, height: 40, color: silent ? "text.secondary" : palette.lime }}
        >
          <span className="flex h-3.5 items-end gap-[2px]" aria-hidden>
            {[0.5, 1, 0.7].map((h, i) => (
              <motion.span
                key={i}
                className="w-[2px] rounded-full bg-current"
                animate={!silent ? { scaleY: [h, 1, h * 0.6, h] } : { scaleY: 0.25 }}
                transition={{ duration: 1.4 + i * 0.2, repeat: silent ? 0 : Infinity, ease: "easeInOut" }}
                style={{ height: 14, transformOrigin: "bottom" }}
              />
            ))}
          </span>
        </IconButton>
      </Tooltip>

      <Popover
        open={!!anchor}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { mt: 1, borderRadius: 4 } } }}
      >
        <Paper sx={{ p: 2.5, width: 260, border: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>Background music</Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>Quiets down automatically during audio puzzles</Typography>
          <Stack direction="row" alignItems="center" gap={1.5} sx={{ mt: 2 }}>
            <IconButton
              size="small"
              onClick={() => bgMusic.setMuted(!silent)}
              aria-label={silent ? "Unmute music" : "Mute music"}
            >
              <VolumeIcon size={16} />
            </IconButton>
            <Slider
              size="small"
              min={0}
              max={0.6}
              step={0.01}
              value={silent ? 0 : volume}
              onChange={(_, v) => bgMusic.setVolume(v as number)}
              aria-label="Music volume"
            />
            <Typography variant="caption" sx={{ width: 28, textAlign: "right", color: palette.lime, fontWeight: 600 }}>
              {pct}
            </Typography>
          </Stack>
        </Paper>
      </Popover>
    </div>
  );
}
