import { useRef, useState, type DragEvent } from "react";
import { motion, useMotionValue } from "motion/react";
import { BookKey, ListChecks } from "lucide-react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { RoomShell } from "../RoomShell";
import { ROOMS } from "../gameData";
import { PasswordModule } from "../PasswordModule";
import { CaseBrief, InfoAccordion } from "../ui";
import { palette } from "../../../theme";

interface Props {
  onComplete: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Evidence card components — exact JSX from the Figma design (Frame23-1).
// Every anomaly is faithfully preserved. No new content generated.
// ─────────────────────────────────────────────────────────────────────────────

// Card  0 — data-name "Right3"  — Digital Nomad Plan       (normal)
function ECard0() {
  return (
    <div className="bg-white border border-[#868686] flex flex-col gap-[12px] items-start p-[12px] rounded-[12px] w-full">
      <div className="flex items-center justify-between w-full">
        <div className="bg-[#eff6ff] flex items-center px-[8px] py-[2px] rounded-full">
          <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-[#002ebe] text-[12px] whitespace-nowrap">Coverage Included</p>
        </div>
        <p className="font-['Menlo:Regular',sans-serif] text-[#767676] text-[8px] whitespace-nowrap">v2.4.1</p>
      </div>
      <div className="flex flex-col gap-[4px] w-full">
        <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-black text-[24px] w-full">Digital Nomad Plan</p>
        <p className="font-['Elevance_Sans:Medium',sans-serif] leading-[1.5] text-black text-[14px] w-full">Global coverage for remote workers on the move.</p>
      </div>
      <div className="flex gap-[12px] w-full">
        <div className="border border-[#1a6fdb] flex flex-1 items-center justify-center px-[12px] py-[4px] rounded-[8px]">
          <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-[#1a6fdb] text-[14px] whitespace-nowrap">Learn More</p>
        </div>
        <div className="bg-[#1a6fdb] border border-[#1a6fdb] flex flex-1 items-center justify-center px-[12px] py-[4px] rounded-[8px]">
          <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-[14px] text-white whitespace-nowrap">Continue</p>
        </div>
      </div>
      <p className="font-['Elevance_Sans:Medium',sans-serif] leading-[1.5] text-[#767676] text-[12px] w-full">Updated 2 days ago</p>
    </div>
  );
}

// Card  1 — data-name "V-02"   — Student Health Cover
// ANOMALY: badge container uses gap-[4px] items-center, not justify-between
function ECard1() {
  return (
    <div className="bg-white border border-[#868686] flex flex-col gap-[12px] items-start p-[12px] rounded-[12px] w-full">
      <div className="flex gap-[4px] items-center w-full">
        <div className="bg-[#eff6ff] flex items-center px-[8px] py-[2px] rounded-full">
          <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-[#002ebe] text-[12px] whitespace-nowrap">Coverage Included</p>
        </div>
        <p className="font-['Menlo:Regular',sans-serif] text-[#767676] text-[8px] whitespace-nowrap">v2.4.1</p>
      </div>
      <div className="flex flex-col gap-[4px] w-full">
        <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-black text-[24px] w-full">Student Health Cover</p>
        <p className="font-['Elevance_Sans:Medium',sans-serif] leading-[1.5] text-black text-[14px] w-full">Budget-friendly plans for university students.</p>
      </div>
      <div className="flex gap-[12px] w-full">
        <div className="border border-[#1a6fdb] flex flex-1 items-center justify-center px-[12px] py-[4px] rounded-[8px]">
          <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-[#1a6fdb] text-[14px] whitespace-nowrap">Learn More</p>
        </div>
        <div className="bg-[#1a6fdb] border border-[#1a6fdb] flex flex-1 items-center justify-center px-[12px] py-[4px] rounded-[8px]">
          <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-[14px] text-white whitespace-nowrap">Continue</p>
        </div>
      </div>
      <p className="font-['Elevance_Sans:Medium',sans-serif] leading-[1.5] text-[#767676] text-[12px] w-full">Updated 2 days ago</p>
    </div>
  );
}

// Card  2 — data-name "Right5" — Weekend Warrior Plan       (normal)
function ECard2() {
  return (
    <div className="bg-white border border-[#868686] flex flex-col gap-[12px] items-start p-[12px] rounded-[12px] w-full">
      <div className="flex items-center justify-between w-full">
        <div className="bg-[#eff6ff] flex items-center px-[8px] py-[2px] rounded-full">
          <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-[#002ebe] text-[12px] whitespace-nowrap">Coverage Included</p>
        </div>
        <p className="font-['Menlo:Regular',sans-serif] text-[#767676] text-[8px] whitespace-nowrap">v2.4.1</p>
      </div>
      <div className="flex flex-col gap-[4px] w-full">
        <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-black text-[24px] w-full">Weekend Warrior Plan</p>
        <p className="font-['Elevance_Sans:Medium',sans-serif] leading-[1.5] text-black text-[14px] w-full">Extra protection for sports and outdoor adventures.</p>
      </div>
      <div className="flex gap-[12px] w-full">
        <div className="border border-[#1a6fdb] flex flex-1 items-center justify-center px-[12px] py-[4px] rounded-[8px]">
          <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-[#1a6fdb] text-[14px] whitespace-nowrap">Learn More</p>
        </div>
        <div className="bg-[#1a6fdb] border border-[#1a6fdb] flex flex-1 items-center justify-center px-[12px] py-[4px] rounded-[8px]">
          <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-[14px] text-white whitespace-nowrap">Continue</p>
        </div>
      </div>
      <p className="font-['Elevance_Sans:Medium',sans-serif] leading-[1.5] text-[#767676] text-[12px] w-full">Updated 2 days ago</p>
    </div>
  );
}

// Card  3 — data-name "Right2" — Senior Care Plus Plan      (normal, title wraps)
function ECard3() {
  return (
    <div className="bg-white border border-[#868686] flex flex-col gap-[12px] items-start p-[12px] rounded-[12px] w-full">
      <div className="flex items-center justify-between w-full">
        <div className="bg-[#eff6ff] flex items-center px-[8px] py-[2px] rounded-full">
          <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-[#002ebe] text-[12px] whitespace-nowrap">Coverage Included</p>
        </div>
        <p className="font-['Menlo:Regular',sans-serif] text-[#767676] text-[8px] whitespace-nowrap">v2.4.1</p>
      </div>
      <div className="flex flex-col gap-[4px] w-full">
        <div className="font-['Elevance_Sans:Semibold',sans-serif] leading-[0] text-[24px] w-full">
          <p className="leading-[1.5] mb-0">Senior Care Plus</p>
          <p className="leading-[1.5]">Plan</p>
        </div>
        <p className="font-['Elevance_Sans:Medium',sans-serif] leading-[1.5] text-black text-[14px] w-full">Tailored benefits for adults over 60.</p>
      </div>
      <div className="flex gap-[12px] w-full">
        <div className="border border-[#1a6fdb] flex flex-1 items-center justify-center px-[12px] py-[4px] rounded-[8px]">
          <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-[#1a6fdb] text-[14px] whitespace-nowrap">Learn More</p>
        </div>
        <div className="bg-[#1a6fdb] border border-[#1a6fdb] flex flex-1 items-center justify-center px-[12px] py-[4px] rounded-[8px]">
          <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-[14px] text-white whitespace-nowrap">Continue</p>
        </div>
      </div>
      <p className="font-['Elevance_Sans:Medium',sans-serif] leading-[1.5] text-[#767676] text-[12px] w-full">Updated 2 days ago</p>
    </div>
  );
}

// Card  4 — data-name "V-15"  — Travel Health Shield
// ANOMALY: badge font is Bold + text-black instead of Semibold + #002ebe
function ECard4() {
  return (
    <div className="bg-white border border-[#868686] flex flex-col gap-[12px] items-start p-[12px] rounded-[12px] w-full">
      <div className="flex items-center justify-between w-full">
        <div className="bg-[#eff6ff] flex items-center px-[8px] py-[2px] rounded-full">
          <p className="font-['Elevance_Sans:Bold',sans-serif] leading-[1.5] text-[12px] text-black whitespace-nowrap">Coverage Included</p>
        </div>
        <p className="font-['Menlo:Regular',sans-serif] text-[#767676] text-[8px] whitespace-nowrap">v2.4.1</p>
      </div>
      <div className="flex flex-col gap-[4px] w-full">
        <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-black text-[24px] w-full">Travel Health Shield</p>
        <p className="font-['Elevance_Sans:Medium',sans-serif] leading-[1.5] text-black text-[14px] w-full">Stay protected wherever your journey takes you.</p>
      </div>
      <div className="flex gap-[12px] w-full">
        <div className="border border-[#1a6fdb] flex flex-1 items-center justify-center px-[12px] py-[4px] rounded-[8px]">
          <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-[#1a6fdb] text-[14px] whitespace-nowrap">Learn More</p>
        </div>
        <div className="bg-[#1a6fdb] border border-[#1a6fdb] flex flex-1 items-center justify-center px-[12px] py-[4px] rounded-[8px]">
          <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-[14px] text-white whitespace-nowrap">Continue</p>
        </div>
      </div>
      <p className="font-['Elevance_Sans:Medium',sans-serif] leading-[1.5] text-[#767676] text-[12px] w-full">Updated 2 days ago</p>
    </div>
  );
}

// Card  5 — data-name "V-05"  — Family wellness plan
// ANOMALY: title lowercase "Family wellness plan"
function ECard5() {
  return (
    <div className="bg-white border border-[#868686] flex flex-col gap-[12px] items-start p-[12px] rounded-[12px] w-full">
      <div className="flex items-center justify-between w-full">
        <div className="bg-[#eff6ff] flex items-center px-[8px] py-[2px] rounded-full">
          <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-[#002ebe] text-[12px] whitespace-nowrap">Coverage Included</p>
        </div>
        <p className="font-['Menlo:Regular',sans-serif] text-[#767676] text-[8px] whitespace-nowrap">v2.4.1</p>
      </div>
      <div className="flex flex-col gap-[4px] w-full">
        <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-black text-[24px] w-full">Family wellness plan</p>
        <p className="font-['Elevance_Sans:Medium',sans-serif] leading-[1.5] text-black text-[14px] w-full">Comprehensive care for the whole family.</p>
      </div>
      <div className="flex gap-[12px] w-full">
        <div className="border border-[#1a6fdb] flex flex-1 items-center justify-center px-[12px] py-[4px] rounded-[8px]">
          <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-[#1a6fdb] text-[14px] whitespace-nowrap">Learn More</p>
        </div>
        <div className="bg-[#1a6fdb] border border-[#1a6fdb] flex flex-1 items-center justify-center px-[12px] py-[4px] rounded-[8px]">
          <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-[14px] text-white whitespace-nowrap">Continue</p>
        </div>
      </div>
      <p className="font-['Elevance_Sans:Medium',sans-serif] leading-[1.5] text-[#767676] text-[12px] w-full">Updated 2 days ago</p>
    </div>
  );
}

// Card  6 — data-name "V-18"  — Dental & Vision Plan
// ANOMALY: footer "Updated 2 Days Ago" (mixed capitalisation)
function ECard6() {
  return (
    <div className="bg-white border border-[#868686] flex flex-col gap-[12px] items-start p-[12px] rounded-[12px] w-full">
      <div className="flex items-center justify-between w-full">
        <div className="bg-[#eff6ff] flex items-center px-[8px] py-[2px] rounded-full">
          <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-[#002ebe] text-[12px] whitespace-nowrap">Coverage Included</p>
        </div>
        <p className="font-['Menlo:Regular',sans-serif] text-[#767676] text-[8px] whitespace-nowrap">v2.4.1</p>
      </div>
      <div className="flex flex-col gap-[4px] w-full">
        <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-black text-[24px] w-full">{`Dental & Vision Plan`}</p>
        <p className="font-['Elevance_Sans:Medium',sans-serif] leading-[1.5] text-black text-[14px] w-full">Keep your smile bright and vision clear.</p>
      </div>
      <div className="flex gap-[12px] w-full">
        <div className="border border-[#1a6fdb] flex flex-1 items-center justify-center px-[12px] py-[4px] rounded-[8px]">
          <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-[#1a6fdb] text-[14px] whitespace-nowrap">Learn More</p>
        </div>
        <div className="bg-[#1a6fdb] border border-[#1a6fdb] flex flex-1 items-center justify-center px-[12px] py-[4px] rounded-[8px]">
          <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-[14px] text-white whitespace-nowrap">Continue</p>
        </div>
      </div>
      <p className="font-['Elevance_Sans:Medium',sans-serif] leading-[1.5] text-[#767676] text-[12px] w-full">Updated 2 Days Ago</p>
    </div>
  );
}

// Card  7 — data-name "Right4" — Pet Owner Wellness          (normal)
function ECard7() {
  return (
    <div className="bg-white border border-[#868686] flex flex-col gap-[12px] items-start p-[12px] rounded-[12px] w-full">
      <div className="flex items-center justify-between w-full">
        <div className="bg-[#eff6ff] flex items-center px-[8px] py-[2px] rounded-full">
          <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-[#002ebe] text-[12px] whitespace-nowrap">Coverage Included</p>
        </div>
        <p className="font-['Menlo:Regular',sans-serif] text-[#767676] text-[8px] whitespace-nowrap">v2.4.1</p>
      </div>
      <div className="flex flex-col gap-[4px] w-full">
        <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-black text-[24px] w-full">Pet Owner Wellness</p>
        <p className="font-['Elevance_Sans:Medium',sans-serif] leading-[1.5] text-black text-[14px] w-full">Bundled health benefits for you and your furry friend.</p>
      </div>
      <div className="flex gap-[12px] w-full">
        <div className="border border-[#1a6fdb] flex flex-1 items-center justify-center px-[12px] py-[4px] rounded-[8px]">
          <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-[#1a6fdb] text-[14px] whitespace-nowrap">Learn More</p>
        </div>
        <div className="bg-[#1a6fdb] border border-[#1a6fdb] flex flex-1 items-center justify-center px-[12px] py-[4px] rounded-[8px]">
          <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-[14px] text-white whitespace-nowrap">Continue</p>
        </div>
      </div>
      <p className="font-['Elevance_Sans:Medium',sans-serif] leading-[1.5] text-[#767676] text-[12px] w-full">Updated 2 days ago</p>
    </div>
  );
}

// Card  8 — data-name "V-22"  — Fitness & Recovery
// ANOMALY: badge text-[#9cb4ff] + Medium weight (should be #002ebe Semibold)
function ECard8() {
  return (
    <div className="bg-white border border-[#868686] flex flex-col gap-[12px] items-start p-[12px] rounded-[12px] w-full">
      <div className="flex items-center justify-between w-full">
        <div className="bg-[#eff6ff] flex items-center px-[8px] py-[2px] rounded-full">
          <p className="font-['Elevance_Sans:Medium',sans-serif] leading-[1.5] text-[#9cb4ff] text-[12px] whitespace-nowrap">Coverage Included</p>
        </div>
        <p className="font-['Menlo:Regular',sans-serif] text-[#767676] text-[8px] whitespace-nowrap">v2.4.1</p>
      </div>
      <div className="flex flex-col gap-[4px] w-full">
        <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-black text-[24px] w-full">{`Fitness & Recovery`}</p>
        <p className="font-['Elevance_Sans:Medium',sans-serif] leading-[1.5] text-black text-[14px] w-full">Plans that reward an active lifestyle.</p>
      </div>
      <div className="flex gap-[12px] w-full">
        <div className="border border-[#1a6fdb] flex flex-1 items-center justify-center px-[12px] py-[4px] rounded-[8px]">
          <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-[#1a6fdb] text-[14px] whitespace-nowrap">Learn More</p>
        </div>
        <div className="bg-[#1a6fdb] border border-[#1a6fdb] flex flex-1 items-center justify-center px-[12px] py-[4px] rounded-[8px]">
          <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-[14px] text-white whitespace-nowrap">Continue</p>
        </div>
      </div>
      <p className="font-['Elevance_Sans:Medium',sans-serif] leading-[1.5] text-[#767676] text-[12px] w-full">Updated 2 days ago</p>
    </div>
  );
}

// Card  9 — data-name "Right"  — Essential Health Plan       (normal)
function ECard9() {
  return (
    <div className="bg-white border border-[#868686] flex flex-col gap-[12px] items-start p-[12px] rounded-[12px] w-full">
      <div className="flex items-center justify-between w-full">
        <div className="bg-[#eff6ff] flex items-center px-[8px] py-[2px] rounded-full">
          <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-[#002ebe] text-[12px] whitespace-nowrap">Coverage Included</p>
        </div>
        <p className="font-['Menlo:Regular',sans-serif] text-[#767676] text-[8px] whitespace-nowrap">v2.4.1</p>
      </div>
      <div className="flex flex-col gap-[4px] w-full">
        <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-black text-[24px] w-full">Essential Health Plan</p>
        <p className="font-['Elevance_Sans:Medium',sans-serif] leading-[1.5] text-black text-[14px] w-full">Affordable coverage for everyday medical needs.</p>
      </div>
      <div className="flex gap-[12px] w-full">
        <div className="border border-[#1a6fdb] flex flex-1 items-center justify-center px-[12px] py-[4px] rounded-[8px]">
          <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-[#1a6fdb] text-[14px] whitespace-nowrap">Learn More</p>
        </div>
        <div className="bg-[#1a6fdb] border border-[#1a6fdb] flex flex-1 items-center justify-center px-[12px] py-[4px] rounded-[8px]">
          <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-[14px] text-white whitespace-nowrap">Continue</p>
        </div>
      </div>
      <p className="font-['Elevance_Sans:Medium',sans-serif] leading-[1.5] text-[#767676] text-[12px] w-full">Updated 2 days ago</p>
    </div>
  );
}

// Card 10 — data-name "V-19"  — Critical Illness Plan
// ANOMALY: both buttons are outline only (Continue has no blue fill)
function ECard10() {
  return (
    <div className="bg-white border border-[#868686] flex flex-col gap-[12px] items-start p-[12px] rounded-[12px] w-full">
      <div className="flex items-center justify-between w-full">
        <div className="bg-[#eff6ff] flex items-center px-[8px] py-[2px] rounded-full">
          <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-[#002ebe] text-[12px] whitespace-nowrap">Coverage Included</p>
        </div>
        <p className="font-['Menlo:Regular',sans-serif] text-[#767676] text-[8px] whitespace-nowrap">v2.4.1</p>
      </div>
      <div className="flex flex-col gap-[4px] w-full">
        <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-black text-[24px] w-full">Critical Illness Plan</p>
        <p className="font-['Elevance_Sans:Medium',sans-serif] leading-[1.5] text-black text-[14px] w-full">Financial safety net for serious diagnoses.</p>
      </div>
      <div className="flex gap-[12px] w-full">
        <div className="border border-[#1a6fdb] flex flex-1 items-center justify-center px-[12px] py-[4px] rounded-[8px]">
          <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-[#1a6fdb] text-[14px] whitespace-nowrap">Learn More</p>
        </div>
        <div className="border border-[#1a6fdb] flex flex-1 items-center justify-center px-[12px] py-[4px] rounded-[8px]">
          <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-[#1a6fdb] text-[14px] whitespace-nowrap">Continue</p>
        </div>
      </div>
      <p className="font-['Elevance_Sans:Medium',sans-serif] leading-[1.5] text-[#767676] text-[12px] w-full">Updated 2 days ago</p>
    </div>
  );
}

// Card 11 — data-name "V-05"  — Maternity Care Plan
// ANOMALY: entire card content right-aligned (badge row, title, description, footer)
function ECard11() {
  return (
    <div className="bg-white border border-[#868686] flex flex-col gap-[12px] items-end p-[12px] rounded-[12px] w-full">
      <div className="flex gap-[4px] items-center justify-end w-full">
        <div className="bg-[#eff6ff] flex items-center px-[8px] py-[2px] rounded-full">
          <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-[#002ebe] text-[12px] whitespace-nowrap">Coverage Included</p>
        </div>
        <p className="font-['Menlo:Regular',sans-serif] text-[#767676] text-[8px] whitespace-nowrap">v2.4.1</p>
      </div>
      <div className="flex flex-col gap-[4px] items-end w-full text-right">
        <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-black text-[24px] w-full">Maternity Care Plan</p>
        <p className="font-['Elevance_Sans:Medium',sans-serif] leading-[1.5] text-black text-[14px] w-full">Support through every stage of pregnancy.</p>
      </div>
      <div className="flex gap-[12px] w-full">
        <div className="border border-[#1a6fdb] flex flex-1 items-center justify-center px-[12px] py-[4px] rounded-[8px]">
          <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-[#1a6fdb] text-[14px] whitespace-nowrap">Learn More</p>
        </div>
        <div className="bg-[#1a6fdb] border border-[#1a6fdb] flex flex-1 items-center justify-center px-[12px] py-[4px] rounded-[8px]">
          <p className="font-['Elevance_Sans:Semibold',sans-serif] leading-[1.5] text-[14px] text-white whitespace-nowrap">Continue</p>
        </div>
      </div>
      <p className="font-['Elevance_Sans:Medium',sans-serif] leading-[1.5] text-[#767676] text-[12px] w-full text-right">Updated 2 Days Ago</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Card registry — name is internal only, never shown to players.
// UV logic: name.startsWith("V-") → reveal name. All others → no reaction.
// ─────────────────────────────────────────────────────────────────────────────
const CARD_DEFS = [
  { name: "Right3", Card: ECard0  },
  { name: "V-02",   Card: ECard1  },
  { name: "Right5", Card: ECard2  },
  { name: "V-18",   Card: ECard3  },
  { name: "V-15",   Card: ECard4  },
  { name: "V-05",   Card: ECard5  },
  { name: "V-18",   Card: ECard6  },
  { name: "Right4", Card: ECard7  },
  { name: "V-22",   Card: ECard8  },
  { name: "Right",  Card: ECard9  },
  { name: "V-19",   Card: ECard10 },
  { name: "V-05",   Card: ECard11 },
] as const;

const AUDIT_CHECKLIST = [
  "Heading hierarchy",
  "Body contrast ratio",
  "Button states",
  "Spacing rhythm",
  "Capitalisation",
  "Border consistency",
  "Content alignment",
];

/* ── UV Magnifying Glass tool ────────────────────────────────────── */
const LENS_R = 46; // on-screen lens radius in px (matches SVG geometry below)

function UVScannerTool({
  active,
  constraintsRef,
  onDragStart,
  onDragEnd,
  onMove,
}: {
  active: boolean;
  constraintsRef: React.RefObject<HTMLElement | null>;
  onDragStart: () => void;
  onDragEnd: () => void;
  onMove: (center: { x: number; y: number }) => void;
}) {
  const lensRef = useRef<HTMLDivElement>(null);
  // Own the position so hover/re-render animations never reset where the user dropped it
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const report = () => {
    const r = lensRef.current?.getBoundingClientRect();
    if (r) onMove({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };
  const glow = active ? "#b18cff" : "#d9b26a";

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={constraintsRef}
      dragElastic={0}
      style={{ x, y }}
      onDragStart={() => {
        onDragStart();
        report();
      }}
      onDrag={report}
      onDragEnd={onDragEnd}
      whileHover={{ rotate: -4 }}
      whileDrag={{ scale: 1.05, rotate: -10 }}
      aria-label="UV magnifying glass — drag over cards to scan"
      className="relative z-40 flex cursor-grab touch-none select-none flex-col items-center gap-1.5 active:cursor-grabbing"
    >
      <div className="relative" style={{ width: 132, height: 150 }}>
        {/* Lens hit-area used to compute the reveal position */}
        <div
          ref={lensRef}
          className="pointer-events-none absolute rounded-full"
          style={{ left: 54 - LENS_R, top: 54 - LENS_R, width: LENS_R * 2, height: LENS_R * 2 }}
        />
        <svg
          width="132"
          height="150"
          viewBox="0 0 132 150"
          fill="none"
          style={{
            filter: active
              ? "drop-shadow(0 0 18px rgba(160,120,255,0.55)) drop-shadow(0 10px 18px rgba(0,0,0,0.6))"
              : "drop-shadow(0 10px 18px rgba(0,0,0,0.65))",
            transition: "filter 0.3s ease",
          }}
        >
          <defs>
            <linearGradient id="mg-brass" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f5dc9c" />
              <stop offset="0.45" stopColor="#c89b4a" />
              <stop offset="0.75" stopColor="#8a6428" />
              <stop offset="1" stopColor="#e2c078" />
            </linearGradient>
            <linearGradient id="mg-wood" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#3b2414" />
              <stop offset="0.5" stopColor="#6b4426" />
              <stop offset="1" stopColor="#2e1b0e" />
            </linearGradient>
            <radialGradient id="mg-glass" cx="0.38" cy="0.35" r="0.75">
              <stop offset="0" stopColor={active ? "rgba(190,160,255,0.28)" : "rgba(255,248,230,0.16)"} />
              <stop offset="0.7" stopColor={active ? "rgba(90,50,200,0.14)" : "rgba(255,248,230,0.05)"} />
              <stop offset="1" stopColor={active ? "rgba(60,20,160,0.3)" : "rgba(0,0,0,0.18)"} />
            </radialGradient>
          </defs>

          {/* Handle */}
          <g transform="rotate(45 54 54)">
            <rect x="99" y="47" width="12" height="14" rx="2" fill="url(#mg-brass)" />
            <rect x="110" y="45.5" width="44" height="17" rx="8.5" fill="url(#mg-wood)" />
            {[120, 128, 136, 144].map((x) => (
              <line key={x} x1={x} y1="48" x2={x} y2="60" stroke="rgba(0,0,0,0.35)" strokeWidth="1" />
            ))}
            <circle cx="152" cy="54" r="3" fill="url(#mg-brass)" />
          </g>

          {/* Glass */}
          <circle cx="54" cy="54" r={LENS_R} fill="url(#mg-glass)" />
          {/* Rim */}
          <circle cx="54" cy="54" r={LENS_R + 3} stroke="url(#mg-brass)" strokeWidth="7" />
          <circle cx="54" cy="54" r={LENS_R - 0.5} stroke="rgba(0,0,0,0.45)" strokeWidth="1" />
          <circle cx="54" cy="54" r={LENS_R + 6.5} stroke="rgba(0,0,0,0.35)" strokeWidth="0.8" />
          {/* Glare */}
          <path d="M26 40 A32 32 0 0 1 48 22" stroke="rgba(255,255,255,0.55)" strokeWidth="4" strokeLinecap="round" />
          <path d="M24 52 A32 32 0 0 1 25.5 46" stroke="rgba(255,255,255,0.35)" strokeWidth="3" strokeLinecap="round" />
          {/* UV emitter indicator on rim */}
          <circle cx="54" cy={54 - LENS_R - 3} r="3" fill={glow}>
            {active && <animate attributeName="opacity" values="1;0.35;1" dur="1.2s" repeatCount="indefinite" />}
          </circle>
        </svg>
      </div>

      <span
        className="rounded-full border px-2.5 py-0.5 font-type text-[9px] uppercase tracking-[0.24em] transition-colors duration-300"
        style={{
          color: active ? "#cbb4ff" : "rgba(217,178,106,0.75)",
          borderColor: active ? "rgba(177,140,255,0.45)" : "rgba(217,178,106,0.25)",
          background: active ? "rgba(90,50,200,0.15)" : "rgba(0,0,0,0.25)",
        }}
      >
        {active ? "UV on · sweep over cards" : "Drag to scan"}
      </span>
    </motion.div>
  );
}

/* ── Room ────────────────────────────────────────────────────────── */
export function Room01_VisualEvidence({ onComplete }: Props) {
  const [solved, setSolved] = useState(false);
  // Track by index: handles the two cards that share the name "V-05" independently.
  const [examined, setExamined] = useState<Set<number>>(new Set());
  const [uvDragging, setUvDragging] = useState(false);
  const [lensPos, setLensPos] = useState<{ x: number; y: number } | null>(null);
  const cardRefs = useRef(new Map<number, HTMLDivElement>());
  const [dropTarget, setDropTarget] = useState<"review" | "archive" | null>(null);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const investigationRef = useRef<HTMLDivElement>(null);

  const toggle = (idx: number) => {
    setExamined((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const setExaminedFor = (idx: number, on: boolean) =>
    setExamined((prev) => {
      if (prev.has(idx) === on) return prev;
      const next = new Set(prev);
      if (on) next.add(idx);
      else next.delete(idx);
      return next;
    });

  const cardDragProps = (idx: number, from: "archive" | "review") => ({
    draggable: true,
    onDragStart: (e: DragEvent) => {
      e.dataTransfer.setData("text/plain", `${from}:${idx}`);
      e.dataTransfer.effectAllowed = "move";
      setDraggingIdx(idx);
    },
    onDragEnd: () => {
      setDraggingIdx(null);
      setDropTarget(null);
    },
  });

  const dropZoneProps = (zone: "archive" | "review") => ({
    onDragOver: (e: DragEvent) => {
      if (draggingIdx === null) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (dropTarget !== zone) setDropTarget(zone);
    },
    onDragLeave: (e: DragEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node)) setDropTarget(null);
    },
    onDrop: (e: DragEvent) => {
      e.preventDefault();
      const [from, raw] = e.dataTransfer.getData("text/plain").split(":");
      const idx = Number(raw);
      if (!Number.isNaN(idx) && from !== zone) setExaminedFor(idx, zone === "review");
      setDropTarget(null);
      setDraggingIdx(null);
    },
  });

  const examEntries = CARD_DEFS
    .map((def, idx) => ({ ...def, idx }))
    .filter(({ idx }) => examined.has(idx));

  const handlePasswordSuccess = () => {
    setSolved(true);
    setTimeout(onComplete, 2000);
  };

  return (
    <RoomShell
      meta={ROOMS[0]}
      hint="Compare all twelve cards. Inconsistencies are professional — only experienced designers catch them quickly."
      solved={solved}
      onAdvance={onComplete}
    >
      <div className="flex h-full flex-col gap-5">

        {/* ── 1. Case Brief ── */}
        <CaseBrief
          kicker="Design Review Investigation · DS v2.4 Component Audit"
          notesTitle="Researcher's notes"
          notes={["Check spacing rhythm", "Component mismatch?", "Feels slightly off"]}
        >
          Twelve design review cards were recovered from the researcher&apos;s final audit session.
          Most passed review. Some did not. Identify the inconsistencies.
        </CaseBrief>

        {/* ── 2. Main Board: Archive ←→ Investigation ── */}
        <div className="grid shrink-0 grid-cols-1 gap-5 lg:grid-cols-[1.85fr_1fr]">

          {/* Evidence Archive — 3×4 grid, all 12 cards always visible */}
          <section
            {...dropZoneProps("archive")}
            className={`relative overflow-hidden rounded-xl border bg-black/20 p-5 shadow-inner transition-colors ${
              dropTarget === "archive" ? "border-[var(--noir-gold)]/60 bg-[var(--noir-gold)]/[0.04]" : "border-[var(--noir-line)]"
            }`}
          >
            <div className="mb-4 flex items-center justify-between gap-2">
              <div>
                <h2 className="font-type text-[13px] uppercase tracking-[0.2em] text-[var(--noir-gold)]">
                  Evidence Archive
                </h2>
                <p className="mt-0.5 font-type text-[9px] uppercase tracking-widest text-[var(--noir-fog-dim)]">
                  Design System v2.4 · 12 components recovered
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--noir-gold)]/15 font-mono text-[10px] font-bold text-[var(--noir-gold)]">
                  {examined.size}
                </span>
                <span className="font-type text-[10px] uppercase tracking-widest text-[var(--noir-fog-dim)]">
                  selected · click or drag to examine
                </span>
              </div>
            </div>

            {/* 3×4 grid — scaled to 72% so all 12 cards fit cleanly without scrolling */}
            <div className="overflow-hidden rounded-lg">
              <div
                style={{ zoom: 0.72 }}
                className="grid grid-cols-3 auto-rows-fr gap-3"
              >
                {CARD_DEFS.map(({ Card }, idx) => (
                  <motion.div
                    key={idx}
                    onClick={() => toggle(idx)}
                    whileHover={{ y: -2, boxShadow: "0 12px 28px -8px rgba(0,0,0,0.5)" }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="relative cursor-pointer rounded-[12px] overflow-hidden flex flex-col"
                  >
                    {/* Wrapper forces every card to fill the row height, pinning footer to bottom */}
                    <div
                      {...cardDragProps(idx, "archive")}
                      className={`flex flex-col h-full cursor-grab active:cursor-grabbing transition-opacity ${draggingIdx === idx ? "opacity-40" : ""} [&>div]:flex [&>div]:flex-col [&>div]:h-full [&>div]:justify-between`}
                    >
                      <Card />
                    </div>
                    {/* Selection ring — appears on click, card stays fully visible */}
                    {examined.has(idx) && (
                      <div className="absolute inset-0 z-10 rounded-[12px] ring-2 ring-[var(--noir-gold)] pointer-events-none" />
                    )}
                    {/* Selection badge */}
                    {examined.has(idx) && (
                      <div className="absolute left-2 top-2 z-20 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[var(--noir-gold)] pointer-events-none">
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                          <path d="M1 3.5L3.5 6L8 1" stroke="#12100e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Investigation Board */}
          <div className="flex flex-col gap-3">

            {/* Evidence Under Review — UV scanning only happens here */}
            <div
              ref={investigationRef}
              {...dropZoneProps("review")}
              className={`relative flex flex-1 flex-col gap-3 overflow-hidden rounded-xl border-2 p-4 transition-colors ${
                dropTarget === "review"
                  ? "border-[var(--noir-gold)] bg-[var(--noir-gold)]/[0.07] shadow-[inset_0_0_40px_rgba(217,178,106,0.12)]"
                  : draggingIdx !== null && !examined.has(draggingIdx)
                    ? "border-dashed border-[var(--noir-gold)]/60 bg-black/25"
                    : "border-[var(--noir-gold)]/30 bg-black/25"
              }`}
              style={{ minHeight: 480 }}
            >
              <div className="shrink-0 border-b border-[var(--noir-gold)]/20 pb-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-type text-[12px] uppercase tracking-[0.22em] text-[var(--noir-gold)]">
                    Evidence Under Review
                  </h3>
                  {examEntries.length > 0 && (
                    <span className="rounded-full bg-[var(--noir-gold)]/15 px-2 py-0.5 font-type text-[9px] uppercase tracking-widest text-[var(--noir-gold)]">
                      {examEntries.length} flagged
                    </span>
                  )}
                </div>
                <p className="mt-0.5 font-type text-[9px] uppercase tracking-widest text-[var(--noir-fog-dim)]">
                  Drop cards here · click or drag back to return · sweep the glass over a card to reveal UV marks
                </p>
              </div>

              {/*
                Each selected card is shown as the actual visual card + UV overlay.
                Internal names are NEVER rendered. The card content itself is the evidence.
              */}
              <div className="flex-1 overflow-y-auto">
                {examEntries.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {examEntries.map(({ name, Card, idx }) => {
                      const uvCode = name.startsWith("V-") ? name : null;
                      return (
                        <div
                          key={idx}
                          ref={(el) => {
                            if (el) cardRefs.current.set(idx, el);
                            else cardRefs.current.delete(idx);
                          }}
                          onClick={() => toggle(idx)}
                          {...cardDragProps(idx, "review")}
                          className={`group relative cursor-grab overflow-hidden rounded-[12px] active:cursor-grabbing ${draggingIdx === idx ? "opacity-40" : ""}`}
                        >
                          {/* Actual Figma card visual — appears completely normal */}
                          <Card />

                          {/* Deselect affordance on hover */}
                          <div className="absolute right-2 top-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white text-[11px] font-bold leading-none">
                              ×
                            </div>
                          </div>

                          {/*
                            UV reveal overlay — invisible ink / archive stamp effect.
                            Appears ONLY when scanner is actively being dragged.
                            Right cards (no V- prefix): nothing ever appears here.
                          */}
                          {(() => {
                            const rect = cardRefs.current.get(idx)?.getBoundingClientRect();
                            if (!uvDragging || !lensPos || !rect) return null;
                            const lx = lensPos.x - rect.left;
                            const ly = lensPos.y - rect.top;
                            const overlaps =
                              lx > -LENS_R && lx < rect.width + LENS_R && ly > -LENS_R && ly < rect.height + LENS_R;
                            if (!overlaps) return null;
                            return (
                              <div
                                className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center"
                                style={{
                                  background: "radial-gradient(circle at center, rgba(40,10,110,0.94), rgba(10,0,50,0.96))",
                                  clipPath: `circle(${LENS_R}px at ${lx}px ${ly}px)`,
                                }}
                              >
                                {uvCode ? (
                                  <>
                                    <span
                                      className="font-mono font-semibold tracking-[0.24em] text-[#e9c46a]"
                                      style={{
                                        fontSize: "22px",
                                        textShadow:
                                          "0 0 8px rgba(233,196,106,0.95), 0 0 20px rgba(177,140,255,0.6), 0 0 40px rgba(177,140,255,0.3)",
                                      }}
                                    >
                                      {uvCode}
                                    </span>
                                    <span className="mt-1.5 font-mono uppercase tracking-[0.38em] text-[#b9a4ff]/70" style={{ fontSize: "7px" }}>
                                      anomaly detected
                                    </span>
                                  </>
                                ) : (
                                  <span className="font-mono uppercase tracking-[0.34em] text-[#b9a4ff]/45" style={{ fontSize: "8px" }}>
                                    no trace
                                  </span>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex h-full min-h-[120px] flex-col items-center justify-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--noir-gold)]/20 bg-[var(--noir-gold)]/5">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-[var(--noir-gold)]/40">
                        <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <p className="text-center font-type text-[9px] uppercase tracking-widest text-[var(--noir-fog-dim)]">
                      Drag or click cards from the archive
                      <br />
                      to examine them here
                    </p>
                  </div>
                )}
              </div>

              {/* UV Scanner — draggable tool, constrained within this panel */}
              <div className="flex shrink-0 justify-center pt-1">
                <UVScannerTool
                  active={uvDragging}
                  constraintsRef={investigationRef}
                  onDragStart={() => setUvDragging(true)}
                  onDragEnd={() => {
                    setUvDragging(false);
                    setLensPos(null);
                  }}
                  onMove={setLensPos}
                />
              </div>
            </div>

            {/* Hint — QA Audit Checklist */}
            <InfoAccordion title="Hint · QA audit checklist" icon={<ListChecks size={16} />}>
              <Stack spacing={1}>
                {AUDIT_CHECKLIST.map((item) => (
                  <Stack key={item} direction="row" alignItems="center" gap={1.25}>
                    <Box sx={{ width: 14, height: 14, flexShrink: 0, borderRadius: 1, border: "1.5px solid rgba(255,255,255,0.25)" }} />
                    <Typography variant="body2" sx={{ color: "text.primary" }}>{item}</Typography>
                  </Stack>
                ))}
              </Stack>
            </InfoAccordion>
          </div>
        </div>

        {/* ── 3. Decoder — compact accordion ── */}
        <InfoAccordion title="Archival code reference" subtitle="Design System v2.4" icon={<BookKey size={16} />}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(4, 1fr)", sm: "repeat(7, 1fr)", md: "repeat(13, 1fr)" }, gap: 1 }}>
            {Array.from({ length: 26 }).map((_, i) => (
              <Box key={i} sx={{ px: 1, py: 0.75, borderRadius: 2, bgcolor: palette.surface, textAlign: "center", fontFamily: "ui-monospace, monospace", fontSize: 11, color: "text.secondary" }}>
                V-{String(i + 1).padStart(2, "0")}{" "}
                <Box component="b" sx={{ color: palette.lime }}>{String.fromCharCode(65 + i)}</Box>
              </Box>
            ))}
          </Box>
        </InfoAccordion>

        {/* ── 4. Password ── */}
        <Paper component="section" sx={{ flexShrink: 0, p: { xs: 2.5, md: 3 }, borderRadius: 5, bgcolor: palette.surface2 }}>
          <PasswordModule
            roomIndex={1}
            onSuccess={handlePasswordSuccess}
            onError={() => undefined}
            label="Recovered Archive Word"
          />
        </Paper>
      </div>
    </RoomShell>
  );
}
