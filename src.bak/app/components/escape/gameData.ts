export type RoomId = "visual-evidence" | "silent-playback" | "contradictory-interview" | "lost-navigation" | "behaviour";

export interface RoomMeta {
  id: RoomId;
  index: number;
  fileNo: string;
  title: string;
  location: string;
  lead: string;
  recovered: string;
}

export const ROOMS: RoomMeta[] = [
  {
    id: "visual-evidence",
    index: 0,
    fileNo: "CASE FILE 01",
    title: "The Misaligned Evidence",
    location: "The Design Archive",
    lead: "She kept asking what mattered most — but no one had cleared the noise to show her.",
    recovered: "Visual Hierarchy",
  },
  {
    id: "silent-playback",
    index: 1,
    fileNo: "CASE 02-SP",
    title: "The Silent Playback",
    location: "Recovered Interaction Recording",
    lead: "Playback Archive Restored. Recording Successfully Reconstructed. Room 03 unlocked: The Contradictory Interview.",
    recovered: "Interaction Feedback",
  },
  {
    id: "contradictory-interview",
    index: 2,
    fileNo: "CASE FILE 03",
    title: "The Contradictory Interview",
    location: "The Research Room",
    lead: "The interviews stopped contradicting each other once the assumptions were removed.",
    recovered: "Research Synthesis",
  },
  {
    id: "lost-navigation",
    index: 3,
    fileNo: "CASE 04-LNB",
    title: "The Lost Navigation Blueprint",
    location: "Recovered Information Architecture Evidence",
    lead: "Blueprint Restored. Navigation Route Recovered. CASE FILE 05 unlocked: Behaviour Trail.",
    recovered: "Information Architecture",
  },
  {
    id: "behaviour",
    index: 4,
    fileNo: "CASE FILE 05",
    title: "The Vanishing Trail",
    location: "The Analytics Vault",
    lead: "The user perspective was hidden behind our own assumptions.",
    recovered: "User Behaviour Analysis",
  },
];

export const FINAL_VERDICT = {
  headline: "The user never disappeared.",
  body:
    "The evidence was always there. The team simply stopped listening.",
  signoff: "The best designers do not design for users. The best designers design with users.",
};
