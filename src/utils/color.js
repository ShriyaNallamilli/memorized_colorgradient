export function generateRandomColor() {
  return {
    h: Math.floor(Math.random() * 360),
    s: Math.floor(55 + Math.random() * 40),
    l: Math.floor(38 + Math.random() * 24),
  };
}

export function hslToCss(color) {
  return `hsl(${Math.round(color.h)} ${Math.round(color.s)}% ${Math.round(color.l)}%)`;
}

export function calculateColorSimilarity(originalColor, guessColor) {
  // normalize distances to [0..1]
  const hueDistance = Math.min(Math.abs(originalColor.h - guessColor.h), 360 - Math.abs(originalColor.h - guessColor.h)) / 180;
  const saturationDistance = Math.abs(originalColor.s - guessColor.s) / 100;
  const lightnessDistance = Math.abs(originalColor.l - guessColor.l) / 100;

  // increase hue importance and make scoring non-linear (harder to get very high scores)
  const weightedDistance = hueDistance * 0.6 + saturationDistance * 0.25 + lightnessDistance * 0.15;

  // apply square-root to amplify small differences, then scale more aggressively
  const adjusted = Math.sqrt(Math.max(0, weightedDistance));
  const score = Math.round(100 - adjusted * 120);

  return Math.max(0, Math.min(100, score));
}

export function getScoreFeedback(score) {
  if (score >= 95) {
    return 'Color Wizard';
  }

  if (score >= 80) {
    return 'Almost Perfect';
  }

  if (score >= 60) {
    return 'Pretty Good';
  }

  return 'Needs More Practice';
}