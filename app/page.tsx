"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GameControls } from "../components/game-controls";
import { GameHud } from "../components/game-hud";
import { MoleGrid } from "../components/mole-grid";
import {
  GAME_DURATION_SECONDS,
  GameStatus,
  HIT_POINTS,
  SPAWN_INTERVAL_MS,
} from "../lib/game-config";
import {
  calculateNextHighScore,
  createHoleIds,
  generateMathProblem,
  pickMultipleHoles,
  MathProblem,
} from "../lib/game-engine";
import { loadHighScore, saveHighScore } from "../lib/high-score";
import { GameSoundEffects } from "../lib/sound-effects";

type ActiveMole = {
  holeId: number;
  value: number;
};

const HOLE_IDS = createHoleIds();

export default function Home() {
  const [status, setStatus] = useState<GameStatus>("idle");
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION_SECONDS);
  const [activeMoles, setActiveMoles] = useState<ActiveMole[]>([]);
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [lastHitHole, setLastHitHole] = useState<number | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnCounterRef = useRef(0);
  const scoreRef = useRef(0);
  const hitSpawnIdsRef = useRef(new Set<number>());
  const soundEffectsRef = useRef<GameSoundEffects | null>(null);

  const ensureSoundEffects = useCallback(() => {
    if (!soundEffectsRef.current) {
      soundEffectsRef.current = new GameSoundEffects();
    }
    return soundEffectsRef.current;
  }, []);

  const clearLoops = useCallback(() => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
    timerIntervalRef.current = null;
    spawnIntervalRef.current = null;
  }, []);

  const stopGame = useCallback(() => {
    clearLoops();
    setStatus("ended");
    setActiveMoles([]);
    setCurrentProblem(null);

    const soundEffects = ensureSoundEffects();
    soundEffects.playEnd();

    const nextBest = calculateNextHighScore(bestScore, scoreRef.current);
    if (nextBest !== bestScore) {
      setBestScore(nextBest);
      saveHighScore(nextBest);
    }
  }, [bestScore, clearLoops, ensureSoundEffects]);

  const spawnMole = useCallback(() => {
    const problem = generateMathProblem();
    const holes = pickMultipleHoles(HOLE_IDS, 3);
    
    const newActiveMoles = holes.map((holeId, index) => ({
      holeId,
      value: problem.options[index],
    }));

    spawnCounterRef.current += 1;
    const soundEffects = ensureSoundEffects();
    soundEffects.playPop();

    setCurrentProblem(problem);
    setActiveMoles(newActiveMoles);
  }, [ensureSoundEffects]);

  const startGameLoop = useCallback(async () => {
    clearLoops();
    
    const soundEffects = ensureSoundEffects();
    const unlocked = await soundEffects.unlock();
    
    if (!unlocked) {
      console.warn("Audio could not be unlocked. Game will proceed without sound.");
    }

    setStatus("running");
    setScore(0);
    scoreRef.current = 0;
    setTimeLeft(GAME_DURATION_SECONDS);
    setLastHitHole(null);
    spawnCounterRef.current = 0;
    hitSpawnIdsRef.current.clear();

    soundEffects.playStart();
    spawnMole();

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((currentTime) => {
        if (currentTime <= 1) {
          window.setTimeout(stopGame, 0);
          return 0;
        }

        if (currentTime <= 6) {
          ensureSoundEffects().playTick();
        }

        return currentTime - 1;
      });
    }, 1000);

    spawnIntervalRef.current = setInterval(spawnMole, SPAWN_INTERVAL_MS * 4.0); // Show moles longer for math solving
  }, [clearLoops, ensureSoundEffects, spawnMole, stopGame]);

  const handleStart = () => {
    if (status === "idle") {
      void startGameLoop();
    }
  };
  
  const handleRestart = () => {
    void startGameLoop();
  };

  const handleWhack = useCallback(
    (holeId: number) => {
      if (status !== "running" || activeMoles.length === 0 || !currentProblem) return;

      const mole = activeMoles.find(m => m.holeId === holeId);
      if (!mole) return;

      const soundEffects = ensureSoundEffects();

      if (mole.value !== currentProblem.answer) {
        soundEffects.playMiss();
        // Option: deduct score or just miss
        return;
      }

      if (hitSpawnIdsRef.current.has(spawnCounterRef.current)) return;

      hitSpawnIdsRef.current.add(spawnCounterRef.current);
      setActiveMoles([]);
      setLastHitHole(holeId);
      setIsShaking(true);
      
      soundEffects.playHit();

      setScore((prev) => {
        const next = prev + HIT_POINTS;
        scoreRef.current = next;
        return next;
      });

      window.setTimeout(() => {
        setLastHitHole((curr) => curr === holeId ? null : curr);
        setIsShaking(false);
      }, 300);
    },
    [activeMoles, currentProblem, ensureSoundEffects, status],
  );

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setBestScore(loadHighScore()));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => () => {
    clearLoops();
    soundEffectsRef.current?.dispose();
    soundEffectsRef.current = null;
  }, [clearLoops]);

  return (
    <div className={`relative flex min-h-screen w-full flex-col bg-[#020617] text-white transition-transform duration-75 ${isShaking ? "animate-shake" : ""}`}>
      <header className="fixed inset-x-0 top-0 z-20 border-b border-white/5 bg-slate-950/80 backdrop-blur-2xl">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5 sm:px-10">
          <h1 className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-400 bg-clip-text text-2xl font-black tracking-tighter text-transparent">
            MOLE STRIKE
          </h1>
          <div className="flex items-center gap-3">
             <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
             <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Live Arena</span>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 pb-28 pt-28 sm:px-10">
        <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-md">
           <div className="relative z-10">
             <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">Speed is everything.</h2>
             <p className="mt-3 max-w-xl text-lg font-medium text-slate-400">
               Tap moles as they pop. Survive the 30s clock.
             </p>
           </div>
           <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-600/10 blur-[100px]" />
        </section>

        <GameHud 
          score={score} 
          bestScore={bestScore} 
          timeLeft={timeLeft} 
          question={currentProblem?.question}
        />

        <MoleGrid
          holeIds={HOLE_IDS}
          activeMoles={activeMoles}
          lastHitHole={lastHitHole}
          canWhack={status === "running"}
          onWhack={handleWhack}
        />

        <GameControls status={status} onStart={handleStart} onRestart={handleRestart} />

        {status === "ended" && (
          <section className="animate-in fade-in zoom-in flex flex-col items-center gap-4 rounded-[2rem] border border-emerald-400/20 bg-emerald-400/5 p-8 text-center shadow-2xl backdrop-blur-xl duration-300">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400">Session Terminated</p>
            <div className="flex flex-col gap-1">
               <p className="text-5xl font-black text-white">{score}</p>
               <p className="text-sm font-bold text-emerald-400/60 tracking-wide">TOTAL SCORE</p>
            </div>
            <p className="text-xs font-medium text-slate-500 italic">Global Best: {bestScore}</p>
            <button
              type="button"
              onClick={handleRestart}
              className="mt-4 cursor-pointer rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 px-8 py-4 text-sm font-black uppercase tracking-widest text-slate-950 shadow-[0_10px_30px_-10px_rgba(52,211,153,0.5)] transition-all hover:scale-105 hover:brightness-110 active:scale-95"
            >
              Re-Engage
            </button>
          </section>
        )}
      </main>

      <footer className="fixed inset-x-0 bottom-0 z-20 border-t border-white/5 bg-slate-950/80 backdrop-blur-2xl">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 sm:px-10">
          <span>v2.0 Arcade Protocol</span>
          <span className="text-slate-700">Ready for Input</span>
        </div>
      </footer>
    </div>
  );
}
