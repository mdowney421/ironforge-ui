export type ScreenType = 'welcome' | 'dashboard' | 'active_workout' | 'create_workout' | 'history' | 'profile';

export interface SetEntry {
  setNumber: number;
  targetWeight: number;
  targetReps: number;
}

export interface TemplateExercise {
  id: string;
  name: string;
  targetMuscle: string;
  category: string;
  sets: SetEntry[];
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  tags: string[];
  durationMinutes: number;
  exercisesCount: number;
  accentColor: 'cyan' | 'lime' | 'coral';
  exercises: TemplateExercise[];
}

export interface ActiveSet {
  id: string;
  setNumber: number;
  weight: number;
  reps: number;
  isCompleted: boolean;
}

export interface ActiveExercise {
  id: string;
  name: string;
  tags: string[];
  sets: ActiveSet[];
  isCompleted?: boolean;
}

export interface ActiveWorkout {
  id: string;
  templateId?: string;
  templateName: string;
  startTime: number;
  currentExerciseIndex: number;
  exercises: ActiveExercise[];
  isPaused?: boolean;
}

export interface HistorySession {
  id: string;
  date: string;
  relativeDate: string;
  workoutName: string;
  durationMinutes: number;
  totalVolumeLbs: number;
  exerciseRecords: {
    name: string;
    setsSummary: string;
    max1RM: number;
    sets: { setNumber: number; weight: number; reps: number; oneRepMax: number }[];
  }[];
}

export interface ExerciseAnalytics {
  exerciseName: string;
  tags: string[];
  estimated1RM: number;
  changeLbs: number;
  allTimePR: {
    weight: number;
    date: string;
  };
  totalVolume: string;
  percentileRank: string;
  totalSessions: number;
  frequencyBars: number[];
  historyPoints: { month: string; value: number }[];
  recentSessions: {
    id: string;
    relativeDate: string;
    workoutName: string;
    oneRepMax: number;
    sets: { setNumber: number; weight: number; reps: number; oneRepMax: number }[];
  }[];
}

export interface UserProfile {
  name: string;
  badge: string;
  avatarUrl: string;
  weightLbs: number;
  height: string;
  bodyFatPercent: number;
  personalRecords: {
    id: string;
    name: string;
    weight: number;
    date: string;
    icon: string;
  }[];
  preferences: {
    accountSecurity: string;
    notifications: boolean;
    units: 'LBS / IN' | 'KG / CM';
    integrations: string;
  };
}
