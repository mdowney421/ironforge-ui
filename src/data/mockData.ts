import { WorkoutTemplate, ExerciseAnalytics, UserProfile } from '../types';

export const INITIAL_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'push-day',
    name: 'Push Day',
    tags: ['CHEST', 'SHOULDERS', 'TRICEPS'],
    durationMinutes: 60,
    exercisesCount: 6,
    accentColor: 'cyan',
    exercises: [
      {
        id: 'e1',
        name: 'Incline Barbell Bench',
        targetMuscle: 'Chest',
        category: 'Compound',
        sets: [
          { setNumber: 1, targetWeight: 185, targetReps: 10 },
          { setNumber: 2, targetWeight: 205, targetReps: 8 },
          { setNumber: 3, targetWeight: 225, targetReps: 6 },
        ],
      },
      {
        id: 'e2',
        name: 'Standing Overhead Press',
        targetMuscle: 'Shoulders',
        category: 'Compound',
        sets: [
          { setNumber: 1, targetWeight: 135, targetReps: 10 },
          { setNumber: 2, targetWeight: 155, targetReps: 8 },
          { setNumber: 3, targetWeight: 165, targetReps: 6 },
        ],
      },
      {
        id: 'e3',
        name: 'Dumbbell Incline Flyes',
        targetMuscle: 'Chest',
        category: 'Isolation',
        sets: [
          { setNumber: 1, targetWeight: 45, targetReps: 12 },
          { setNumber: 2, targetWeight: 50, targetReps: 10 },
        ],
      },
      {
        id: 'e4',
        name: 'Cable Lateral Raise',
        targetMuscle: 'Shoulders',
        category: 'Isolation',
        sets: [
          { setNumber: 1, targetWeight: 25, targetReps: 15 },
          { setNumber: 2, targetWeight: 30, targetReps: 12 },
        ],
      },
      {
        id: 'e5',
        name: 'Skull Crushers',
        targetMuscle: 'Triceps',
        category: 'Isolation',
        sets: [
          { setNumber: 1, targetWeight: 75, targetReps: 12 },
          { setNumber: 2, targetWeight: 85, targetReps: 10 },
        ],
      },
      {
        id: 'e6',
        name: 'Rope Tricep Pushdown',
        targetMuscle: 'Triceps',
        category: 'Isolation',
        sets: [
          { setNumber: 1, targetWeight: 60, targetReps: 15 },
          { setNumber: 2, targetWeight: 70, targetReps: 12 },
        ],
      },
    ],
  },
  {
    id: 'pull-day',
    name: 'Pull Day',
    tags: ['BACK', 'BICEPS', 'REAR DELTS'],
    durationMinutes: 55,
    exercisesCount: 7,
    accentColor: 'lime',
    exercises: [
      {
        id: 'p1',
        name: 'Barbell Deadlift',
        targetMuscle: 'Back',
        category: 'Compound',
        sets: [
          { setNumber: 1, targetWeight: 275, targetReps: 8 },
          { setNumber: 2, targetWeight: 315, targetReps: 5 },
          { setNumber: 3, targetWeight: 365, targetReps: 3 },
        ],
      },
      {
        id: 'p2',
        name: 'Weighted Pull-Ups',
        targetMuscle: 'Back',
        category: 'Compound',
        sets: [
          { setNumber: 1, targetWeight: 25, targetReps: 8 },
          { setNumber: 2, targetWeight: 35, targetReps: 6 },
          { setNumber: 3, targetWeight: 45, targetReps: 5 },
        ],
      },
      {
        id: 'p3',
        name: 'Barbell Chest Supported Row',
        targetMuscle: 'Back',
        category: 'Compound',
        sets: [
          { setNumber: 1, targetWeight: 185, targetReps: 10 },
          { setNumber: 2, targetWeight: 205, targetReps: 8 },
        ],
      },
      {
        id: 'p4',
        name: 'Face Pulls',
        targetMuscle: 'Rear Delts',
        category: 'Isolation',
        sets: [
          { setNumber: 1, targetWeight: 50, targetReps: 15 },
          { setNumber: 2, targetWeight: 55, targetReps: 15 },
        ],
      },
      {
        id: 'p5',
        name: 'Incline Dumbbell Curl',
        targetMuscle: 'Biceps',
        category: 'Isolation',
        sets: [
          { setNumber: 1, targetWeight: 35, targetReps: 10 },
          { setNumber: 2, targetWeight: 40, targetReps: 8 },
        ],
      },
    ],
  },
  {
    id: 'legs-heavy',
    name: 'Legs (Heavy)',
    tags: ['QUADS', 'HAMSTRINGS', 'CALVES'],
    durationMinutes: 75,
    exercisesCount: 5,
    accentColor: 'coral',
    exercises: [
      {
        id: 'l1',
        name: 'Leg Extension (Warmup)',
        targetMuscle: 'Quads',
        category: 'Isolation',
        sets: [
          { setNumber: 1, targetWeight: 110, targetReps: 15 },
          { setNumber: 2, targetWeight: 140, targetReps: 12 },
        ],
      },
      {
        id: 'l2',
        name: 'Back Squat',
        targetMuscle: 'Legs',
        category: 'Compound',
        sets: [
          { setNumber: 1, targetWeight: 135, targetReps: 10 },
          { setNumber: 2, targetWeight: 185, targetReps: 8 },
          { setNumber: 3, targetWeight: 225, targetReps: 5 },
          { setNumber: 4, targetWeight: 275, targetReps: 5 },
        ],
      },
      {
        id: 'l3',
        name: 'Romanian Deadlift',
        targetMuscle: 'Hamstrings',
        category: 'Compound',
        sets: [
          { setNumber: 1, targetWeight: 185, targetReps: 10 },
          { setNumber: 2, targetWeight: 225, targetReps: 8 },
          { setNumber: 3, targetWeight: 255, targetReps: 6 },
        ],
      },
      {
        id: 'l4',
        name: 'Leg Press (Heavy)',
        targetMuscle: 'Quads',
        category: 'Compound',
        sets: [
          { setNumber: 1, targetWeight: 360, targetReps: 12 },
          { setNumber: 2, targetWeight: 450, targetReps: 10 },
          { setNumber: 3, targetWeight: 540, targetReps: 8 },
        ],
      },
      {
        id: 'l5',
        name: 'Standing Calf Raise',
        targetMuscle: 'Calves',
        category: 'Isolation',
        sets: [
          { setNumber: 1, targetWeight: 180, targetReps: 15 },
          { setNumber: 2, targetWeight: 200, targetReps: 12 },
          { setNumber: 3, targetWeight: 220, targetReps: 10 },
        ],
      },
    ],
  },
];

