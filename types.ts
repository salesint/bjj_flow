
export enum SessionType {
  GI = 'Gi',
  NO_GI = 'No-Gi',
  DRILL = 'Drill/Técnica',
  OPEN_MAT = 'Open Mat',
  COMPETITION = 'Competição'
}

export enum BeltLevel {
  WHITE = 'Branca',
  BLUE = 'Azul',
  PURPLE = 'Roxa',
  BROWN = 'Marrom',
  BLACK = 'Preta'
}

export interface TrainingSession {
  id: string;
  title?: string;
  date: string; // ISO format
  type: SessionType;
  duration: number; // minutes
  intensity: number; // 1-5
  positions: string[]; // Ex: Guarda, Passagem, Costas
  drills: string[];    // Ex: 50 repetições de armlock
  notes: string;
  partners: string[];
  coach?: string;
}

export interface UserProfile {
  name: string;
  belt: BeltLevel;
  stripes: number;
  academy: string;
}