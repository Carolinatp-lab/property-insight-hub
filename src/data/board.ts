import type { Status } from "@/data/overview";

export const nextMeeting = {
  heading: "Inför nästa förvaltningsmöte",
  subtitle:
    "Sammanfattning av det som förändrats, behöver följas upp eller kräver förvaltningens beslut.",
  label: "Nästa förvaltningsmöte",
  date: "15 september 2026 · 18:00",
};

export const meetingSummary: { id: string; label: string; status: Status }[] = [
  { id: "info", label: "3 saker att känna till", status: "good" },
  { id: "watch", label: "2 saker att bevaka", status: "watch" },
  { id: "decide", label: "1 beslut behövs", status: "alert" },
];

export const sinceLastMeeting: {
  id: string;
  area: string;
  text: string;
  metrics?: { label: string; value: string; note?: string }[];
  status: Status;
}[] = [
  {
    id: "ekonomi",
    area: "Ekonomi",
    text: "Belåningen fortsätter minska.",
    metrics: [{ label: "Belåning", value: "5 220 kr/m²", note: "↓ från 5 591 kr/m²" }],
    status: "good",
  },
  {
    id: "fastighet",
    area: "Fastighet",
    text: "Fyra reparationer har registrerats på Tvättmaskin 2 under de senaste 12 månaderna.",
    status: "alert",
  },
  {
    id: "energi",
    area: "Energi",
    text: "Värmekostnaden har ökat mer än energiförbrukningen.",
    metrics: [
      { label: "Kostnad", value: "+8 %" },
      { label: "Förbrukning", value: "+1 %" },
    ],
    status: "watch",
  },
];

export const goodToKnow: {
  id: string;
  title: string;
  metric: string;
  assessment: string;
  statusLabel: string;
  status: Status;
}[] = [
  {
    id: "belaning",
    title: "Belåningen fortsätter minska",
    metric: "5 220 kr/m² ↓ från 5 591 kr/m²",
    assessment: "Ingen åtgärd krävs.",
    statusLabel: "Information",
    status: "good",
  },
];

export const toWatch: {
  id: string;
  title: string;
  metrics: { label?: string; value: string }[];
  analysis: string;
  important?: string;
  nextStep: string;
  action: { label: string; to?: "/" | "/fastigheten" };
}[] = [
  {
    id: "sparande",
    title: "Sparandet har minskat",
    metrics: [{ value: "122 kr/m²" }, { label: "jämfört med", value: "304 kr/m² år 2023" }],
    analysis: "Utvecklingen bör följas tillsammans med kommande planerat underhåll.",
    nextStep: "Följ utvecklingen vid nästa ekonomiska uppföljning.",
    action: { label: "Visa analys" },
  },
  {
    id: "varmepumpar",
    title: "Värmepumparnas effektivitet bör kontrolleras",
    metrics: [
      { label: "Elanvändning", value: "+14 %" },
      { label: "Producerad värme", value: "+2 %" },
    ],
    analysis:
      "Förhållandet mellan tillförd el och producerad värme har försämrats jämfört med föregående period.",
    important: "Det betyder inte automatiskt att det är fel på värmepumparna.",
    nextStep: "Kontrollera driftdata och inställningar.",
    action: { label: "Visa analys" },
  },
];

