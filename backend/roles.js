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

// XP required at the start of each level.
// 1→2 = 50 XP, 2→3 = 60 XP, 3→4 = 70 XP, etc.
export function xpForLevel(level) {
  const n = Math.max(0, Math.floor(Number(level || 1)) - 1);
  return 5 * n * (n + 9);
}

// A new patent is earned every 5 levels. These are the project's existing titles.
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

export function roleEntryFromLevel(level) {
  let current = ROLES[0];
  for (const item of ROLES) {
    if (item.level <= level) current = item;
    else break;
  }
  return current;
}

export function roleFromLevel(level) {
  return roleEntryFromLevel(level).role;
}

export function nextRoleEntry(level) {
  return ROLES.find(item => item.level > level) || null;
}

export function progressionFromXp(xp) {
  const value = Math.max(0, Number(xp || 0));
  const level = levelFromXp(value);
  const currentLevelXp = xpForLevel(level);
  const nextLevelXp = xpForLevel(level + 1);
  const currentPatent = roleEntryFromLevel(level);
  const nextPatent = nextRoleEntry(level);
  const span = Math.max(1, nextLevelXp - currentLevelXp);
  return {
    xp: value,
    level,
    currentLevelXp,
    nextLevelXp,
    levelProgress: Math.max(0, Math.min(100, Math.round((value - currentLevelXp) / span * 100))),
    patent: currentPatent.role,
    patentLevel: currentPatent.level,
    nextPatent: nextPatent ? nextPatent.role : null,
    nextPatentLevel: nextPatent ? nextPatent.level : null,
    xpToNextPatent: nextPatent ? Math.max(0, xpForLevel(nextPatent.level) - value) : 0
  };
}

export function medalLevels(level) {
  const n = Math.max(0, Math.floor(level / 5));
  return Array.from({ length: n }, (_, i) => (i + 1) * 5);
}

export function medalLevel(level) {
  return level >= 5 && level % 5 === 0 ? level : null;
}
