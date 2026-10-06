import { useState, type FormEvent } from "react";
import { exampleQuestions, sampleAnswer } from "@/data/overview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AskPanel() {
  const [question, setQuestion] = useState("");
  const [asked, setAsked] = useState<string | null>(null);

  function submit(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    setQuestion(trimmed);
    setAsked(trimmed);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    submit(question);
  }

  return (
    <section
      aria-labelledby="ask-heading"
      className="rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8"
    >
      <h2 id="ask-heading" className="text-lg font-semibold text-foreground">
        Fråga om fastighetsägaren
      </h2>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Exempel: Varför har våra kostnader ökat?"
          aria-label="Din fråga"
          className="h-12 rounded-xl bg-surface text-sm"
        />
        <Button type="submit" className="h-12 rounded-xl px-6">
          Fråga
        </Button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {exampleQuestions.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => submit(example)}
            className="rounded-full border border-border bg-secondary/60 px-3.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-ring/40 hover:text-foreground"
          >
            {example}
          </button>
        ))}
      </div>

      {asked && (
        <div className="mt-6 rounded-2xl border border-border bg-secondary/50 p-5">
          <p className="text-xs text-muted-foreground">Svar på: {asked}</p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">{sampleAnswer}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            Exempelsvar i prototypen. Fakta, analys och rekommendation redovisas separat i den
            färdiga tjänsten.
          </p>
        </div>
      )}
    </section>
  );
}