export const EXERCISE_LIBRARY = [
  { id: 'lib-1', name: 'Barbell Squat', muscle: 'Legs', category: 'Compound', tags: ['LEGS', 'COMPOUND'] },
  { id: 'lib-2', name: 'Romanian Deadlift', muscle: 'Legs', category: 'Hamstrings', tags: ['LEGS', 'HAMSTRINGS'] },
  { id: 'lib-3', name: 'Barbell Bench Press', muscle: 'Chest', category: 'Compound', tags: ['CHEST', 'COMPOUND'] },
  { id: 'lib-4', name: 'Incline DB Press', muscle: 'Chest', category: 'Compound', tags: ['CHEST', 'UPPER'] },
  { id: 'lib-5', name: 'Barbell Deadlift', muscle: 'Back', category: 'Compound', tags: ['BACK', 'POSTERIOR'] },
  { id: 'lib-6', name: 'Overhead Barbell Press', muscle: 'Shoulders', category: 'Compound', tags: ['SHOULDERS', 'DELTS'] },
  { id: 'lib-7', name: 'Barbell Bent Over Row', muscle: 'Back', category: 'Compound', tags: ['BACK', 'LATS'] },
  { id: 'lib-8', name: 'Pull-Ups / Chin-Ups', muscle: 'Back', category: 'Compound', tags: ['BACK', 'BODYWEIGHT'] },
  { id: 'lib-9', name: 'Leg Press 45°', muscle: 'Legs', category: 'Compound', tags: ['LEGS', 'QUADS'] },
  { id: 'lib-10', name: 'Cable Lateral Raise', muscle: 'Shoulders', category: 'Isolation', tags: ['SHOULDERS', 'ISOLATION'] },
  { id: 'lib-11', name: 'Hanging Leg Raises', muscle: 'Core', category: 'Isolation', tags: ['CORE', 'ABS'] },
  { id: 'lib-12', name: 'Cable Woodchopper', muscle: 'Core', category: 'Isolation', tags: ['CORE', 'OBLIQUES'] },
];

