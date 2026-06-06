type GameHudProps = {
  score: number;
  bestScore: number;
  timeLeft: number;
};

export function GameHud({ score, bestScore, timeLeft }: GameHudProps) {
  const statCards = [
    { label: "Score", value: score, tone: "from-violet-500/80 to-indigo-500/80" },
    { label: "Best", value: bestScore, tone: "from-cyan-500/80 to-sky-500/80" },
    { label: "Time", value: `${timeLeft}s`, tone: "from-amber-500/80 to-orange-500/80" },
  ];

  return (
    <section className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
      {statCards.map((card) => (
        <article
          key={card.label}
          className="group flex flex-col rounded-2xl border border-white/15 bg-white/5 p-4 shadow-lg backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-white/35"
        >
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-slate-300">
            {card.label}
          </span>
          <span
            className={`mt-2 bg-gradient-to-r ${card.tone} bg-clip-text text-3xl font-bold text-transparent`}
          >
            {card.value}
          </span>
        </article>
      ))}
    </section>
  );
}
