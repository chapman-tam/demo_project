import { GameStatus } from "../lib/game-config";

type GameControlsProps = {
  status: GameStatus;
  onStart: () => void;
  onRestart: () => void;
};

export function GameControls({ status, onStart, onRestart }: GameControlsProps) {
  const isIdle = status === "idle";
  const isRunning = status === "running";

  return (
    <section className="flex w-full flex-col items-center gap-4 rounded-2xl border border-white/15 bg-white/5 p-4 shadow-lg backdrop-blur-md sm:flex-row sm:justify-between">
      <p className="text-center text-sm text-slate-200 sm:text-left">
        Smash the mole as soon as it pops up. Fast reactions win.
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onStart}
          disabled={!isIdle}
          className="cursor-pointer rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/40 transition duration-200 hover:scale-[1.03] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Start
        </button>

        <button
          type="button"
          onClick={onRestart}
          disabled={isRunning}
          className="cursor-pointer rounded-xl border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition duration-200 hover:scale-[1.03] hover:border-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Restart
        </button>
      </div>
    </section>
  );
}
