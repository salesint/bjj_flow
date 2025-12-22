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
  positions: string[]; 
  drills: string[];    
  notes: string;
  partners: string[];
}

export interface UserProfile {
  name: string;
  belt: BeltLevel;
  stripes: number;
  academy: string;
}