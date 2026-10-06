// Mockdata för sidan Underhåll (levande underhållsplan).
// Separerad från UI för att enkelt kunna ersättas med data från API/databas.

import type { Status } from "./overview";

export const maintenanceMockNote = "Exempeldata i prototypen.";

export const maintenanceIntro = {
  heading: "Så ser underhållsläget ut",
  statusLabel: "Planen är i huvudsak under kontroll",
  status: "good" as Status,
  summary:
    "De närmaste årens planerade underhåll är begränsat. En åtgärd bör omprövas och större underhåll väntar längre fram.",
};

// Fyra kompakta KPI:er på huvudvyn. Klickbara ingångar till djupare nivå.
export const overviewMaintenanceKpis: {
  id: string;
  label: string;
  value: string;
  note?: string;
  status?: Status;
  statusLabel?: string;
  mock?: boolean;
}[] = [
  { id: "plan3", label: "Nästa 3 år", value: "3,5 Mkr", note: "Planerat underhåll", mock: true },
  { id: "plan10", label: "Nästa 10 år", value: "8,7 Mkr", note: "Planerat underhåll", mock: true },
  {
    id: "bevaka",
    label: "Att bevaka",
    value: "3",
    status: "watch",
    statusLabel: "Tak, värmepumpar, fasad 2030",
  },
  {
    id: "ompröva",
    label: "Bör omprövas",
    value: "1",
    status: "alert",
    statusLabel: "Tvättmaskin 2",
  },
];

export const maintenanceKpiDetails: Record<
  string,
  { title: string; value: string; rows: { label: string; value: string }[]; explanation: string; analysis: string }
> = {
  plan3: {
    title: "Nästa 3 år",
    value: "3,5 Mkr",
    rows: [
      { label: "2026", value: "Fasadbesiktning · 50 000 kr" },
      { label: "2027", value: "Målning gemensamma utrymmen · 350 000 kr" },
      { label: "2028", value: "Tvättmaskin 2 samt större bedömning värme · 45 000 kr" },
    ],
    explanation:
      "Summan är den bedömda kostnaden för åtgärder som ligger i underhållsplanen de närmaste tre åren.",
    analysis:
      "Nivån är begränsad jämfört med 2030. En av åtgärderna, byte av Tvättmaskin 2, bör omprövas utifrån reparationshistoriken.",
  },
  plan10: {
    title: "Nästa 10 år",
    value: "8,7 Mkr",
    rows: [
      { label: "Största post", value: "Fasadrenovering 2030 · 3,2 Mkr" },
      { label: "Näst största post", value: "Dränering efter 2035 · 1,4 Mkr" },
      { label: "Hiss", value: "Modernisering 2032 · 850 000 kr" },
    ],
    explanation:
      "Summan omfattar bedömda kostnader för planerat underhåll under kommande tioårsperiod.",
    analysis:
      "Behovet är ojämnt fördelat över perioden. 2030 står för en betydande andel av hela tioårsplanen.",
  },
  bevaka: {
    title: "Att bevaka",
    value: "3",
    rows: [
      { label: "Tak", value: "Besiktning 2028" },
      { label: "Värmepumpar", value: "Större bedömning 2028" },
      { label: "Fasad", value: "Renovering 2030" },
    ],
    explanation:
      "Åtgärder där ny information eller storleken på åtgärden motiverar uppföljning, utan att planen ändras.",
    analysis:
      "Ingen av dessa åtgärder har i dag ett underlag som motiverar att planen ändras. De följs upp löpande.",
  },
  ompröva: {
    title: "Bör omprövas",
    value: "1",
    rows: [
      { label: "Komponent", value: "Tvättstuga – Tvättmaskin 2" },
      { label: "Plan", value: "Byte 2028 · 45 000 kr" },
      { label: "Verkligt", value: "4 reparationer · 31 800 kr" },
    ],
    explanation:
      "Åtgärder där verkliga händelser avviker så tydligt från planen att tidpunkten bör prövas om.",
    analysis:
      "Reparationskostnaden motsvarar en betydande del av bedömd kostnad för byte. Styrelsen behöver ta ställning.",
  },
};

