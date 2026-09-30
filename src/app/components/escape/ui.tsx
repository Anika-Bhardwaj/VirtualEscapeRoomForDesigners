import type { ReactNode } from "react";
import { ChevronDown, FileText, FolderClosed, FolderOpen, Lock } from "lucide-react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Collapse,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { palette } from "../../theme";

const overline = { fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const };

/* ── Case brief: intro card at the top of each room ─────────────── */
export function CaseBrief({
  kicker,
  children,
  notesTitle = "Researcher note",
  notes = [],
}: {
  kicker: string;
  children: ReactNode;
  notesTitle?: string;
  notes?: string[];
}) {
  return (
    <Paper component="section" sx={{ flexShrink: 0, px: { xs: 2.5, md: 3.5 }, py: { xs: 2.5, md: 3 }, borderRadius: 5, bgcolor: palette.surface2 }}>
      <Stack direction={{ xs: "column", md: "row" }} gap={2.5} justifyContent="space-between" alignItems={{ md: "flex-start" }}>
        <Box sx={{ minWidth: 0 }}>
          <Stack direction="row" alignItems="center" gap={1}>
            <FileText size={14} color={palette.lime} />
            <Typography sx={{ ...overline, color: palette.lime }}>{kicker}</Typography>
          </Stack>
          <Typography
            className="font-display"
            sx={{ mt: 1.5, maxWidth: 640, fontSize: 19, lineHeight: 1.45, color: "text.primary" }}
          >
            {children}
          </Typography>
        </Box>
        {notes.length > 0 && <StickyNoteCard title={notesTitle} notes={notes} />}
      </Stack>
    </Paper>
  );
}

/* ── Sticky note: yellow paper, tape strip, handwritten notes ──── */
export function StickyNoteCard({ title, notes, rotate = 2 }: { title: string; notes: string[]; rotate?: number }) {
  return (
    <Box
      component="aside"
      aria-label={title}
      sx={{
        position: "relative",
        flexShrink: 0,
        alignSelf: { xs: "flex-start", md: "center" },
        width: { xs: 220, md: 210 },
        px: 2.25,
        pt: 2.75,
        pb: 2.25,
        color: "#3a3222",
        background: "linear-gradient(170deg, #fff4a8 0%, #fbe983 70%, #f3dc6e 100%)",
        borderRadius: "2px 2px 18px 2px",
        boxShadow: "0 1px 1px rgba(0,0,0,0.15), 0 14px 24px -10px rgba(0,0,0,0.7)",
        transform: `rotate(${rotate}deg)`,
        transition: "transform .25s ease",
        "&:hover": { transform: "rotate(0deg) translateY(-2px)" },
        /* curled corner */
        "&::after": {
          content: '""',
          position: "absolute",
          right: 0,
          bottom: 0,
          width: 22,
          height: 22,
          borderTopLeftRadius: 16,
          background: "linear-gradient(135deg, rgba(0,0,0,0.12) 0%, #e8cf5c 55%, #d9bd48 100%)",
          boxShadow: "-2px -2px 4px rgba(0,0,0,0.08)",
        },
      }}
    >
      {/* tape strip */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: -10,
          left: "50%",
          width: 72,
          height: 20,
          transform: "translateX(-50%) rotate(-4deg)",
          background: "rgba(255,255,255,0.35)",
          border: "1px solid rgba(255,255,255,0.25)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          backdropFilter: "blur(1px)",
        }}
      />
      <Typography sx={{ ...overline, fontSize: 9.5, letterSpacing: "0.16em", color: "rgba(58,50,34,0.6)" }}>
        {title}
      </Typography>
      <Stack spacing={0.25} sx={{ mt: 0.75 }}>
        {notes.map((n) => (
          <Typography
            key={n}
            sx={{ fontFamily: '"Caveat", "Segoe Print", cursive', fontSize: 20, fontWeight: 600, lineHeight: 1.15, color: "#2e2718" }}
          >
            {n}
          </Typography>
        ))}
      </Stack>
    </Box>
  );
}