export const decision = {
  area: "Tvättstuga – Tvättmaskin 2",
  background: "Tvättmaskin 2 har reparerats fyra gånger under de senaste 12 månaderna.",
  facts: [
    { label: "Reparationer 12 mån", value: "4" },
    { label: "Reparationskostnad", value: "31 800 kr" },
    { label: "Planerat byte", value: "2028" },
    { label: "Bedömd kostnad för byte", value: "45 000 kr" },
  ],
  analysis:
    "Reparationskostnaderna är koncentrerade till samma maskin och återkommer med korta intervall.",
  recommendation:
    "Utred om det är ekonomiskt mer fördelaktigt att tidigarelägga bytet än att fortsätta reparera maskinen.",
  question: "Ska fastighetsägaren ta in offert för tidigarelagt byte?",
  options: [
    { id: "yes", label: "Ja – ta in offert" },
    { id: "no", label: "Nej" },
    { id: "defer", label: "Behöver mer underlag" },
  ],
  evidence: {
    component: "Tvättmaskin 2",
    placement: "Tvättstuga, källarplan",
    repairs: [
      { date: "12 aug 2025", description: "Byte av lager och tätning", cost: "7 400 kr" },
      { date: "3 nov 2025", description: "Felsökning och byte av pump", cost: "6 900 kr" },
      { date: "19 feb 2026", description: "Byte av styrkort", cost: "9 200 kr" },
      { date: "14 maj 2026", description: "Byte av lager, andra gången", cost: "8 300 kr" },
    ],
    total: "31 800 kr",
    plannedReplacement: "2028",
    estimatedCost: "45 000 kr",
    maintenancePlan: "Underhållsplan 2024–2033 · post 4.2 Tvättstuga, maskiner",
  },
};

export const previousDecisions: {
  id: string;
  area: string;
  decision: string;
  decidedAt?: string;
  owner?: string;
  deadline?: string;
  statusLabel: string;
  status: Status;
  comment?: string;
  action?: { label: string; to?: "/" | "/fastigheten" };
}[] = [
  {
    id: "fasad",
    area: "Fasad",
    decision: "Ta in två offerter för fasadbesiktning.",
    decidedAt: "12 juni 2026",
    owner: "Anna",
    deadline: "31 augusti 2026",
    statusLabel: "Pågår",
    status: "watch",
    action: { label: "Visa status", to: "/fastigheten" },
  },
  {
    id: "hiss",
    area: "Hiss",
    decision: "Beställ årlig service.",
    decidedAt: "12 juni 2026",
    owner: "Förvaltaren",
    statusLabel: "Klart",
    status: "good",
  },
  {
    id: "vatten",
    area: "Vatten",
    decision: "Följ vattenförbrukningen under sommaren.",
    statusLabel: "Behöver följas upp",
    status: "alert",
    comment: "Ny förbrukningsdata finns tillgänglig sedan beslutet fattades.",
    action: { label: "Visa utveckling", to: "/fastigheten" },
  },
];

export const economySnapshot: { id: string; label: string; value: string; status: Status }[] = [
  { id: "belaning", label: "Belåning", value: "5 220 kr/m²", status: "good" },
  { id: "sparande", label: "Sparande", value: "122 kr/m²", status: "watch" },
  { id: "likvida", label: "Likvida medel", value: "4,5 Mkr", status: "good" },
  { id: "arsavgift", label: "Hyresintäkt", value: "777 kr/m²", status: "neutral" },
];

export const proposedAgenda: string[] = [
  "Mötets öppnande",
  "Föregående protokoll",
  "Ekonomisk uppföljning",
  "Fastighetsstatus",
  "Uppföljning av tidigare beslut",
  "Tvättstuga – ställningstagande till offert för Tvättmaskin 2",
  "Värme & ventilation – uppföljning av driftdata",
  "Övriga frågor",
  "Nästa möte",
  "Mötets avslutande",
];

export const meetingQuestions: string[] = [
  "Vad har förändrats sedan förra mötet?",
  "Vilka kostnader avviker mest från budget?",
  "Vilka beslut har vi inte följt upp?",
  "Vad behöver vi besluta om?",
  "Finns det något i underhållsplanen vi bör diskutera?",
];

export const meetingAnswer =
  "Sedan förra mötet har belåningen minskat, fyra reparationer registrerats på Tvättmaskin 2 och värmekostnaden ökat mer än förbrukningen. Ett beslut väntar: offert för tidigarelagt byte av Tvättmaskin 2.";