export const maintenanceKpis: {
  id: string;
  label: string;
  value: string;
  note?: string;
  status?: Status;
  mock?: boolean;
}[] = [
  { id: "plan3", label: "Planerat nästa 3 år", value: "3,5 Mkr", mock: true },
  { id: "plan10", label: "Planerat nästa 10 år", value: "8,7 Mkr", mock: true },
  {
    id: "bevaka",
    label: "Åtgärder att bevaka",
    value: "3",
    status: "watch",
    note: "Tak, värmepumpar, fasad 2030",
  },
  {
    id: "ompröva",
    label: "Plan som bör omprövas",
    value: "1",
    status: "alert",
    note: "Tvättstuga – Tvättmaskin 2",
  },
];


export const upcoming: {
  year: string;
  statusLabel: string;
  status: Status;
  action: string;
  cost: string;
  mock?: boolean;
  componentId?: string;

}[] = [
  {
    year: "2026",
    statusLabel: "Pågår",
    status: "watch",
    action: "Fasadbesiktning",
    cost: "50 000 kr",
  },
  {
    year: "2027",
    statusLabel: "Planerat",
    status: "neutral",
    action: "Målning gemensamma utrymmen",
    cost: "350 000 kr",
    mock: true,
  },
  {
    year: "2028",
    statusLabel: "Ompröva",
    status: "alert",
    action: "Tvättmaskin 2",
    cost: "45 000 kr",
    componentId: "tm2",
  },

  {
    year: "2029",
    statusLabel: "Planerat",
    status: "neutral",
    action: "Ventilationsåtgärder",
    cost: "650 000 kr",
    mock: true,
  },
  {
    year: "2030",
    statusLabel: "Större underhåll",
    status: "watch",
    action: "Fasad",
    cost: "3,2 Mkr",
    mock: true,
  },
];

export const planChanges: {
  id: string;
  title: string;
  status: Status;
  statusLabel?: string;
  rows: { label: string; value: string }[];
  assessment: string;
  details?: string;
  canPropose?: boolean;
  componentId?: string;
  analysisPath?: "/fastigheten" | "/styrelsemote" | "/ekonomi";

}[] = [
  {
    id: "tm2",
    title: "Tvättmaskin 2",
    status: "alert",
    statusLabel: "Bör omprövas",
    rows: [
      { label: "Plan", value: "Byte 2028" },
      { label: "Sedan planen gjordes", value: "4 reparationer senaste 11 månaderna" },
      { label: "Reparationskostnad", value: "31 800 kr" },
    ],
    assessment: "Återkommande reparationer gör att tidpunkten för byte bör omprövas.",
    details:
      "Reparationerna återkommer med korta intervall och är koncentrerade till samma maskin. Reparationskostnaden motsvarar redan cirka 70 procent av bedömd kostnad för byte. Systemet föreslår att bytet prövas tidigare än 2028, men ändringen kräver ett styrelsebeslut.",
    canPropose: true,
    componentId: "tm2",
  },
  {
    id: "fasad",
    title: "Fasad",
    status: "watch",
    statusLabel: "Planen har påverkats",
    rows: [
      { label: "Plan", value: "Besiktning 2027" },
      {
        label: "Ny information",
        value: "Styrelsen har beslutat att ta in offerter redan 2026.",
      },
    ],
    assessment: "Besiktningen har aktualiserats tidigare än planerat.",
    details:
      "Besiktningen genomförs i förtid utifrån styrelsens beslut. När resultatet finns kan planerad fasadrenovering 2030 behöva tidsättas om.",
    analysisPath: "/styrelsemote",
  },
  {
    id: "varmepumpar",
    title: "Värmepumpar",
    status: "watch",
    statusLabel: "Bevaka",
    rows: [
      { label: "Plan", value: "Större bedömning 2028" },
      {
        label: "Ny information",
        value: "Elanvändning +14 %, producerad värme +2 %",
      },
    ],
    assessment:
      "Utvecklingen bör följas men underlaget är ännu inte tillräckligt för att ändra planen.",
    details:
      "Avvikelsen kan bero på drift, inställningar, väder eller verklig effektivitetsförsämring. Ytterligare driftdata behövs innan planen justeras.",
    analysisPath: "/fastigheten",
  },

];

export const planChangePrinciple =
  "Systemet ändrar aldrig underhållsplanen automatiskt. AI upptäcker förändringar, analyserar och föreslår justeringar – beslutet fattas av styrelsen.";

