# Memorize the Gradient

A small React + Vite learning project: memorize a gradient, then re-create it using HSL sliders. This repository is organized for a beginner-level study project and includes notes for running and grading.

## Quick start

Prerequisites: Node.js (>=16) and npm

1. Install dependencies

```bash
npm install
```

2. Start dev server

```bash
npm run dev
```

Open the URL printed by Vite (usually http://localhost:5173).

3. Build for production

```bash
npm run build
npm run preview
```

## How to play

- On the setup screen enter player names and the number of players, then click `Start`.
- Each player will see the gradient for a few seconds (memorize), then use the `Hue`, `Sat`, and `Light` sliders to reproduce it.
- Click `Submit` to see your score for that player.
- Use `Next Player` to let the next player take their turn.
- After the last player submits, the final results screen shows each player's score and the absolute percentage difference between the first two players.
- Click `Start New Game` to clear all session and persistent data and begin a fresh session.

## Implementation notes (for reviewers)

- Framework: React + Vite (see `package.json` scripts `dev`, `build`, `preview`).
- Scoring: implemented in `src/utils/color.js` (weighted hue/sat/light with a non-linear transform to make high scores harder to get).
- Multiplayer flow: managed in `src/pages/GamePage.jsx` — players are kept in-memory for the current session; `Start New Game` clears in-memory and localStorage leaderboard/high-score.
- Sounds: WebAudio helper in `src/utils/sound.js`. Slider sounds were intentionally removed for a quieter, beginner-friendly experience.

## Files to check

- `src/pages/GamePage.jsx` — main UI and game flow
- `src/utils/color.js` — scoring + helpers
- `src/components/SliderControl.jsx` — slider UI
- `src/utils/storage.js` — localStorage helpers

## For grading

- To demonstrate the session behavior: run two players, play both turns, observe the final results and difference, then click `Start New Game` and confirm previous players are cleared.

## Extending the project (ideas)

- Add difficulty modes (longer/shorter memorize time)
- Add per-session leaderboard UI
- Add basic unit tests for `calculateColorSimilarity`

---

If you want, I can add a short demo GIF or a `CONTRIBUTING.md` with development notes. Which next?
