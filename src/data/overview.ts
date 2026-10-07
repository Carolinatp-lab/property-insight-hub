// Mock-data för prototypen. Byts senare enkelt mot API/databas.

export type Status = "good" | "watch" | "alert" | "neutral";

export type Kpi = {
  id: string;
  label: string;
  value: string;
  comparison: string;
  direction: "up" | "down";
  status: Status;
};

export type PropertyArea = {
  id: string;
  name: string;
  /** Kort placeringsbeskrivning, används i listan vid illustrationen. */
  placement: string;
  status: Status;
  /** Kostnad senaste 12 månader. */
  cost12m: string;
  /** Kostnad per kvadratmeter, om relevant. */
  costPerSqm?: string;
  trend?: string;
  trendDirection?: "up" | "down" | "flat";
  repairs?: string;
  lastAction: string;
  plannedAction: string;
  /** Ren observation ur underlaget. */
  fact: string;
  /** Tolkning av underlaget. */
  analysis: string;
  /** Föreslagen åtgärd. */
  recommendation: string;
  nextStep: string;
};

export type Insight = {
  id: string;
  status: Status;
  title: string;
  /** Observation ur underlaget. */
  fact: string;
  /** Tolkning – aldrig presenterad som orsak. */
  analysis?: string;
  /** Förslag till förvaltningen. */
  recommendation?: string;
  /** Kopplad fastighetsdel, om insikten gäller en specifik del. */
  areaId?: string;
};

export type BoardItem = {
  id: string;
  category: "information" | "bevaka" | "beslut";
  text: string;
  action?: string;
  areaId?: string;
};

export const association = {
  name: "Fastighetsägare Exempel",
  subtitle: "Översikt över fastighetsbeståndets ekonomi och drift",
  updated: "Senast uppdaterad: idag",
};

export const navigation: {
  id: string;
  label: string;
  active: boolean;
  path?: "/" | "/ekonomi" | "/fastigheten" | "/underhall" | "/styrelsemote" | "/avtal";
}[] = [
  { id: "oversikt", label: "Översikt", active: true, path: "/" },
  { id: "ekonomi", label: "Ekonomi", active: false, path: "/ekonomi" },

  { id: "fastigheten", label: "Fastigheter", active: false, path: "/fastigheten" },
  { id: "underhall", label: "Underhåll", active: false, path: "/underhall" },
  { id: "objekt", label: "Uthyrning", active: false },
  { id: "styrelsemote", label: "Uppföljning", active: false, path: "/styrelsemote" },
  { id: "avtal", label: "Avtal & leverantörer", active: false, path: "/avtal" },
];

export const kpis: Kpi[] = [
  {
    id: "belaning",
    label: "Belåning",
    value: "5 220 kr/m²",
    comparison: "från 5 591 kr/m²",
    direction: "down",
    status: "good",
  },
  {
    id: "sparande",
    label: "Sparande",
    value: "122 kr/m²",
    comparison: "från 134 kr/m²",
    direction: "down",
    status: "watch",
  },
  {
    id: "hyresintakt",
    label: "Hyresintäkt",
    value: "777 kr/m²",
    comparison: "från 772 kr/m²",
    direction: "up",
    status: "neutral",
  },
  {
    id: "soliditet",
    label: "Soliditet",
    value: "75,2 %",
    comparison: "från 73,1 %",
    direction: "up",
    status: "good",
  },
  {
    id: "likvida",
    label: "Likvida medel",
    value: "4,5 Mkr",
    comparison: "från 3,2 Mkr",
    direction: "up",
    status: "good",
  },
  {
    id: "energi",
    label: "Energikostnad",
    value: "186 kr/m²",
    comparison: "från 191 kr/m²",
    direction: "down",
    status: "good",
  },
];

