import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { RoomShell } from "../RoomShell";
import { ROOMS } from "../gameData";
import { PasswordModule } from "../PasswordModule";

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
  { name: "Right2", Card: ECard3  },
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
function UVScannerTool({
  active,
  constraintsRef,
  onDragStart,
  onDragEnd,
}: {
  active: boolean;
  constraintsRef: React.RefObject<HTMLElement | null>;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={constraintsRef}
      dragElastic={0.05}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      whileDrag={{ scale: 1.06, rotate: -6 }}
      whileHover={{ scale: 1.04 }}
      className="z-20 cursor-grab active:cursor-grabbing select-none flex flex-col items-center gap-2"
    >
      {/* Magnifying glass SVG */}
      <svg
        width="110"
        height="130"
        viewBox="0 0 110 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: active
            ? "drop-shadow(0 0 14px rgba(0,255,255,0.55)) drop-shadow(0 0 4px rgba(0,255,255,0.9))"
            : "drop-shadow(0 4px 12px rgba(0,0,0,0.6))",
          transition: "filter 0.3s ease",
        }}
      >
        {/* ── Lens outer ring ── */}
        <circle
          cx="46" cy="46" r="38"
          stroke={active ? "#22d3ee" : "#4a4060"}
          strokeWidth="5"
          fill="none"
        />

        {/* ── Lens rim bevel ── */}
        <circle
          cx="46" cy="46" r="34"
          stroke={active ? "rgba(0,255,255,0.18)" : "rgba(255,255,255,0.06)"}
          strokeWidth="2"
          fill="none"
        />

        {/* ── Lens glass fill ── */}
        <circle
          cx="46" cy="46" r="33"
          fill={active ? "rgba(0,40,60,0.82)" : "rgba(8,8,22,0.85)"}
        />

        {/* ── UV glow inner ── */}
        {active && (
          <circle
            cx="46" cy="46" r="33"
            fill="rgba(0,255,255,0.07)"
          />
        )}

        {/* ── Crosshair ── */}
        <line
          x1="46" y1="20" x2="46" y2="72"
          stroke={active ? "rgba(0,255,255,0.55)" : "rgba(255,255,255,0.10)"}
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <line
          x1="20" y1="46" x2="72" y2="46"
          stroke={active ? "rgba(0,255,255,0.55)" : "rgba(255,255,255,0.10)"}
          strokeWidth="1"
          strokeDasharray="3 3"
        />

        {/* ── Center dot ── */}
        <circle
          cx="46" cy="46" r="3"
          fill={active ? "#22d3ee" : "#3a3460"}
        />
        {active && (
          <circle cx="46" cy="46" r="6" fill="rgba(0,255,255,0.18)" />
        )}

        {/* ── Lens glare highlight ── */}
        <ellipse
          cx="34" cy="32" rx="9" ry="5"
          fill="rgba(255,255,255,0.07)"
          transform="rotate(-30 34 32)"
        />

        {/* ── Handle grip — angled down-right ── */}
        {/* Outer handle */}
        <rect
          x="73" y="73" width="34" height="13" rx="6.5"
          fill={active ? "#1a3a3a" : "#1c1830"}
          stroke={active ? "#22d3ee" : "#3a3460"}
          strokeWidth="2"
          transform="rotate(45 73 73)"
        />
        {/* Handle grip lines */}
        {[0, 7, 14].map((offset) => (
          <line
            key={offset}
            x1={80 + offset * 0.7} y1={80 + offset * 0.7}
            x2={84 + offset * 0.7} y2={84 + offset * 0.7}
            stroke={active ? "rgba(0,255,255,0.3)" : "rgba(255,255,255,0.07)"}
            strokeWidth="1.5"
            strokeLinecap="round"
            transform="rotate(45 88 88)"
          />
        ))}

        {/* ── Tick marks around lens ── */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = 46 + 40 * Math.cos(rad);
          const y1 = 46 + 40 * Math.sin(rad);
          const x2 = 46 + 43 * Math.cos(rad);
          const y2 = 46 + 43 * Math.sin(rad);
          return (
            <line
              key={deg}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={active ? "rgba(0,255,255,0.5)" : "rgba(255,255,255,0.12)"}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          );
        })}

        {/* ── UV label inside lens ── */}
        <text
          x="46" y="63"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="7"
          letterSpacing="2"
          fill={active ? "rgba(0,255,255,0.7)" : "rgba(255,255,255,0.15)"}
        >
          UV-4F
        </text>
      </svg>

      {/* Status label below */}
      <p
        className="font-mono text-[9px] uppercase tracking-[0.22em] transition-colors duration-300"
        style={{ color: active ? "rgba(0,255,255,0.75)" : "rgba(120,110,160,0.6)" }}
      >
        {active ? "Scanning…" : "Drag to scan"}
      </p>
    </motion.div>
  );
}

