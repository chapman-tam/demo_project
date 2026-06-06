type MoleGridProps = {
  holeIds: number[];
  activeMoles: { holeId: number; value: number }[];
  lastHitHole: number | null;
  canWhack: boolean;
  onWhack: (holeId: number) => void;
};

export function MoleGrid({
  holeIds,
  activeMoles,
  lastHitHole,
  canWhack,
  onWhack,
}: MoleGridProps) {
  return (
    <section className="perspective-1000 grid w-full grid-cols-3 gap-6 rounded-[2.5rem] border border-white/10 bg-slate-900/40 p-6 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-8">
      {holeIds.map((holeId) => {
        const activeMole = activeMoles.find(m => m.holeId === holeId);
        const isActive = !!activeMole;
        const isHit = lastHitHole === holeId;

        return (
          <div
            key={holeId}
            className="group relative aspect-square"
          >
            {/* The Hole - 3D depth effect */}
            <div className="absolute inset-0 overflow-hidden rounded-[2rem] border-4 border-slate-800/80 bg-gradient-to-b from-black via-slate-950 to-slate-900 shadow-[inset_0_10px_20px_rgba(0,0,0,0.8)]">
              {/* Internal rim shadow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05),transparent_70%)]" />
            </div>

            {/* The Interaction Area */}
            <button
              type="button"
              onClick={() => onWhack(holeId)}
              disabled={!canWhack}
              className="absolute inset-0 z-10 cursor-pointer outline-none transition-transform duration-75 active:scale-95"
              aria-label={`Hole ${holeId + 1}`}
            >
              {/* The Mole */}
              <div className="absolute inset-0 flex items-end justify-center pb-4 pointer-events-none">
                <div 
                  className={`relative w-4/5 h-4/5 transition-opacity duration-75 ${
                    isActive ? "animate-mole-pop opacity-100" : isHit ? "animate-mole-hit" : "translate-y-[120%] opacity-0"
                  }`}
                >
                  {/* Mole Body */}
                  <div className="h-full w-full rounded-t-full border-b-0 border-x-4 border-t-4 border-amber-900/30 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-700 shadow-[0_-10px_25px_-5px_rgba(245,158,11,0.4)] flex flex-col items-center justify-start pt-2">
                    {/* Value Display */}
                    <span className="text-2xl font-black text-slate-950 bg-white/40 px-2 rounded-lg backdrop-blur-sm">
                      {activeMole?.value}
                    </span>
                    
                    {/* Eyes */}
                    <div className="mt-2 flex gap-4">
                      <div className="h-2 w-2 rounded-full bg-slate-900" />
                      <div className="h-2 w-2 rounded-full bg-slate-900" />
                    </div>
                  </div>
                </div>
              </div>
            </button>

            {/* Hit Effect Particles/Text */}
            {isHit && (
              <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
                <span className="animate-float-up text-4xl font-black italic text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
                  HIT!
                </span>
                {/* Visual Splash */}
                <div className="absolute h-full w-full animate-ping rounded-full bg-cyan-400/10" />
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