export const propertyAreas: PropertyArea[] = [
  {
    id: "tak",
    name: "Tak",
    placement: "Yttertak",
    status: "watch",
    cost12m: "184 000 kr",
    costPerSqm: "23 kr/m²",
    trend: "↑ 6 %",
    trendDirection: "up",
    repairs: "2 åtgärder",
    lastAction: "2016 (omläggning av papp)",
    plannedAction: "2028 (underhållsplan)",
    fact: "Två punktinsatser på yttertaket har utförts under de senaste 12 månaderna till en kostnad av 184 000 kr.",
    analysis:
      "Taket närmar sig planerat underhållsintervall enligt underhållsplanen. Om orsaken till punktinsatserna är åldersrelaterad framgår inte av underlaget.",
    recommendation:
      "Låt besiktiga taket inför budgetarbetet så att kommande kostnad kan tidsättas.",
    nextStep: "Boka besiktning",
  },
  {
    id: "fasad",
    name: "Fasad",
    placement: "Fasadskikt",
    status: "good",
    cost12m: "42 000 kr",
    costPerSqm: "5 kr/m²",
    trend: "↓ 2 %",
    trendDirection: "down",
    repairs: "1 åtgärd",
    lastAction: "2019 (fogning och målning)",
    plannedAction: "2032 (underhållsplan)",
    fact: "Kostnaden för fasadunderhåll uppgår till 42 000 kr de senaste 12 månaderna.",
    analysis: "Nivån ligger i linje med tidigare år och inga avvikelser syns i underlaget.",
    recommendation: "Ingen åtgärd föreslås nu.",
    nextStep: "Visa kostnadshistorik",
  },
  {
    id: "fonster",
    name: "Fönster",
    placement: "Fönster och balkongpartier",
    status: "watch",
    cost12m: "68 000 kr",
    costPerSqm: "8 kr/m²",
    trend: "↑ 11 %",
    trendDirection: "up",
    repairs: "6 åtgärder",
    lastAction: "2014 (byte av tätningslister)",
    plannedAction: "2027 (underhållsplan)",
    fact: "Sex mindre åtgärder på fönsterpartier har registrerats under de senaste 12 månaderna.",
    analysis:
      "Antalet åtgärder är fler än föregående år. Underlaget visar inte om det gäller enstaka lägenheter eller hela fastigheten.",
    recommendation: "Sammanställ åtgärderna per trapphus innan nästa budget.",
    nextStep: "Visa åtgärder per trapphus",
  },
  {
    id: "varme",
    name: "Värme & ventilation",
    placement: "Teknikrum, källarplan",
    status: "good",
    cost12m: "1 488 000 kr",
    costPerSqm: "186 kr/m²",
    trend: "↓ 3 %",
    trendDirection: "down",
    repairs: "1 serviceärende",
    lastAction: "2021 (injustering av värmesystem)",
    plannedAction: "2029 (underhållsplan)",
    fact: "Kostnaden för värme och ventilation är 186 kr/m², en minskning med 3 % mot föregående år.",
    analysis:
      "Kostnadsnivån är stabil. Om minskningen beror på avtal, väder eller förbrukning framgår inte av underlaget.",
    recommendation: "Ingen åtgärd föreslås nu. Följ upp vid nästa avtalsförnyelse.",
    nextStep: "Visa förbrukning",
  },
  {
    id: "va",
    name: "Vatten & avlopp",
    placement: "Stammar, källare och mark",
    status: "watch",
    cost12m: "96 000 kr",
    costPerSqm: "12 kr/m²",
    trend: "↑ 14 %",
    trendDirection: "up",
    repairs: "3 åtgärder",
    lastAction: "2009 (relining av delar av stammar)",
    plannedAction: "2030 (underhållsplan)",
    fact: "Tre separata åtgärder i stammar har utförts under de senaste 12 månaderna till 96 000 kr.",
    analysis:
      "Kostnaden ökar jämfört med tidigare år. Underlaget visar inte om åtgärderna har samma orsak.",
    recommendation: "Låt filma stammarna för att få ett underlag om status.",
    nextStep: "Beställ statusfilmning",
  },
  {
    id: "el",
    name: "El & styr",
    placement: "Elcentral och stigarschakt",
    status: "good",
    cost12m: "27 500 kr",
    costPerSqm: "3 kr/m²",
    trend: "↓ 5 %",
    trendDirection: "down",
    repairs: "1 åtgärd",
    lastAction: "2022 (byte till LED i allmänna utrymmen)",
    plannedAction: "2031 (underhållsplan)",
    fact: "Kostnaden för el och styr är 27 500 kr de senaste 12 månaderna.",
    analysis: "Nivån är lägre än föregående år och inga avvikelser syns i underlaget.",
    recommendation: "Ingen åtgärd föreslås nu.",
    nextStep: "Visa kostnadshistorik",
  },
  {
    id: "hiss",
    name: "Hiss",
    placement: "Hisschakt, centralt i byggnaden",
    status: "watch",
    cost12m: "61 000 kr",
    costPerSqm: "8 kr/m²",
    trend: "↑ 9 %",
    trendDirection: "up",
    repairs: "5 serviceärenden",
    lastAction: "2018 (modernisering av styrsystem)",
    plannedAction: "2033 (underhållsplan)",
    fact: "Fem serviceärenden har registrerats på hissen under de senaste 12 månaderna, till 61 000 kr.",
    analysis: "Antalet ärenden är fler än tidigare år. Orsaken framgår inte av tillgänglig data.",
    recommendation: "Begär en sammanställning av felorsaker från serviceleverantören.",
    nextStep: "Begär servicerapport",
  },
  {
    id: "tvattstuga",
    name: "Tvättstuga",
    placement: "Källarplan",
    status: "alert",
    cost12m: "31 800 kr",
    costPerSqm: "4 kr/m²",
    trend: "↑ 62 %",
    trendDirection: "up",
    repairs: "4 reparationer",
    lastAction: "2015 (utrustningen installerad)",
    plannedAction: "Ej planerad",
    fact: "Tvättmaskin 2 har reparerats fyra gånger under de senaste 11 månaderna. Den sammanlagda reparationskostnaden är 31 800 kr.",
    analysis:
      "Reparationerna är återkommande på samma maskin och kostnaden överstiger nivån för jämförbara år.",
    recommendation: "Jämför fortsatt reparation med kostnaden för utbyte.",
    nextStep: "Ta in offert",
  },
  {
    id: "garage",
    name: "Garage & parkering",
    placement: "Sidobyggnad i markplan",
    status: "good",
    cost12m: "23 400 kr",
    costPerSqm: "3 kr/m²",
    trend: "↓ 1 %",
    trendDirection: "down",
    repairs: "1 åtgärd",
    lastAction: "2023 (byte av portmotor)",
    plannedAction: "2034 (underhållsplan)",
    fact: "Kostnaden för garage och parkering är 23 400 kr de senaste 12 månaderna.",
    analysis: "Nivån är oförändrad jämfört med tidigare år.",
    recommendation: "Ingen åtgärd föreslås nu.",
    nextStep: "Visa kostnadshistorik",
  },
  {
    id: "dranering",
    name: "Dränering & grund",
    placement: "Under mark",
    status: "watch",
    cost12m: "0 kr",
    trend: "→ oförändrat",
    trendDirection: "flat",
    repairs: "Inga åtgärder",
    lastAction: "1998 (ursprunglig dränering)",
    plannedAction: "2027 (underhållsplan)",
    fact: "Inga kostnader för dränering och grund är registrerade under de senaste 12 månaderna.",
    analysis:
      "Dräneringen är enligt underhållsplanen den äldsta kvarvarande installationen. Underlaget säger inget om dess faktiska skick.",
    recommendation: "Låt statusbedöma dräneringen inför underhållsplanens revidering.",
    nextStep: "Boka statusbedömning",
  },
];