export const financing = {
  heading: "Underhåll & finansiering",
  note: "Planerade underhållskostnader per år jämfört med föreningens uppskattade handlingsutrymme.",
  capacity: "Uppskattat handlingsutrymme: cirka 1,1 Mkr per år",
  years: [
    { year: "2026", display: "0,4 Mkr", value: 0.4, status: "good" as Status },
    { year: "2027", display: "0,8 Mkr", value: 0.8, status: "good" as Status },
    { year: "2028", display: "2,1 Mkr", value: 2.1, status: "watch" as Status },
    { year: "2029", display: "0,6 Mkr", value: 0.6, status: "good" as Status },
    {
      year: "2030",
      display: "3,2 Mkr",
      value: 3.2,
      status: "watch" as Status,
      flagLabel: "Bevaka",
    },
    { year: "2031", display: "1,0 Mkr", value: 1.0, status: "good" as Status },
  ],
  observation:
    "Planerade underhållskostnader är betydligt högre 2030 än omkringliggande år.",
  comment: "Finansieringen bör analyseras i god tid.",
  action: "Visa finansieringsanalys",
  analysis:
    "Underhållsbehovet 2030 överstiger föreningens uppskattade årliga handlingsutrymme. Finansiering kan behöva ske genom sparande under åren före, upplåning, eller genom att åtgärder fasas över flera år. Analysen är förenklad och utgör inte en finansieringsmodell.",
};

export type AreaMaintenance = {
  areaId: string;
  status: Status;
  statusLabel: string;
  nextAction: string;
  year: string;
  age?: string;
  lastAction?: string;
  estimatedCost?: string;
  historicalCost?: string;
  k3Component: string;
  history: { year: string; action: string; cost: string; planned?: boolean }[];
  plan: string;
  today: string;
  conclusion: string;
  mock?: boolean;
};