export const MOCK_ANALYTICS_DATA: Record<string, ExerciseAnalytics> = {
  'barbell-back-squat': {
    exerciseName: 'Barbell Back Squat',
    tags: ['LEGS', 'BARBELL'],
    estimated1RM: 315,
    changeLbs: 15,
    allTimePR: {
      weight: 335,
      date: 'Oct 12, 2023',
    },
    totalVolume: '124k',
    percentileRank: 'Top 10%',
    totalSessions: 42,
    frequencyBars: [2, 3, 4, 5, 6],
    historyPoints: [
      { month: 'JAN', value: 275 },
      { month: 'FEB', value: 285 },
      { month: 'MAR', value: 290 },
      { month: 'APR', value: 310 },
      { month: 'MAY', value: 305 },
      { month: 'JUN', value: 315 },
    ],
    recentSessions: [
      {
        id: 's1',
        relativeDate: 'Yesterday',
        workoutName: 'LEG DAY ALPHA',
        oneRepMax: 315,
        sets: [
          { setNumber: 1, weight: 225, reps: 8, oneRepMax: 284 },
          { setNumber: 2, weight: 275, reps: 5, oneRepMax: 310 },
          { setNumber: 3, weight: 295, reps: 3, oneRepMax: 315 },
        ],
      },
      {
        id: 's2',
        relativeDate: 'Oct 24, 2023',
        workoutName: 'POWER LEGS',
        oneRepMax: 305,
        sets: [
          { setNumber: 1, weight: 225, reps: 8, oneRepMax: 284 },
          { setNumber: 2, weight: 275, reps: 4, oneRepMax: 301 },
          { setNumber: 3, weight: 285, reps: 3, oneRepMax: 305 },
        ],
      },
      {
        id: 's3',
        relativeDate: 'Oct 18, 2023',
        workoutName: 'HYPERTROPHY LEGS',
        oneRepMax: 298,
        sets: [
          { setNumber: 1, weight: 205, reps: 10, oneRepMax: 273 },
          { setNumber: 2, weight: 245, reps: 6, oneRepMax: 288 },
          { setNumber: 3, weight: 275, reps: 4, oneRepMax: 298 },
        ],
      },
    ],
  },
  'bench-press': {
    exerciseName: 'Barbell Bench Press',
    tags: ['CHEST', 'BARBELL'],
    estimated1RM: 275,
    changeLbs: 10,
    allTimePR: {
      weight: 275,
      date: 'Sep 28, 2023',
    },
    totalVolume: '98k',
    percentileRank: 'Top 15%',
    totalSessions: 38,
    frequencyBars: [3, 4, 4, 5, 5],
    historyPoints: [
      { month: 'JAN', value: 245 },
      { month: 'FEB', value: 250 },
      { month: 'MAR', value: 255 },
      { month: 'APR', value: 265 },
      { month: 'MAY', value: 270 },
      { month: 'JUN', value: 275 },
    ],
    recentSessions: [
      {
        id: 'b1',
        relativeDate: '3 days ago',
        workoutName: 'CHEST & TRICEPS FORGE',
        oneRepMax: 275,
        sets: [
          { setNumber: 1, weight: 185, reps: 10, oneRepMax: 247 },
          { setNumber: 2, weight: 225, reps: 6, oneRepMax: 264 },
          { setNumber: 3, weight: 245, reps: 4, oneRepMax: 275 },
        ],
      },
    ],
  },
  'deadlift': {
    exerciseName: 'Barbell Deadlift',
    tags: ['BACK', 'BARBELL'],
    estimated1RM: 495,
    changeLbs: 25,
    allTimePR: {
      weight: 495,
      date: 'Nov 05, 2023',
    },
    totalVolume: '156k',
    percentileRank: 'Top 5%',
    totalSessions: 34,
    frequencyBars: [2, 3, 3, 4, 5],
    historyPoints: [
      { month: 'JAN', value: 425 },
      { month: 'FEB', value: 440 },
      { month: 'MAR', value: 455 },
      { month: 'APR', value: 475 },
      { month: 'MAY', value: 485 },
      { month: 'JUN', value: 495 },
    ],
    recentSessions: [
      {
        id: 'd1',
        relativeDate: '5 days ago',
        workoutName: 'HEAVY PULL PROTOCOL',
        oneRepMax: 495,
        sets: [
          { setNumber: 1, weight: 365, reps: 6, oneRepMax: 429 },
          { setNumber: 2, weight: 425, reps: 3, oneRepMax: 460 },
          { setNumber: 3, weight: 465, reps: 2, oneRepMax: 495 },
        ],
      },
    ],
  },
};

export const INITIAL_PROFILE: UserProfile = {
  name: 'Alex Rivera',
  badge: 'ELITE ATHLETE',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCg8YVWqh6I2ygVPe1IZMtiU_Ed28NTvJ7HraE1xN36hGT-UPQFnb0tQEqrQMmUhDQmmxtDUuzc0daIK-10b3SkBlQMKCl2euj71qxJV8T73L0UrsO-i9j0enI_occylNQiWetgYVLwnsv11EU5qc2AdBfL9qOo7-I5yRNDIxNvuFCCh8v4A5R_6OqDWzO9nae2PrO50LpgnnfWh6H8NVRZdHCtawC3HWvPUDXbtV6qNE_tP7w0d-Rb',
  weightLbs: 185,
  height: `6'2"`,
  bodyFatPercent: 11.5,
  personalRecords: [
    {
      id: 'pr-1',
      name: 'Squat',
      weight: 405,
      date: 'Oct 12, 2023',
      icon: 'fitness_center',
    },
    {
      id: 'pr-2',
      name: 'Bench Press',
      weight: 275,
      date: 'Sep 28, 2023',
      icon: 'airline_seat_flat',
    },
    {
      id: 'pr-3',
      name: 'Deadlift',
      weight: 495,
      date: 'Nov 05, 2023',
      icon: 'sports_gymnastics',
    },
  ],
  preferences: {
    accountSecurity: 'Protected (2FA Active)',
    notifications: true,
    units: 'LBS / IN',
    integrations: 'Apple Health',
  },
};