export const insights: Insight[] = [
  {
    id: "i1",
    status: "good",
    title: "Belåningen fortsätter nedåt",
    fact: "Fastighetsägarens lån har minskat från cirka 19,3 Mkr år 2020 till cirka 14,9 Mkr år 2025.",
    analysis: "Amorteringstakten har varit jämn under perioden.",
  },
  {
    id: "i2",
    status: "watch",
    title: "Sparandet har minskat",
    fact: "Sparandet är 122 kr/m² jämfört med 304 kr/m² år 2023.",
    analysis:
      "Minskningen sammanfaller med högre underhållskostnader. Underlaget visar inte att det ena orsakar det andra.",
    recommendation: "Analysera sparandet tillsammans med kommande underhåll.",
  },
  {
    id: "i3",
    status: "alert",
    title: "Återkommande kostnader i tvättstugan",
    fact: "Fyra reparationer på tvättmaskin 2 de senaste 11 månaderna, totalt 31 800 kr.",
    analysis: "Kostnaden är koncentrerad till en enskild maskin.",
    recommendation: "Jämför fortsatt reparation med kostnaden för utbyte.",
    areaId: "tvattstuga",
  },
  {
    id: "i4",
    status: "good",
    title: "Energikostnaden har minskat",
    fact: "Energikostnaden är 186 kr/m² jämfört med 217 kr/m² år 2023.",
    analysis: "Nedgången är jämnt fördelad över perioden.",
    areaId: "varme",
  },
];

export const boardItems: BoardItem[] = [
  { id: "b1", category: "information", text: "Belåningen fortsätter minska." },
  {
    id: "b2",
    category: "bevaka",
    text: "Sparandet per m² har minskat och bör följas i relation till planerat underhåll.",
    action: "Visa analys",
  },
  {
    id: "b3",
    category: "beslut",
    text: "Tvättstuga – återkommande reparationskostnader. Utred om offert för utbyte bör tas in.",
    action: "Visa beslutsunderlag",
    areaId: "tvattstuga",
  },
];

export const exampleQuestions = [
  "Vad driver våra energikostnader?",
  "Vilka större underhållsåtgärder kommer de närmaste tre åren?",
  "Hur har fastighetsägarens ekonomi utvecklats?",
];

export const sampleAnswer =
  "Underlaget visar att energikostnaden minskat från 217 kr/m² (2023) till 186 kr/m² (2025). Kostnaden för värme ligger stabilt medan elkostnaden minskat något. Vad minskningen beror på framgår inte av tillgänglig data – för att avgöra orsaken behövs uppgifter om förbrukning, avtal och eventuella åtgärder i fastigheten.";

export const statusLabel: Record<Status, string> = {
  good: "Bra",
  watch: "Bevaka",
  alert: "Åtgärd behövs",
  neutral: "Oförändrat",
};