export const areaMaintenance: Record<string, AreaMaintenance> = {
  tak: {
    areaId: "tak",
    status: "watch",
    statusLabel: "Bevaka",
    nextAction: "Besiktning",
    year: "2028",
    age: "Renoverat 2014",
    lastAction: "Besiktning 2026",
    estimatedCost: "15 000 kr",
    historicalCost: "1,85 Mkr sedan 2014",
    k3Component: "Byggnad / tak",
    history: [
      { year: "2014", action: "Takrenovering", cost: "1,8 Mkr" },
      { year: "2022", action: "Mindre reparation", cost: "35 000 kr" },
      { year: "2026", action: "Besiktning", cost: "12 000 kr" },
      { year: "2028", action: "Planerad besiktning", cost: "15 000 kr", planned: true },
    ],
    plan: "Återkommande besiktning vartannat år, nästa 2028. Ingen större åtgärd planerad före 2034.",
    today:
      "Besiktningen 2026 visade inga akuta brister. Endast mindre reparationer har krävts sedan renoveringen 2014.",
    conclusion: "Aktuell information stödjer befintlig plan.",
  },
  fasad: {
    areaId: "fasad",
    status: "watch",
    statusLabel: "Pågår",
    nextAction: "Besiktning",
    year: "2026",
    age: "Renoverad 2017",
    lastAction: "Offertförfrågan juni 2026",
    estimatedCost: "50 000 kr",
    historicalCost: "2,4 Mkr sedan 2017",
    k3Component: "Byggnad / fasad",
    history: [
      { year: "2017", action: "Fasadrenovering", cost: "2,4 Mkr" },
      { year: "2026", action: "Fasadbesiktning (pågår)", cost: "50 000 kr" },
      { year: "2030", action: "Planerad renovering", cost: "3,2 Mkr", planned: true },
    ],
    plan: "Besiktning 2027 och renovering 2030.",
    today: "Besiktningen aktualiserades 2026 genom styrelsebeslut och genomförs tidigare än planerat.",
    conclusion: "Planerad renovering 2030 kan behöva tidsättas om när besiktningen är klar.",
  },
  fonster: {
    areaId: "fonster",
    status: "watch",
    statusLabel: "Bevaka",
    nextAction: "Ommålning",
    year: "2029",
    age: "Byten 2005",
    lastAction: "Kittning 2021",
    estimatedCost: "420 000 kr",
    historicalCost: "180 000 kr sedan 2015",
    k3Component: "Byggnad / fönster",
    history: [
      { year: "2015", action: "Ommålning", cost: "145 000 kr" },
      { year: "2021", action: "Kittning och tätning", cost: "35 000 kr" },
      { year: "2029", action: "Planerad ommålning", cost: "420 000 kr", planned: true },
    ],
    plan: "Ommålning 2029.",
    today: "Ingen ny information som avviker från planen.",
    conclusion: "Aktuell information stödjer befintlig plan.",
    mock: true,
  },
  varme: {
    areaId: "varme",
    status: "watch",
    statusLabel: "Bevaka",
    nextAction: "Större bedömning",
    year: "2028",
    age: "Bergvärme installerad 2016",
    lastAction: "Service 2026",
    estimatedCost: "Mockkostnad",
    historicalCost: "310 000 kr sedan 2016",
    k3Component: "Installation / värme och ventilation",
    history: [
      { year: "2016", action: "Installation bergvärme", cost: "2,1 Mkr" },
      { year: "2023", action: "Byte av cirkulationspump", cost: "48 000 kr" },
      { year: "2026", action: "Service och driftgenomgång", cost: "26 000 kr" },
      { year: "2028", action: "Planerad större bedömning", cost: "Mockkostnad", planned: true },
    ],
    plan: "Större teknisk bedömning 2028.",
    today: "Elanvändningen har ökat 14 % medan producerad värme ökat 2 %.",
    conclusion: "Utvecklingen bör följas. Underlaget räcker ännu inte för att ändra planen.",
  },
  va: {
    areaId: "va",
    status: "watch",
    statusLabel: "Bevaka",
    nextAction: "Stamspolning",
    year: "2027",
    age: "Relining 2012",
    lastAction: "Spolning 2022",
    estimatedCost: "180 000 kr",
    historicalCost: "1,3 Mkr sedan 2012",
    k3Component: "Installation / vatten och avlopp",
    history: [
      { year: "2012", action: "Relining stammar", cost: "1,2 Mkr" },
      { year: "2022", action: "Stamspolning", cost: "95 000 kr" },
      { year: "2027", action: "Planerad stamspolning", cost: "180 000 kr", planned: true },
    ],
    plan: "Stamspolning var femte år.",
    today: "Vattenförbrukningen följs upp under sommaren enligt styrelsebeslut.",
    conclusion: "Aktuell information stödjer befintlig plan.",
    mock: true,
  },
  el: {
    areaId: "el",
    status: "good",
    statusLabel: "Bra",
    nextAction: "Elrevision",
    year: "2031",
    age: "Central uppgraderad 2019",
    lastAction: "Elrevision 2025",
    estimatedCost: "40 000 kr",
    historicalCost: "260 000 kr sedan 2019",
    k3Component: "Installation / el och styr",
    history: [
      { year: "2019", action: "Uppgradering elcentral", cost: "220 000 kr" },
      { year: "2025", action: "Elrevision", cost: "38 000 kr" },
      { year: "2031", action: "Planerad elrevision", cost: "40 000 kr", planned: true },
    ],
    plan: "Elrevision var sjätte år.",
    today: "Inga anmärkningar vid senaste revisionen.",
    conclusion: "Aktuell information stödjer befintlig plan.",
    mock: true,
  },
  hiss: {
    areaId: "hiss",
    status: "watch",
    statusLabel: "Bevaka",
    nextAction: "Modernisering",
    year: "2032",
    age: "Moderniserad 2008",
    lastAction: "Årlig service 2026",
    estimatedCost: "850 000 kr",
    historicalCost: "410 000 kr sedan 2015",
    k3Component: "Installation / hiss",
    history: [
      { year: "2008", action: "Modernisering", cost: "620 000 kr" },
      { year: "2026", action: "Årlig service", cost: "24 000 kr" },
      { year: "2032", action: "Planerad modernisering", cost: "850 000 kr", planned: true },
    ],
    plan: "Modernisering 2032, årlig service däremellan.",
    today: "Servicen 2026 är beställd och genomförd.",
    conclusion: "Aktuell information stödjer befintlig plan.",
    mock: true,
  },
  tvattstuga: {
    areaId: "tvattstuga",
    status: "alert",
    statusLabel: "Åtgärd bör omprövas",
    nextAction: "Tvättmaskin 2 – byte",
    year: "2028",
    age: "Maskiner från 2017",
    lastAction: "Reparation 14 maj 2026",
    estimatedCost: "45 000 kr",
    historicalCost: "31 800 kr senaste 12 månaderna",
    k3Component: "Installation / maskinutrustning",
    history: [
      { year: "2017", action: "Nya tvättmaskiner", cost: "180 000 kr" },
      { year: "2025", action: "Reparationer Tvättmaskin 2", cost: "14 000 kr" },
      { year: "2026", action: "Reparationer Tvättmaskin 2", cost: "17 800 kr" },
      { year: "2028", action: "Planerat byte Tvättmaskin 2", cost: "45 000 kr", planned: true },
    ],
    plan: "Byte av Tvättmaskin 2 år 2028, bedömd kostnad 45 000 kr.",
    today: "Fyra reparationer senaste 12 månaderna till en kostnad av 31 800 kr.",
    conclusion: "Aktuell information talar för att planen bör omprövas.",
  },
  garage: {
    areaId: "garage",
    status: "good",
    statusLabel: "Bra",
    nextAction: "Ytbehandling golv",
    year: "2033",
    age: "Byggt 1972",
    lastAction: "Belysningsbyte 2024",
    estimatedCost: "300 000 kr",
    historicalCost: "150 000 kr sedan 2018",
    k3Component: "Byggnad / garage",
    history: [
      { year: "2024", action: "Byte till LED-belysning", cost: "110 000 kr" },
      { year: "2033", action: "Planerad ytbehandling", cost: "300 000 kr", planned: true },
    ],
    plan: "Ytbehandling av garagegolv 2033.",
    today: "Ingen ny information som avviker från planen.",
    conclusion: "Aktuell information stödjer befintlig plan.",
    mock: true,
  },
  dranering: {
    areaId: "dranering",
    status: "watch",
    statusLabel: "Bevaka",
    nextAction: "Kontroll av dränering",
    year: "2029",
    age: "Dränering 1998",
    lastAction: "Fuktkontroll 2024",
    estimatedCost: "1,4 Mkr",
    historicalCost: "95 000 kr sedan 2018",
    k3Component: "Byggnad / grund och dränering",
    history: [
      { year: "2024", action: "Fuktkontroll källare", cost: "28 000 kr" },
      { year: "2029", action: "Planerad kontroll", cost: "45 000 kr", planned: true },
    ],
    plan: "Kontroll 2029, omdränering bedöms behövas efter 2035.",
    today: "Fuktkontrollen 2024 visade förhöjda värden i en del av källaren.",
    conclusion: "Utvecklingen bör följas inför kontrollen 2029.",
    mock: true,
  },
};

