import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/brf/SiteHeader";
import { StatusDot } from "@/components/brf/StatusDot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProperties } from "@/components/PropertyProvider";
import { investmentBaseline as exampleBaseline, roofScenario } from "@/data/investment";
import { calculateInvestmentScenario, type InvestmentScenario } from "@/domain/investment-analysis";
import { ArrowLeft, Banknote, Building2, Info, Landmark, WalletCards } from "lucide-react";

export const Route = createFileRoute("/ekonomi/investeringssimulator")({
  head: () => ({
    meta: [
      { title: "Investeringssimulator – Fastighetsägare Exempel" },
      {
        name: "description",
        content:
          "Testa hur en investering påverkar fastighetsägarens likviditet, lån, belåning och finansieringskostnader.",
      },
    ],
  }),
  component: InvestmentSimulatorPage,
});

const card = "rounded-3xl border border-border bg-card p-6 shadow-card sm:p-7";
const fieldCard = "rounded-2xl border border-border bg-secondary/45 p-4";
const eyebrow = "text-xs font-medium tracking-wide text-muted-foreground uppercase";
const sek = new Intl.NumberFormat("sv-SE", {
  style: "currency",
  currency: "SEK",
  maximumFractionDigits: 0,
});
const number = new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 });
const decimal = new Intl.NumberFormat("sv-SE", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const toMillions = (value: number) => value / 1_000_000;
const fromMillions = (value: string) =>
  Math.max(0, (Number(value.replace(",", ".")) || 0) * 1_000_000);

function NumberField({
  id,
  label,
  value,
  suffix,
  step = "1",
  min = "0",
  onChange,
  note,
}: {
  id: string;
  label: string;
  value: number;
  suffix: string;
  step?: string;
  min?: string;
  onChange: (value: string) => void;
  note?: string;
}) {
  return (
    <div className={fieldCard}>
      <Label htmlFor={id} className="text-sm font-semibold text-foreground">
        {label}
      </Label>
      <div className="mt-2 flex items-center gap-2">
        <Input
          id={id}
          type="number"
          min={min}
          step={step}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 rounded-xl bg-card text-base font-semibold"
        />
        <span className="shrink-0 text-sm text-muted-foreground">{suffix}</span>
      </div>
      {note ? <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{note}</p> : null}
    </div>
  );
}

function InvestmentSimulatorPage() {
  const { summary, scope } = useProperties();
  const investmentBaseline = useMemo(
    () => ({
      ...exampleBaseline,
      annualFeeRevenue: summary.rent,
      liquidAssets: summary.rent * 0.45,
      totalDebt: summary.rent * 3,
      totalAreaSqm: summary.apartments * 70 + summary.premises * 140,
      currentAnnualSaving: summary.net,
      minimumLiquidityBuffer: summary.operatingCosts * 0.5,
    }),
    [summary.rent, summary.apartments, summary.premises, summary.net, summary.operatingCosts],
  );
  const [scenario, setScenario] = useState<InvestmentScenario>(roofScenario);
  const result = useMemo(
    () => calculateInvestmentScenario(investmentBaseline, scenario),
    [scenario, investmentBaseline],
  );
  const ownFunds = Math.min(scenario.ownFunds, scenario.investmentAmount);
  const hasBufferShortfall = result.liquidityBufferDifference < 0;
  const update = (patch: Partial<InvestmentScenario>) =>
    setScenario((current) => ({ ...current, ...patch }));

  const effects = [
    {
      icon: WalletCards,
      label: "Likvida medel efter betalning",
      value: decimal.format(toMillions(result.liquidityAfterInvestment)) + " Mkr",
      note:
        decimal.format(toMillions(Math.abs(result.liquidityBufferDifference))) +
        " Mkr " +
        (hasBufferShortfall ? "under" : "över") +
        " trygghetsnivån",
      status: hasBufferShortfall ? "alert" : "good",
    },
    {
      icon: Building2,
      label: "Belåning",
      value: number.format(result.debtPerSqmAfter) + " kr/m²",
      note: "+" + number.format(result.debtPerSqmChange) + " kr/m²",
      status: result.debtPerSqmChange > 750 ? "watch" : "neutral",
    },
    {
      icon: Landmark,
      label: "Räntekostnad år 1",
      value: sek.format(result.firstYearInterest),
      note: decimal.format(scenario.interestRate) + " % ränta",
      status: "neutral",
    },
    {
      icon: Banknote,
      label: "Amortering per år",
      value: sek.format(result.annualAmortization),
      note: scenario.amortizationYears + " års amorteringstid",
      status: "neutral",
    },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main id="main-content" className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-8 sm:py-8">
        <Button asChild variant="ghost" className="-ml-3 h-9 rounded-xl">
          <Link to="/ekonomi">
            <ArrowLeft aria-hidden className="size-4" />
            Tillbaka till Ekonomi
          </Link>
        </Button>
        <header className="mt-5 max-w-3xl">
          <p className={eyebrow}>Beslutsstöd · scenario</p>
          <h1 className="mt-2 text-3xl font-semibold text-foreground sm:text-4xl">
            Testa en investering
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Se hur ett projekt kan finansieras och vad det betyder för fastighetsägarens likviditet,
            belåning och finansieringskostnader. {scope}. Börja med takrenoveringen eller ändra
            antagandena.
          </p>
        </header>

        <div className="mt-7 grid items-start gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <section className={card}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className={eyebrow}>Investeringen</p>
                <h2 className="mt-1 text-xl font-semibold text-foreground">Dina antaganden</h2>
              </div>
              <Button
                variant="ghost"
                className="h-9 rounded-xl"
                onClick={() => setScenario(roofScenario)}
              >
                Återställ
              </Button>
            </div>
            <div className="mt-5">
              <Label htmlFor="scenario-name" className="text-sm font-semibold text-foreground">
                Vad ska fastighetsägaren investera i?
              </Label>
              <Input
                id="scenario-name"
                value={scenario.name}
                onChange={(event) => update({ name: event.target.value })}
                className="mt-2 h-11 rounded-xl text-base"
              />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <NumberField
                id="amount"
                label="Investeringsbelopp"
                value={toMillions(scenario.investmentAmount)}
                suffix="Mkr"
                step="0.1"
                onChange={(value) => update({ investmentAmount: fromMillions(value) })}
              />
              <NumberField
                id="year"
                label="Planerat år"
                value={scenario.plannedYear}
                suffix=""
                min="2026"
                onChange={(value) => update({ plannedYear: Number(value) || 2026 })}
              />
              <NumberField
                id="own"
                label="Betalas med egna medel"
                value={toMillions(ownFunds)}
                suffix="Mkr"
                step="0.1"
                onChange={(value) => update({ ownFunds: fromMillions(value) })}
                note={
                  "Fastighetsägaren har " +
                  decimal.format(toMillions(investmentBaseline.liquidAssets)) +
                  " Mkr i likvida medel."
                }
              />
              <NumberField
                id="rate"
                label="Antagen låneränta"
                value={scenario.interestRate}
                suffix="%"
                step="0.1"
                onChange={(value) => update({ interestRate: Number(value.replace(",", ".")) || 0 })}
              />
              <NumberField
                id="years"
                label="Amorteringstid"
                value={scenario.amortizationYears}
                suffix="år"
                min="1"
                onChange={(value) => update({ amortizationYears: Math.max(1, Number(value) || 1) })}
              />
            </div>
            <div className="mt-4 rounded-2xl border border-border bg-surface p-4">
              <div className="flex items-start gap-3">
                <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Så räknar prototypen</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Finansieringskostnaden motsvarar första årets ränta och amortering. Skatt,
                    kostnadsindex och eventuella besparingar ingår ännu inte.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="space-y-5" aria-live="polite">
            <section className="overflow-hidden rounded-3xl border border-primary/20 bg-primary text-primary-foreground shadow-lift">
              <div className="p-6 sm:p-7">
                <p className="text-xs font-medium tracking-wide text-primary-foreground/70 uppercase">
                  Samlad bedömning
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  {scenario.name || "Investeringen"} kräver ett lån på{" "}
                  {decimal.format(toMillions(result.loanRequired))} Mkr
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-primary-foreground/80">
                  Årlig ränta och amortering blir cirka {sek.format(result.annualFinancingCost)}.
                  Det motsvarar {decimal.format(result.feeIncreasePercent)} % av nuvarande
                  hyresintäkter. Hyreshöjningar kräver separat bedömning och förhandling.
                </p>
              </div>
              <div className="grid border-t border-primary-foreground/15 sm:grid-cols-2">
                <div className="p-5 sm:border-r sm:border-primary-foreground/15">
                  <p className="text-xs text-primary-foreground/65">Kostnad fördelad på 70 m²</p>
                  <p className="mt-1 text-2xl font-semibold">
                    +{sek.format(result.monthlyImpactReferenceApartment)}/mån
                  </p>
                </div>
                <div className="border-t border-primary-foreground/15 p-5 sm:border-t-0">
                  <p className="text-xs text-primary-foreground/65">Ny belåning</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {number.format(result.debtPerSqmAfter)} kr/m²
                  </p>
                </div>
              </div>
            </section>

            <section className={card}>
              <p className={eyebrow}>Finansiering</p>
              <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-secondary">
                <div
                  className="bg-status-good"
                  style={{ width: result.fundingFromOwnFundsPercent + "%" }}
                />
                <div
                  className="bg-primary/75"
                  style={{ width: result.fundingFromLoanPercent + "%" }}
                />
              </div>
              <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <p className="flex items-center gap-2 text-muted-foreground">
                  <span className="size-2.5 rounded-full bg-status-good" />
                  Egna medel{" "}
                  <strong className="ml-auto text-foreground">{sek.format(ownFunds)}</strong>
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <span className="size-2.5 rounded-full bg-primary/75" />
                  Nytt lån{" "}
                  <strong className="ml-auto text-foreground">
                    {sek.format(result.loanRequired)}
                  </strong>
                </p>
              </div>
            </section>

            <section className={card}>
              <p className={eyebrow}>Effekt på fastighetsägaren</p>
              <h2 className="mt-1 text-xl font-semibold text-foreground">
                Före och efter investeringen
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {effects.map((item) => (
                  <article key={item.label} className={fieldCard}>
                    <div className="flex items-center justify-between">
                      <item.icon aria-hidden className="size-4 text-muted-foreground" />
                      <StatusDot status={item.status} />
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">{item.label}</p>
                    <p className="mt-1 text-lg font-semibold text-foreground">{item.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.note}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className={card}>
              <p className={eyebrow}>Förvaltningens nästa fråga</p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">
                Är finansieringen rimlig även om räntan stiger?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Prova att höja räntan en procentenhet och kontrollera både finansieringskostnaden
                och likviditetsbufferten innan förvaltningen går vidare.
              </p>
            </section>
            <p className="px-1 text-xs text-muted-foreground">
              Exempeldata i prototypen. Simulatorn är ett beslutsunderlag och ersätter inte budget,
              offert eller lånelöfte.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
