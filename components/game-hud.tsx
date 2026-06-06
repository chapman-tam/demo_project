type GameHudProps = {
  score: number;
  bestScore: number;
  timeLeft: number;
  question?: string;
};

export function GameHud({ score, bestScore, timeLeft, question }: GameHudProps) {
  const statCards = [
    { label: "Question", value: question ?? "---", tone: "from-fuchsia-400 to-violet-400" },
    { label: "Score", value: score, tone: "from-emerald-400 to-teal-400" },
    { label: "Best", value: bestScore, tone: "from-cyan-400 to-sky-400" },
    { label: "Time", value: `${timeLeft}s`, tone: "from-amber-400 to-orange-400" },
  ];

  return (
    <section className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4">
      {statCards.map((card) => (
        <article
          key={card.label}
          className="group flex flex-col rounded-xl border border-white/15 bg-white/5 p-3 shadow-lg backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-white/35"
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-slate-300">
            {card.label}
          </span>
          <span
            className={`mt-1 bg-gradient-to-r ${card.tone} bg-clip-text text-xl font-bold text-transparent`}
          >
            {card.value}
          </span>
        </article>
      ))}
    </section>
  );
}