export const fullPlan: {
  id: string;
  area: string;
  component: string;
  action: string;
  last: string;
  year: string;
  cost: string;
  status: Status;
  statusLabel: string;
}[] = [
  {
    id: "p1",
    area: "Tvättstuga",
    component: "Tvättmaskin 2",
    action: "Byte",
    last: "2017",
    year: "2028",
    cost: "45 000 kr",
    status: "alert",
    statusLabel: "Ompröva",
  },
  {
    id: "p2",
    area: "Värme",
    component: "Bergvärmepumpar",
    action: "Större bedömning",
    last: "2016",
    year: "2028",
    cost: "Mockkostnad",
    status: "watch",
    statusLabel: "Bevaka",
  },
  {
    id: "p3",
    area: "Fasad",
    component: "Fasad",
    action: "Renovering",
    last: "2017",
    year: "2030",
    cost: "3,2 Mkr",
    status: "neutral",
    statusLabel: "Planerat",
  },
  {
    id: "p4",
    area: "Fasad",
    component: "Fasad",
    action: "Besiktning",
    last: "2017",
    year: "2026",
    cost: "50 000 kr",
    status: "watch",
    statusLabel: "Pågår",
  },
  {
    id: "p5",
    area: "Tak",
    component: "Yttertak",
    action: "Besiktning",
    last: "2026",
    year: "2028",
    cost: "15 000 kr",
    status: "neutral",
    statusLabel: "Planerat",
  },
  {
    id: "p6",
    area: "Vatten & avlopp",
    component: "Stammar",
    action: "Stamspolning",
    last: "2022",
    year: "2027",
    cost: "180 000 kr",
    status: "neutral",
    statusLabel: "Planerat",
  },
  {
    id: "p7",
    area: "Fönster",
    component: "Fönster",
    action: "Ommålning",
    last: "2015",
    year: "2029",
    cost: "420 000 kr",
    status: "neutral",
    statusLabel: "Planerat",
  },
  {
    id: "p8",
    area: "Hiss",
    component: "Hissmaskineri",
    action: "Modernisering",
    last: "2008",
    year: "2032",
    cost: "850 000 kr",
    status: "neutral",
    statusLabel: "Planerat",
  },
];