/* ── Room ────────────────────────────────────────────────────────── */
export function Room01_VisualEvidence({ onComplete }: Props) {
  const [solved, setSolved] = useState(false);
  // Track by index: handles the two cards that share the name "V-05" independently.
  const [examined, setExamined] = useState<Set<number>>(new Set());
  const [uvDragging, setUvDragging] = useState(false);
  const [decoderOpen, setDecoderOpen] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const investigationRef = useRef<HTMLDivElement>(null);

  const toggle = (idx: number) => {
    setExamined((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

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
      <div className="flex h-full flex-col gap-5 overflow-y-auto pb-28">

        {/* ── 1. Case Brief ── */}
        <section className="paper paper-edge relative shrink-0 rounded-lg border border-black/10 px-5 py-4 shadow-xl">
          <div className="absolute -top-3 left-8 h-7 w-20 rotate-[-3deg] bg-[#d7c69b]/60 shadow" />
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-type text-[10px] uppercase tracking-[0.24em] text-[var(--noir-thread)]">
                Design Review Investigation · DS v2.4 Component Audit
              </p>
              <p className="mt-2 max-w-2xl font-display text-lg leading-snug text-[var(--noir-ink-text)]">
                Twelve design review cards were recovered from the researcher&apos;s final audit session.
                Most passed review. Some did not. Identify the inconsistencies.
              </p>
            </div>
            <div className="w-36 shrink-0 rotate-[2deg] bg-[var(--noir-note)] p-3 shadow-md" aria-hidden>
              <p className="font-type text-[9px] uppercase tracking-[0.14em] text-black/40">Researcher&apos;s notes</p>
              <p className="mt-1.5 font-display text-[11px] leading-snug text-[var(--noir-ink-text)]">&quot;Check spacing rhythm&quot;</p>
              <p className="mt-1 font-display text-[11px] leading-snug text-[var(--noir-ink-text)]">&quot;Component mismatch?&quot;</p>
              <p className="mt-1 font-display text-[11px] leading-snug text-[var(--noir-ink-text)]">&quot;Feels slightly off&quot;</p>
            </div>
          </div>
        </section>

        {/* ── 2. Main Board: Archive ←→ Investigation ── */}
        <div className="grid shrink-0 grid-cols-1 gap-5 lg:grid-cols-[1.85fr_1fr]">

          {/* Evidence Archive — 3×4 grid, all 12 cards always visible */}
          <section className="relative overflow-hidden rounded-xl border border-[var(--noir-line)] bg-black/20 p-5 shadow-inner">
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
                  selected · click to examine
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
                    <div className="flex flex-col h-full [&>div]:flex [&>div]:flex-col [&>div]:h-full [&>div]:justify-between">
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
              className="relative flex flex-1 flex-col gap-3 overflow-hidden rounded-xl border-2 border-[var(--noir-gold)]/30 bg-black/25 p-4"
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
                  Click card to return · drag scanner to reveal UV codes
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
                          onClick={() => toggle(idx)}
                          className="group relative cursor-pointer overflow-hidden rounded-[12px]"
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
                          <AnimatePresence>
                            {uvDragging && uvCode && (
                              <motion.div
                                key="uv-reveal"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.35, ease: "easeOut" }}
                                className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none"
                                style={{ background: "rgba(4, 0, 38, 0.87)" }}
                              >
                                <span
                                  className="font-mono font-semibold tracking-[0.28em] text-[#d4a853]"
                                  style={{
                                    fontSize: "26px",
                                    textShadow:
                                      "0 0 8px rgba(212,168,83,0.95), 0 0 20px rgba(212,168,83,0.55), 0 0 42px rgba(212,168,83,0.22)",
                                  }}
                                >
                                  {uvCode}
                                </span>
                                <span
                                  className="mt-2 font-mono uppercase tracking-[0.38em] text-[#7a6035]/55"
                                  style={{ fontSize: "7px" }}
                                >
                                  anomaly detected
                                </span>
                              </motion.div>
                            )}
                          </AnimatePresence>
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
                      Select cards from the archive
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
                  onDragEnd={() => setUvDragging(false)}
                />
              </div>
            </div>

            {/* Hint — QA Audit Checklist */}
            <div className="paper shrink-0 rounded-xl p-4 text-[var(--noir-ink-text)]">
              <button
                type="button"
                onClick={() => setHintOpen((v) => !v)}
                className="flex w-full items-center justify-between text-left"
              >
                <span className="font-type text-[11px] uppercase tracking-[0.18em] text-black/70">
                  Hint · QA Audit Checklist
                </span>
                <ChevronDown className={`h-4 w-4 text-black/40 transition-transform duration-200 ${hintOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence initial={false}>
                {hintOpen && (
                  <motion.ul
                    key="checklist"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-3 overflow-hidden border-t border-black/8 pt-3"
                  >
                    {AUDIT_CHECKLIST.map((item) => (
                      <li key={item} className="flex items-center gap-2 py-1 font-type text-[10px] uppercase tracking-widest text-black/50">
                        <span className="h-3 w-3 shrink-0 rounded-sm border border-black/20" />
                        {item}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ── 3. Decoder — compact accordion ── */}
        <section className="paper shrink-0 rounded-xl px-5 py-3 text-[var(--noir-ink-text)]">
          <button
            type="button"
            onClick={() => setDecoderOpen((v) => !v)}
            className="flex w-full items-center justify-between text-left"
          >
            <span className="font-type text-[11px] uppercase tracking-[0.2em] text-black/65">
              Archival Code Reference · Design System v2.4
            </span>
            <ChevronDown className={`h-4 w-4 shrink-0 text-black/35 transition-transform duration-200 ${decoderOpen ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence initial={false}>
            {decoderOpen && (
              <motion.div
                key="decoder"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-3 grid grid-cols-7 gap-x-3 gap-y-0.5 border-t border-black/8 pt-3 font-mono text-[10px] sm:grid-cols-13">
                  {Array.from({ length: 26 }).map((_, i) => (
                    <div key={i} className="whitespace-nowrap text-black/55">
                      V-{String(i + 1).padStart(2, "0")} ={" "}
                      <b className="text-black/75">{String.fromCharCode(65 + i)}</b>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      {/* ── 4. Password — always visible at bottom ── */}
      <div className="absolute bottom-6 left-1/2 w-full max-w-lg -translate-x-1/2 px-6">
        <PasswordModule
          roomIndex={1}
          onSuccess={handlePasswordSuccess}
          onError={() => undefined}
          label="Recovered Archive Word"
        />
      </div>
    </RoomShell>
  );
}
