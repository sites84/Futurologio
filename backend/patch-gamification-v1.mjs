import fs from 'node:fs';

const path='backend/worker.js';
let s=fs.readFileSync(path,'utf8');

s=s.replace(
  "import { PLAN_LIMITS, XP_RULES, DAILY_XP_LIMITS, levelFromXp, roleFromLevel, medalLevels } from './roles.js';",
  "import { PLAN_LIMITS, XP_RULES, DAILY_XP_LIMITS, levelFromXp, roleFromLevel, medalLevels, progressionFromXp } from './roles.js';"
);

const old="function roleData(xp){const level=levelFromXp(xp);return {xp,level,role:roleFromLevel(level),medal:level>=5&&level%5===0,medals:medalLevels(level)}}";
const replacement="function roleData(xp){const p=progressionFromXp(xp);return {...p,role:p.patent,medal:p.level>=5&&p.level%5===0,medals:medalLevels(p.level)}}";
if(!s.includes(old)) throw new Error('Expected roleData implementation not found; refusing unsafe patch.');
s=s.replace(old,replacement);
fs.writeFileSync(path,s);
console.log('Canonical gamification payload installed.');