/* ── Collapsible info panel ─────────────────────────────────────── */
export function InfoAccordion({
  title,
  subtitle,
  icon,
  children,
  defaultExpanded = false,
}: {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultExpanded?: boolean;
}) {
  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      disableGutters
      elevation={0}
      sx={{
        flexShrink: 0,
        borderRadius: "20px !important",
        bgcolor: palette.surface2,
        border: `1px solid ${palette.line}`,
        "&:before": { display: "none" },
        "&.Mui-expanded": { borderColor: "rgba(212,243,107,0.3)" },
      }}
    >
      <AccordionSummary
        expandIcon={
          <Box sx={{ display: "flex", p: 0.75, borderRadius: 999, bgcolor: palette.surface, border: `1px solid ${palette.line}` }}>
            <ChevronDown size={14} />
          </Box>
        }
        sx={{ px: { xs: 2.5, md: 3 }, minHeight: 64, "& .MuiAccordionSummary-content": { my: 1.5, alignItems: "center", gap: 1.5 } }}
      >
        {icon && <Box sx={{ display: "flex", color: palette.lime }}>{icon}</Box>}
        <Box>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.primary" }}>{title}</Typography>
          {subtitle && <Typography variant="caption" sx={{ color: "text.secondary" }}>{subtitle}</Typography>}
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ px: { xs: 2.5, md: 3 }, pb: 3, pt: 0 }}>
        <Box sx={{ borderTop: `1px solid ${palette.line}`, pt: 2 }}>{children}</Box>
      </AccordionDetails>
    </Accordion>
  );
}

/* ── Progressive hint folder (reveal one hint at a time) ────────── */
export function HintFolder({
  title,
  hints,
  level,
  onReveal,
  footer,
}: {
  title: string;
  hints: string[];
  level: number;
  onReveal: () => void;
  footer?: ReactNode;
}) {
  const Icon = level === 0 ? FolderClosed : FolderOpen;
  return (
    <Paper component="section" sx={{ flexShrink: 0, px: { xs: 2.5, md: 3 }, py: 2.5, borderRadius: 5, bgcolor: palette.surface2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
        <Stack direction="row" alignItems="center" gap={1.5}>
          <Box sx={{ display: "flex", p: 1, borderRadius: 999, bgcolor: "rgba(143,124,245,0.14)", color: palette.violet }}>
            <Icon size={16} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.primary" }}>{title}</Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {level === 0 ? "Sealed · open only if needed" : `Hint ${level} of ${hints.length} revealed`}
            </Typography>
          </Box>
        </Stack>
        {level < hints.length && (
          <Button variant="outlined" size="small" onClick={onReveal}>
            Reveal hint {level + 1}
          </Button>
        )}
      </Stack>

      <Collapse in={level > 0}>
        <Stack spacing={1.25} sx={{ mt: 2, pt: 2, borderTop: `1px solid ${palette.line}` }}>
          {hints.slice(0, level).map((hint, i) => (
            <Stack key={i} direction="row" gap={1.5} alignItems="flex-start">
              <Chip label={i + 1} size="small" sx={{ height: 20, minWidth: 20, fontSize: 11, bgcolor: "rgba(143,124,245,0.18)", color: palette.violet }} />
              <Typography variant="body2" sx={{ color: "text.primary", lineHeight: 1.6 }}>{hint}</Typography>
            </Stack>
          ))}
        </Stack>
      </Collapse>

      {footer && <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${palette.line}` }}>{footer}</Box>}
    </Paper>
  );
}

/* ── Recovered text card (researcher notes, quotes) ─────────────── */
export function NoteCard({ kicker, children, footer }: { kicker: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <Paper sx={{ p: 3, borderRadius: 4, bgcolor: palette.surface2, borderLeft: `3px solid ${palette.lime}` }}>
      <Typography sx={{ ...overline, fontSize: 10, color: palette.lime }}>{kicker}</Typography>
      <Box className="font-display" sx={{ mt: 1.5, fontSize: 16, lineHeight: 1.65, color: "text.primary", "& p + p": { mt: 1 } }}>
        {children}
      </Box>
      {footer && (
        <Stack direction="row" alignItems="center" gap={1} sx={{ mt: 2 }}>
          <Box sx={{ height: "1px", flex: 1, bgcolor: palette.line }} />
          <Typography variant="caption" sx={{ color: "text.secondary" }}>{footer}</Typography>
        </Stack>
      )}
    </Paper>
  );
}

/* ── Locked next-case preview ───────────────────────────────────── */
export function LockedCaseCard({ label, title, requirement }: { label: string; title: string; requirement: string }) {
  return (
    <Paper sx={{ flexShrink: 0, px: { xs: 2.5, md: 3 }, py: 2.5, borderRadius: 5, bgcolor: palette.surface2, opacity: 0.7, display: "flex", alignItems: "center", gap: 2 }}>
      <Box sx={{ display: "flex", p: 1.25, borderRadius: 999, bgcolor: palette.surface, border: `1px solid ${palette.line}`, color: "text.secondary" }}>
        <Lock size={16} />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>{label}</Typography>
        <Typography sx={{ fontSize: 16, fontWeight: 600, color: "text.primary" }}>{title}</Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>{requirement}</Typography>
      </Box>
      <Chip label="Locked" size="small" variant="outlined" sx={{ color: "text.secondary" }} />
    </Paper>
  );
}
