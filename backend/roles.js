export const PLAN_LIMITS = Object.freeze({
  free: 3,
  basic: 5,
  advanced: 10
});

export const XP_RULES = Object.freeze({
  creation: 10,
  like: 2,
  comment: 3,
  share: 2,
  upload: 5
});

export const DAILY_XP_LIMITS = Object.freeze({
  like: 3,
  comment: 5,
  share: 10
});

// XP needed per transition grows by 10 XP each level:
// 1→2 = 50, 2→3 = 60, 3→4 = 70, ...
// This keeps early progression fast while making high levels meaningful.
export function xpForLevel(level) {
  const n = Math.max(0, Math.floor(Number(level || 1)) - 1);
  return 5 * n * (n + 9);
}

// Cargo evolves every 5 levels. XP amounts remain configurable here.
export const ROLES = Object.freeze([
  { level: 1, role: 'Curioso Iniciante' },
  { level: 5, role: 'Criança Curiosa' },
  { level: 10, role: 'Inventor Aprendiz' },
  { level: 15, role: 'Mestre Inventor' },
  { level: 20, role: 'Cientista do Absurdo' },
  { level: 25, role: 'Mestre do Futuro' },
  { level: 30, role: 'Visionário' },
  { level: 35, role: 'General da Invenção' },
  { level: 40, role: 'Criador do Impossível' },
  { level: 45, role: 'Arquiteto do Universo' },
  { level: 50, role: 'Criador do Universo' }
]);

export function levelFromXp(xp) {
  let level = 1;
  const value = Math.max(0, Number(xp || 0));
  while (value >= xpForLevel(level + 1)) level++;
  return level;
}

export function roleFromLevel(level) {
  let current = ROLES[0];
  for (const item of ROLES) {
    if (item.level <= level) current = item;
    else break;
  }
  return current.role;
}

export function medalLevels(level) {
  const n = Math.max(0, Math.floor(level / 5));
  return Array.from({ length: n }, (_, i) => (i + 1) * 5);
}

export function medalLevel(level) {
  return level >= 5 && level % 5 === 0 ? level : null;
}