export const planVsActual = {
  heading: "Planerat mot verkligt utfall",
  note: "Genomförda åtgärder jämförs med underhållsplanen.",
  planned: { title: "Fasadbesiktning", cost: "50 000 kr", year: "2027" },
  actual: { title: "Fasadbesiktning", cost: "47 500 kr", year: "2026" },
  observations: ["Utfört tidigare än planerat", "Kostnad 2 500 kr under plan"],
  proposal: "Uppdatera nästa planerade besiktning till 2031?",
  approveLabel: "Godkänn ändring",
  approvedLabel: "Ändringen är godkänd i prototypen. Nästa besiktning planeras 2031.",
};

export const maintenanceInsights: {
  id: string;
  status: Status;
  title: string;
  text: string;
  action?: { label: string; path?: "/fastigheten" | "/ekonomi" | "/styrelsemote" };
}[] = [
  {
    id: "m1",
    status: "watch",
    title: "Tvättmaskin 2 bör omprövas",
    text: "Reparationskostnaden är redan 31 800 kr och byte är planerat till 2028.",
    action: { label: "Visa analys", path: "/fastigheten" },
  },
  {
    id: "m2",
    status: "watch",
    title: "Värmepumparna bör följas",
    text: "Ny driftdata motiverar kontroll men ännu inte ändrad underhållsplan.",
    action: { label: "Visa driftdata", path: "/fastigheten" },
  },
  {
    id: "m3",
    status: "watch",
    title: "Större underhåll väntar 2030",
    text: "Planerade åtgärder är betydligt större detta år än omkringliggande år.",
    action: { label: "Visa ekonomi", path: "/ekonomi" },
  },
];

export const maintenanceQuestions = [
  "Vad behöver vi göra de närmaste tre åren?",
  "Vilka åtgärder har blivit dyrare än planerat?",
  "Finns det något vi borde tidigarelägga?",
  "Vad har ändrats sedan underhållsplanen gjordes?",
  "Vilka större investeringar kommer de närmaste tio åren?",
  "Har vi ekonomi för underhållsplanen?",
];

export const maintenanceAnswer = {
  fact: "De närmaste tre åren omfattar planen fasadbesiktning 2026, målning av gemensamma utrymmen 2027 samt byte av Tvättmaskin 2 år 2028, sammanlagt cirka 3,5 Mkr.",
  analysis:
    "Den enskilt största posten ligger 2030 med planerad fasadrenovering på 3,2 Mkr. Tvättmaskin 2 avviker från planen genom fyra reparationer på 31 800 kr under de senaste 12 månaderna.",
  recommendation:
    "Pröva om bytet av Tvättmaskin 2 bör tidigareläggas och påbörja finansieringsanalysen för 2030 i god tid.",
};

// ---------------------------------------------------------------------------
// Nivå 1: huvudvy (10 sekunder → 1 minut). Samma data, enklare hierarki.
// ---------------------------------------------------------------------------

export const planChangesIntro =
  "Ny information från fastigheten som kan påverka underhållsplanen.";

/** Enkel 10-årsbild av underhållsbehovet. Beskriver behov, inte finansiering. */
export const maintenanceOutlook = {
  heading: "Framåt",
  note: "Hur ser underhållsbehovet ut längre fram?",
  years: financing.years,
  observation: "Planerade underhållskostnader ökar tydligt 2030.",
  comment: "Finansieringen bör analyseras i god tid.",
  action: "Visa underhåll & finansiering",
};

