export const PLAN_LIMITS = Object.freeze({
  free: 3,
  basic: 5,
  advanced: 10
});

export const XP_RULES = Object.freeze({
  creation: 10,
  like: 2,
  comment: 3,
  share: 2
});

export const DAILY_XP_LIMITS = Object.freeze({
  like: 5,
  comment: 5,
  share: 10
});

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
  return Math.max(1, Math.floor(Math.max(0, xp) / 100) + 1);
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
