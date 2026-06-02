import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import ColorDisplay from '../components/ColorDisplay';
import SliderControl from '../components/SliderControl';
import TimerBar from '../components/TimerBar';
import OnboardTooltip from '../components/OnboardTooltip';
import {
  calculateColorSimilarity,
  generateRandomColor,
  getScoreFeedback,
  hslToCss,
} from '../utils/color';
import { loadHighScore, saveHighScore, saveLeaderboardEntry, clearLeaderboard, clearHighScore } from '../utils/storage';
import { playSound } from '../utils/sound';

const initialGuess = { h: 180, s: 65, l: 55 };
const MEMORIZE_SECONDS = 5;

export default function GamePage() {
  const [username, setUsername] = useState('');
  const [phase, setPhase] = useState('setup');
  const [targetColor, setTargetColor] = useState(() => generateRandomColor());
  const [guessColor, setGuessColor] = useState(initialGuess);
  const [secondsLeft, setSecondsLeft] = useState(MEMORIZE_SECONDS);
  const [resultScore, setResultScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [bestScore, setBestScore] = useState(0);
  const [roundHistory, setRoundHistory] = useState([]);
  // keep as string so the input can be cleared/edited without forcing a number
  const [playersCount, setPlayersCount] = useState('1');
  const [nameInputs, setNameInputs] = useState(['']);
  const [players, setPlayers] = useState([]); // { name, score }
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [seenOnboard, setSeenOnboard] = useState(() => {
    try {
      return Boolean(window.localStorage.getItem('memgrad_seen_onboard'));
    } catch {
      return false;
    }
  });
  const [showOnboard, setShowOnboard] = useState(() => {
    try {
      return !Boolean(window.localStorage.getItem('memgrad_seen_onboard'));
    } catch {
      return true;
    }
  });

  useEffect(() => {
    setBestScore(loadHighScore());
  }, []);

  useEffect(() => {
    if (phase !== 'memorizing') return undefined;

    if (secondsLeft === 0) {
      setPhase('recreating');
      playSound('memory-reveal');
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setSecondsLeft((value) => value - 1);
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [phase, secondsLeft]);

  useEffect(() => {
    if (phase !== 'result') return undefined;

    return undefined;
  }, [phase]);

  const guessColorCss = useMemo(() => hslToCss(guessColor), [guessColor]);

  const startRound = () => {
    setTargetColor(generateRandomColor());
    setGuessColor(initialGuess);
    setResultScore(0);
    setFeedback('');
    setSecondsLeft(MEMORIZE_SECONDS);
    setPhase('memorizing');
    playSound('round-start');
  };

  const startRoundForPlayer = (playerIdx = 0) => {
    const idx = typeof playerIdx === 'number' ? playerIdx : 0;
    if (players && players[idx]) {
      setUsername(players[idx].name);
    }
    setCurrentPlayer(idx);
    startRound();
  };

  const initializePlayers = () => {
    const list = Array.from({ length: Math.max(1, Number(playersCount) || 1) }).map((_, i) => ({
      name: (nameInputs[i] || '').trim() || `Player ${i + 1}`,
      score: null,
    }));
    setPlayers(list);
    // begin with first player
    startRoundForPlayer(0);
  };

  const startNewGame = () => {
    setPhase('setup');
    setUsername('');
    setFeedback('');
    setResultScore(0);
    setGuessColor(initialGuess);
    setSecondsLeft(MEMORIZE_SECONDS);
    // clear session players and history so a truly new game starts fresh
    setPlayers([]);
    setRoundHistory([]);
    setNameInputs(['']);
    setPlayersCount('1');
  };

  const closeOnboard = () => {
    try {
      window.localStorage.setItem('memgrad_seen_onboard', '1');
    } catch {}
    setSeenOnboard(true);
    setShowOnboard(false);
  };

  const handleSubmit = () => {
    if (phase !== 'recreating') return;

    const score = calculateColorSimilarity(targetColor, guessColor);
    const nextFeedback = getScoreFeedback(score);

    setResultScore(score);
    setFeedback(nextFeedback);
    // determine whether this was the last player in the session
    const isLastPlayer = currentPlayer >= players.length - 1;
    setPhase(isLastPlayer ? 'finished' : 'result');

    const updatedBest = Math.max(bestScore, score);
    setBestScore(updatedBest);
    saveHighScore(score);
    saveLeaderboardEntry({
      username: username.trim() || `Player ${currentPlayer + 1}`,
      score,
      createdAt: new Date().toISOString(),
    });

    // store per-player score
    setPlayers((prev) => {
      const next = prev.slice();
      next[currentPlayer] = { ...(next[currentPlayer] || {}), score };
      return next;
    });
    setRoundHistory((currentHistory) => {
      const nextHistory = [
        ...currentHistory,
        {
          username: username.trim() || `Player ${currentPlayer + 1}`,
          score,
          color: targetColor,
        },
      ].slice(-2);

      return nextHistory;
    });

    playSound(score >= 80 ? 'success' : 'result');
  };

  const handlePlayAgain = () => {
    // clear persistent leaderboard/high score so next "New Game" starts fresh
    clearLeaderboard();
    clearHighScore();
    startNewGame();
  };

  const handleBackToStart = () => {
    startNewGame();
  };

  const hueDifference = Math.min(Math.abs(targetColor.h - guessColor.h), 360 - Math.abs(targetColor.h - guessColor.h));
  const saturationDifference = Math.abs(targetColor.s - guessColor.s);
  const lightnessDifference = Math.abs(targetColor.l - guessColor.l);
  const previousResult = roundHistory.length === 2 ? roundHistory[0] : null;
  const scoreDifference = previousResult ? Math.abs(roundHistory[1].score - previousResult.score) : null;

  const allPlayersFinished = players.length > 0 && players.every((p) => p.score != null);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0b0f] px-3 py-4 sm:px-4">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative mx-auto flex w-full max-w-[430px] flex-col items-center pt-8"
      >
        <div className="w-full">
          {phase === 'setup' ? (
            <div className="relative w-full min-h-[72vh] rounded-[1rem] border border-white/10 bg-[#12131a] px-6 py-10">
                <div className="text-center text-lg font-semibold tracking-[0.18em] text-white mb-8">Memorize the Gradient</div>
              <div className="mt-8 grid grid-cols-2 gap-6 text-sm text-white/85">
                <label className="col-span-2 flex items-center gap-2">
                  <span className="text-[13px]">Players</span>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={playersCount}
                    onChange={(e) => {
                      const vStr = e.target.value;
                      setPlayersCount(vStr);
                      const v = Math.max(1, Number(vStr) || 1);
                      setNameInputs((prev) => {
                        const next = prev.slice();
                        while (next.length < v) next.push('');
                        return next.slice(0, v);
                      });
                    }}
                    className="ml-2 w-16 rounded bg-black/20 px-2 py-1 text-white"
                  />
                </label>

                {Array.from({ length: Math.max(1, Number(playersCount) || 1) }).map((_, i) => (
                  <input
                    key={i}
                    value={nameInputs[i] || ''}
                    onChange={(e) => setNameInputs((prev) => {
                      const next = prev.slice();
                      next[i] = e.target.value;
                      return next;
                    })}
                    maxLength={20}
                    placeholder={`Player ${i + 1}`}
                    className="col-span-2 mt-4 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-center text-white outline-none placeholder:text-white/35"
                  />
                ))}

              </div>
              <button onClick={() => { playSound('click'); initializePlayers(); }} onMouseEnter={() => playSound('hover')} className="mt-10 w-full rounded-lg bg-white px-4 py-4 text-sm font-black uppercase tracking-[0.18em] text-black">
                Start
              </button>
            </div>
          ) : phase === 'memorizing' ? (
            <div className="relative w-full min-h-[72vh] overflow-hidden rounded-[1rem]" style={{ background: `linear-gradient(135deg, ${hslToCss(targetColor)}, ${hslToCss(targetColor)})` }}>
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,transparent_45%,rgba(255,255,255,0.05)_100%)]" />
              <div className="absolute inset-x-4 top-4 text-right text-[11px] uppercase tracking-[0.28em] text-white/85">{secondsLeft}</div>
              <div className="absolute right-4 bottom-4 text-right text-xs uppercase tracking-[0.24em] text-white/85">memorize</div>
            </div>
          ) : phase === 'recreating' ? (
            <div className="w-full min-h-[72vh] rounded-[1rem] border border-white/10 bg-[#12131a] px-4 py-5">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-white/70">
                <span>guess</span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] text-white/70">{guessColor.h} / {guessColor.s} / {guessColor.l}</span>
              </div>

              <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-2">
                <div className="h-[38vh] min-h-[220px] sm:h-[50vh] sm:min-h-[280px] rounded-[0.9rem] border border-white/10" style={{ background: `linear-gradient(135deg, ${guessColorCss}, ${guessColorCss})` }} />
              </div>

              <div className="mt-4 space-y-2">
                <SliderControl label="Hue" value={guessColor.h} min={0} max={360} accent="rgba(255,255,255,0.95)" onChange={(value) => setGuessColor((current) => ({ ...current, h: value }))} />
                <SliderControl label="Sat" value={guessColor.s} min={0} max={100} accent="rgba(255,255,255,0.95)" onChange={(value) => setGuessColor((current) => ({ ...current, s: value }))} />
                <SliderControl label="Light" value={guessColor.l} min={0} max={100} accent="rgba(255,255,255,0.95)" onChange={(value) => setGuessColor((current) => ({ ...current, l: value }))} />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button onClick={() => { playSound('click'); handleSubmit(); }} onMouseEnter={() => playSound('hover')} className="rounded-lg bg-white px-4 py-3 text-sm font-black uppercase tracking-[0.18em] text-black">
                  Submit
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full min-h-[72vh] rounded-[1rem] border border-white/10 bg-[#12131a] px-4 py-5">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-white/70">
                <span>finished</span>
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/40">✓</span>
              </div>
              <div className="mt-4 rounded-lg border border-white/10 bg-black/20 px-3 py-3 text-sm text-white/80">
                {players.length > 1 && allPlayersFinished ? (
                  <>
                    <div className="mb-2 text-[12px] font-semibold text-white">Final Results</div>
                    <div className="space-y-2 text-sm text-white/90">
                      {players.map((p, idx) => (
                        <div key={p.name || idx} className={`flex items-center justify-between ${idx === 0 ? 'text-amber-300' : 'text-white/85'}`}>
                          <span>{idx + 1}. {p.name}</span>
                          <span>{p.score}%</span>
                        </div>
                      ))}
                      {players.length >= 2 ? (
                        <div className="mt-2 text-[11px] text-white/70">Difference: {Math.abs((players[0].score || 0) - (players[1].score || 0))}%</div>
                      ) : null}
                    </div>
                  </>
                ) : (
                  <>Accuracy {resultScore}%</>
                )}
              </div>
              <div className="mt-3 rounded-lg border border-white/10 bg-black/20 px-3 py-3 text-xs leading-6 text-white/70">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="mb-2 text-[10px] uppercase tracking-[0.22em] text-white/45">Original</div>
                    <div className="h-16 rounded-md border border-white/10" style={{ background: hslToCss(targetColor) }} />
                  </div>
                  <div>
                    <div className="mb-2 text-[10px] uppercase tracking-[0.22em] text-white/45">Guessed</div>
                    <div className="h-16 rounded-md border border-white/10" style={{ background: hslToCss(guessColor) }} />
                  </div>
                </div>
                <div className="mt-3 text-center text-[11px] uppercase tracking-[0.24em] text-white/60">
                  Difference: {hueDifference} / {saturationDifference} / {lightnessDifference}
                </div>
                {/* removed mini leaderboard per user request */}
              </div>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {players.length > 1 && !allPlayersFinished ? (
                  // if there are more players, offer Next Player or Show Results
                  currentPlayer < players.length - 1 ? (
                    <button onClick={() => { playSound('click'); startRoundForPlayer(currentPlayer + 1); }} onMouseEnter={() => playSound('hover')} className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-black uppercase tracking-[0.18em] text-white">
                      Next Player
                    </button>
                  ) : (
                    <button onClick={() => { playSound('click'); setPhase('finished'); }} onMouseEnter={() => playSound('hover')} className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-black uppercase tracking-[0.18em] text-white">
                      Show Results
                    </button>
                  )
                ) : (
                  <button onClick={handleBackToStart} className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-black uppercase tracking-[0.18em] text-white" onMouseEnter={() => playSound('hover')} onClickCapture={() => playSound('click')}>
                    Back
                  </button>
                )}

                <button onClick={() => { playSound('click'); handlePlayAgain(); }} onMouseEnter={() => playSound('hover')} className="rounded-lg bg-white px-4 py-3 text-sm font-black uppercase tracking-[0.18em] text-black">
                  Start New Game
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
      {/* global help button + tooltip (fixed bottom-right, outside card) */}
      <button
        aria-label="Help"
        onClick={() => setShowOnboard(true)}
        className="fixed right-6 bottom-6 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/8 text-white/90 hover:bg-white/12"
      >
        ?
      </button>
      {(!seenOnboard || showOnboard) ? <OnboardTooltip onClose={closeOnboard} /> : null}
    </div>
  );
}