/** Konsekvens eller nästa steg – inte samma observationer som "Det här har förändrats". */
export const boardNextSteps: {
  id: string;
  status: Status;
  title: string;
  note: string;
  componentId?: string;
  actions: { label: string; path?: "/fastigheten" | "/ekonomi" | "/styrelsemote" }[];
}[] = [
  {
    id: "tm2",
    status: "alert",
    title: "Ta ställning till Tvättmaskin 2",
    note: "Reparationshistoriken motiverar att planerat byte 2028 omprövas.",
    componentId: "tm2",
    actions: [
      { label: "Visa beslutsunderlag" },
      { label: "Lägg till på styrelsemöte", path: "/styrelsemote" },
    ],
  },
  {
    id: "varmepumpar",
    status: "watch",
    title: "Följ värmepumparnas utveckling",
    note: "Ny driftinformation motiverar uppföljning innan underhållsplanen ändras.",
    actions: [{ label: "Visa analys", path: "/fastigheten" }],
  },
  {
    id: "u2030",
    status: "watch",
    title: "Planera inför större underhåll 2030",
    note: "Underhållsbehovet är betydligt större detta år än omkringliggande år.",
    actions: [{ label: "Visa ekonomi", path: "/ekonomi" }],
  },
];

/** Diskret notis på huvudvyn när planerat och verkligt utfall skiljer sig. */
export const planDeviationHint = {
  text: "Fasadbesiktningen genomfördes tidigare än planerat.",
  action: "Visa planerat mot verkligt",
};

/**
 * Komponentdetalj. Samma logiska objekt som på sidan Fastigheten
 * (fastighetsdel → komponent), här sett ur underhållsplanens perspektiv.
 */
export type ComponentDetail = {
  id: string;
  areaId: string;
  areaName: string;
  name: string;
  installed: string;
  status: Status;
  statusLabel: string;
  plan: { label: string; value: string }[];
  events: { date: string; type: string; cost: string }[];
  eventsTotal: string;
  analysis: string[];
  proposal: string;
  k3Component: string;
  actions: { id: string; label: string; result: string }[];
};

export const componentDetails: Record<string, ComponentDetail> = {
  tm2: {
    id: "tm2",
    areaId: "tvattstuga",
    areaName: "Tvättstuga",
    name: "Tvättmaskin 2",
    installed: "2017",
    status: "alert",
    statusLabel: "Bör omprövas",
    plan: [
      { label: "Planerat byte", value: "2028" },
      { label: "Bedömd kostnad", value: "45 000 kr" },
    ],
    events: [
      { date: "Sep 2025", type: "Reparation", cost: "7 200 kr" },
      { date: "Dec 2025", type: "Reparation", cost: "6 800 kr" },
      { date: "Feb 2026", type: "Reparation", cost: "8 400 kr" },
      { date: "Maj 2026", type: "Reparation", cost: "9 400 kr" },
    ],
    eventsTotal: "31 800 kr",
    analysis: [
      "Fyra reparationer har genomförts på samma maskin under de senaste 11 månaderna.",
      "Den sammanlagda reparationskostnaden motsvarar en betydande del av den uppskattade kostnaden för byte.",
    ],
    proposal: "Överväg att ta in offert för tidigarelagt byte.",
    k3Component: "Installation / maskinutrustning",
    actions: [
      {
        id: "offert",
        label: "Ta in offert",
        result: "Offertförfrågan är förberedd i prototypen. Planen ändras först efter beslut.",
      },
      {
        id: "styrelsemote",
        label: "Lägg till på styrelsemöte",
        result: "Punkten är förberedd till nästa styrelsemöte i prototypen.",
      },
      {
        id: "behall",
        label: "Behåll nuvarande plan",
        result: "Planen ligger kvar med byte 2028. Uppföljning sker vid nästa reparation.",
      },
    ],
  },
};

export const maintenanceOverviewQuestions = [
  "Vad behöver vi göra de närmaste tre åren?",
  "Vad har förändrats sedan planen gjordes?",
  "Finns det något vi borde tidigarelägga?",
  "Vilka komponenter kostar mer än väntat?",
  "Vilka större underhållsåtgärder kommer de närmaste tio åren?",
  "Har vi ekonomi för underhållsplanen?",
];
