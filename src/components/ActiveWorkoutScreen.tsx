import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ActiveWorkout, ActiveExercise, ActiveSet, ScreenType } from '../types';

interface ActiveWorkoutScreenProps {
  workout: ActiveWorkout;
  onUpdateWorkout: (workout: ActiveWorkout) => void;
  onFinishWorkout: (workout: ActiveWorkout) => void;
  onCancelWorkout: () => void;
  onNavigate: (screen: ScreenType) => void;
}

export const ActiveWorkoutScreen: React.FC<ActiveWorkoutScreenProps> = ({
  workout,
  onUpdateWorkout,
  onFinishWorkout,
  onCancelWorkout,
}) => {
  // Live workout timer in seconds
  const [secondsElapsed, setSecondsElapsed] = useState(() => {
    return Math.floor((Date.now() - workout.startTime) / 1000) || 5561; // default ~92m 41s if fresh
  });

  // Rest Timer State
  const [restTimerSeconds, setRestTimerSeconds] = useState<number | null>(null);
  const [showRestModal, setShowRestModal] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showFinishConfirmModal, setShowFinishConfirmModal] = useState(false);

  // Active exercise pointer
  const currentExIndex = workout.currentExerciseIndex;
  const currentExercise: ActiveExercise | undefined = workout.exercises[currentExIndex];

  // Timer Tick
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Rest countdown tick
  useEffect(() => {
    if (restTimerSeconds === null || restTimerSeconds <= 0) return;
    const interval = setInterval(() => {
      setRestTimerSeconds((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [restTimerSeconds]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleSetComplete = (setId: string) => {
    if (!currentExercise) return;
    const updatedSets = currentExercise.sets.map((s) => {
      if (s.id === setId) {
        const nextState = !s.isCompleted;
        if (nextState) {
          // Trigger automatic 60s rest recommendation
          setRestTimerSeconds(60);
        }
        return { ...s, isCompleted: nextState };
      }
      return s;
    });

    const updatedExercises = [...workout.exercises];
    updatedExercises[currentExIndex] = {
      ...currentExercise,
      sets: updatedSets,
    };

    onUpdateWorkout({
      ...workout,
      exercises: updatedExercises,
    });
  };

  const handleUpdateSetValues = (setId: string, field: 'weight' | 'reps', val: number) => {
    if (!currentExercise) return;
    const updatedSets = currentExercise.sets.map((s) => {
      if (s.id === setId) {
        return { ...s, [field]: isNaN(val) ? 0 : val };
      }
      return s;
    });

    const updatedExercises = [...workout.exercises];
    updatedExercises[currentExIndex] = {
      ...currentExercise,
      sets: updatedSets,
    };

    onUpdateWorkout({
      ...workout,
      exercises: updatedExercises,
    });
  };

  const handleAddSet = () => {
    if (!currentExercise) return;
    const lastSet = currentExercise.sets[currentExercise.sets.length - 1];
    const newSet: ActiveSet = {
      id: `set-${Date.now()}`,
      setNumber: currentExercise.sets.length + 1,
      weight: lastSet ? lastSet.weight : 135,
      reps: lastSet ? lastSet.reps : 10,
      isCompleted: false,
    };

    const updatedExercises = [...workout.exercises];
    updatedExercises[currentExIndex] = {
      ...currentExercise,
      sets: [...currentExercise.sets, newSet],
    };

    onUpdateWorkout({
      ...workout,
      exercises: updatedExercises,
    });
  };

  const handleNextExercise = () => {
    if (currentExIndex < workout.exercises.length - 1) {
      onUpdateWorkout({
        ...workout,
        currentExerciseIndex: currentExIndex + 1,
      });
    } else {
      setShowFinishConfirmModal(true);
    }
  };

  const handlePrevExercise = () => {
    if (currentExIndex > 0) {
      onUpdateWorkout({
        ...workout,
        currentExerciseIndex: currentExIndex - 1,
      });
    }
  };

  const handleSkipExercise = () => {
    const updatedExercises = workout.exercises.filter((_, idx) => idx !== currentExIndex);
    setShowSkipModal(false);
    if (updatedExercises.length === 0) {
      onCancelWorkout();
      return;
    }
    const newIndex = Math.min(currentExIndex, updatedExercises.length - 1);
    onUpdateWorkout({
      ...workout,
      exercises: updatedExercises,
      currentExerciseIndex: newIndex,
    });
  };

  const handleSwapExercise = (newExerciseName: string) => {
    if (!currentExercise) return;
    const updatedExercises = [...workout.exercises];
    updatedExercises[currentExIndex] = {
      ...currentExercise,
      name: newExerciseName,
    };
    onUpdateWorkout({
      ...workout,
      exercises: updatedExercises,
    });
    setShowSwapModal(false);
  };

  const triggerFinish = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#c3f400', '#00eefc', '#ffffff'],
    });
    onFinishWorkout(workout);
  };

  const progressPercent = Math.round(
    ((currentExIndex + 1) / Math.max(1, workout.exercises.length)) * 100
  );

  return (
    <div className="bg-[#131313] text-[#e5e2e1] min-h-screen flex flex-col relative antialiased selection:bg-[#c3f400] selection:text-[#161e00]">
      {/* TopAppBar Sticky Header */}
      <header className="w-full top-0 sticky z-40 bg-[#131313] border-b border-[#444933] flex justify-between items-center px-5 h-16 bg-[#131313]/95 backdrop-blur-md">
        <button
          onClick={onCancelWorkout}
          className="text-[#c4c9ac] hover:text-white transition-opacity active:scale-95 p-1 -ml-2 rounded-full"
          aria-label="Minimize"
        >
          <span className="material-symbols-outlined text-[28px]">expand_more</span>
        </button>

        {/* Live Timer display */}
        <div className="flex flex-col items-center cursor-pointer" onClick={() => setShowRestModal(true)}>
          <span className="font-headline font-bold text-2xl tracking-tighter text-white timer-glow">
            {formatTimer(secondsElapsed)}
          </span>
          <span className="font-headline text-[11px] uppercase tracking-widest text-[#c4c9ac]">
            WORKOUT TIME
          </span>
        </div>

        {/* Rest Timer button indicator */}
        <button
          onClick={() => setShowRestModal(true)}
          className={`hover:opacity-80 transition-all active:scale-95 p-2 rounded-full relative ${
            restTimerSeconds && restTimerSeconds > 0 ? 'text-[#c3f400] bg-[#353534]' : 'text-white'
          }`}
          aria-label="Rest Timer"
        >
          <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            timer
          </span>
          {restTimerSeconds !== null && restTimerSeconds > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#c3f400] text-[#161e00] text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full animate-pulse">
              {restTimerSeconds}s
            </span>
          )}
        </button>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-1 overflow-y-auto px-5 py-4 pb-[220px] max-w-2xl mx-auto w-full">
        {currentExercise && (
          <>
            {/* Exercise Header & Progress */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-1">
                <h1 className="font-headline text-3xl md:text-4xl text-white uppercase font-extrabold tracking-tight">
                  {currentExercise.name}
                </h1>
                <span className="font-mono text-xs text-[#c4c9ac] bg-[#201f1f] border border-[#444933] rounded-full px-3 py-1 font-semibold">
                  Ex {currentExIndex + 1}/{workout.exercises.length}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full rounded-full bg-[#2C2C2E] overflow-hidden mt-2.5">
                <div
                  className="h-full bg-gradient-to-r from-[#00eefc] to-[#c3f400] transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Exercise Tags */}
              <div className="mt-3 flex gap-2">
                {(currentExercise.tags.length > 0 ? currentExercise.tags : ['LEGS', 'COMPOUND']).map((tag, i) => (
                  <span
                    key={i}
                    className="font-mono text-xs border border-[#8e9379] text-[#c4c9ac] rounded-full px-3 py-1 uppercase font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Sets Table */}
            <div className="bg-[#131313] rounded-xl border border-[#353534] overflow-hidden mb-6 shadow-lg">
              {/* Table Header */}
              <div className="grid grid-cols-[44px_1fr_1fr_48px] gap-3 px-4 py-3 border-b border-[#353534] bg-[#1c1b1b] text-[#c4c9ac] font-mono text-xs text-center items-center font-semibold uppercase">
                <div className="text-left pl-1">SET</div>
                <div>LBS</div>
                <div>REPS</div>
                <div>
                  <span className="material-symbols-outlined text-[18px]">check</span>
                </div>
              </div>

              {/* Set Rows */}
              <div className="divide-y divide-[#353534]">
                {currentExercise.sets.map((set, setIndex) => {
                  const isCompleted = set.isCompleted;
                  const isActiveInput = !isCompleted && currentExercise.sets.findIndex((s) => !s.isCompleted) === setIndex;

                  return (
                    <div
                      key={set.id}
                      className={`grid grid-cols-[44px_1fr_1fr_48px] gap-3 px-4 py-3 items-center relative transition-colors ${
                        isActiveInput ? 'bg-[#1c1c1e]/70' : isCompleted ? 'bg-[#131313]' : 'bg-[#181818]'
                      }`}
                    >
                      {isActiveInput && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#c3f400]" />
                      )}

                      {/* Set Number */}
                      <div
                        className={`font-mono text-base text-left pl-1 font-bold ${
                          isActiveInput ? 'text-white' : 'text-[#c4c9ac]'
                        }`}
                      >
                        {set.setNumber}
                      </div>

                      {/* LBS Weight Field */}
                      {isCompleted ? (
                        <div className="bg-[#1c1b1b] rounded-lg h-12 flex items-center justify-center border border-[#444933]">
                          <span className="font-mono text-lg font-bold text-[#c4c9ac]">
                            {set.weight}
                          </span>
                        </div>
                      ) : (
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="numeric"
                            value={set.weight || ''}
                            onChange={(e) =>
                              handleUpdateSetValues(set.id, 'weight', parseInt(e.target.value) || 0)
                            }
                            className={`w-full bg-[#1C1C1E] rounded-lg h-13 text-center font-mono text-lg font-bold text-white focus:outline-none focus:ring-1 focus:ring-[#c3f400] transition-all ${
                              isActiveInput
                                ? 'border border-[#c3f400] shadow-[0_0_10px_rgba(195,244,0,0.15)]'
                                : 'border border-[#444933]'
                            }`}
                            placeholder="0"
                          />
                        </div>
                      )}

                      {/* REPS Field */}
                      {isCompleted ? (
                        <div className="bg-[#1c1b1b] rounded-lg h-12 flex items-center justify-center border border-[#444933]">
                          <span className="font-mono text-lg font-bold text-[#c4c9ac]">
                            {set.reps}
                          </span>
                        </div>
                      ) : (
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="numeric"
                            value={set.reps || ''}
                            onChange={(e) =>
                              handleUpdateSetValues(set.id, 'reps', parseInt(e.target.value) || 0)
                            }
                            className={`w-full bg-[#1C1C1E] rounded-lg h-13 text-center font-mono text-lg font-bold text-white focus:outline-none focus:ring-1 focus:ring-[#c3f400] transition-all ${
                              isActiveInput
                                ? 'border border-[#444933] focus:border-[#c3f400]'
                                : 'border border-[#444933]'
                            }`}
                            placeholder="0"
                          />
                        </div>
                      )}

                      {/* Check Button */}
                      <button
                        onClick={() => handleToggleSetComplete(set.id)}
                        className={`h-11 w-11 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                          isCompleted
                            ? 'bg-[#c3f400] text-[#161e00] shadow-[0_0_10px_rgba(195,244,0,0.4)]'
                            : 'bg-[#201f1f] border border-[#444933] text-[#c4c9ac] hover:border-[#c3f400] hover:text-white active:scale-95'
                        }`}
                        aria-label="Toggle Complete"
                      >
                        <span
                          className="material-symbols-outlined text-[24px]"
                          style={isCompleted ? { fontVariationSettings: "'FILL' 1" } : undefined}
                        >
                          check
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Add Set Button */}
            <button
              onClick={handleAddSet}
              className="w-full flex items-center justify-center gap-2 py-3.5 border border-dashed border-[#444933] rounded-xl text-white font-mono text-xs uppercase font-bold hover:bg-[#201f1f] hover:border-[#c3f400] transition-all active:scale-[0.98] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              ADD SET
            </button>

            {/* Exercise Controls Row (SWAP / DELAY / SKIP) */}
            <div className="flex justify-around items-center mt-10 px-4">
              {/* SWAP */}
              <button
                onClick={() => setShowSwapModal(true)}
                className="flex flex-col items-center gap-2 text-[#c4c9ac] hover:text-[#c3f400] transition-all active:scale-90 group cursor-pointer"
              >
                <div className="bg-[#2a2a2a] h-14 w-14 rounded-full flex items-center justify-center border border-[#444933] group-hover:border-[#c3f400] group-hover:shadow-[0_0_10px_rgba(195,244,0,0.2)]">
                  <span className="material-symbols-outlined text-[28px]">swap_horiz</span>
                </div>
                <span className="font-mono text-[10px] tracking-widest uppercase font-semibold">SWAP</span>
              </button>

              {/* DELAY (Rest Timer trigger) */}
              <button
                onClick={() => setRestTimerSeconds(90)}
                className="flex flex-col items-center gap-2 text-[#c4c9ac] hover:text-[#c3f400] transition-all active:scale-90 group cursor-pointer"
              >
                <div className="bg-[#2a2a2a] h-14 w-14 rounded-full flex items-center justify-center border border-[#444933] group-hover:border-[#c3f400] group-hover:shadow-[0_0_10px_rgba(195,244,0,0.2)]">
                  <span className="material-symbols-outlined text-[28px]">timer</span>
                </div>
                <span className="font-mono text-[10px] tracking-widest uppercase font-semibold">DELAY</span>
              </button>

              {/* SKIP */}
              <button
                onClick={() => setShowSkipModal(true)}
                className="flex flex-col items-center gap-2 text-[#c4c9ac] hover:text-[#ffb4ab] transition-all active:scale-90 group cursor-pointer"
              >
                <div className="bg-[#2a2a2a] h-14 w-14 rounded-full flex items-center justify-center border border-[#444933] group-hover:border-[#ffb4ab] group-hover:shadow-[0_0_10px_rgba(255,180,171,0.2)]">
                  <span className="material-symbols-outlined text-[28px]">skip_next</span>
                </div>
                <span className="font-mono text-[10px] tracking-widest uppercase font-semibold">SKIP</span>
              </button>
            </div>
          </>
        )}
      </main>

      {/* Bottom Controls (Fixed) */}
      <div className="fixed bottom-0 left-0 w-full bg-[#0e0e0e] border-t border-[#444933] pb-6 pt-4 px-5 z-50">
        <div className="max-w-2xl mx-auto flex flex-col gap-3">
          <div className="flex gap-2">
            {currentExIndex > 0 && (
              <button
                onClick={handlePrevExercise}
                className="bg-[#201f1f] text-white px-4 rounded-xl flex items-center justify-center border border-[#444933] hover:bg-[#353534]"
                aria-label="Previous Exercise"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
            )}

            <button
              onClick={handleNextExercise}
              className="flex-1 bg-[#353534] text-white font-headline text-lg md:text-xl font-bold uppercase rounded-xl py-3.5 flex justify-center items-center gap-2 hover:bg-[#393939] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>{currentExIndex < workout.exercises.length - 1 ? 'NEXT EXERCISE' : 'REVIEW SUMMARY'}</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>

          <button
            onClick={() => setShowFinishConfirmModal(true)}
            className="w-full bg-[#c3f400] text-[#161e00] font-headline text-lg md:text-xl font-bold uppercase rounded-xl py-4 flex justify-center items-center gap-2 hover:bg-[#abd600] active:scale-[0.98] transition-all shadow-[0_4px_14px_0_rgba(195,244,0,0.35)] cursor-pointer"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              flag
            </span>
            FINISH WORKOUT
          </button>
        </div>
      </div>

      {/* Skip Exercise Modal */}
      <AnimatePresence>
        {showSkipModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowSkipModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-[#2a2a2a] border border-[#444933] rounded-xl w-full max-w-md p-6 shadow-2xl z-10"
            >
              <h2 className="font-headline text-2xl text-white mb-2 uppercase font-bold tracking-tight">
                Skip Exercise?
              </h2>
              <p className="font-body-md text-[#c4c9ac] mb-6">
                Would you like to remove <span className="text-white font-semibold">{currentExercise?.name}</span> from today's workout?
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleSkipExercise}
                  className="w-full bg-[#93000a] text-[#ffdad6] font-headline text-lg uppercase rounded-lg py-3.5 flex justify-center items-center gap-2 hover:bg-[#ca0a0f] active:scale-[0.98] transition-all cursor-pointer font-bold"
                >
                  <span className="material-symbols-outlined">delete</span>
                  REMOVE EXERCISE
                </button>
                <button
                  onClick={() => setShowSkipModal(false)}
                  className="w-full bg-[#353534] text-white font-headline text-lg uppercase rounded-lg py-3.5 flex justify-center items-center gap-2 hover:bg-[#201f1f] transition-all active:scale-[0.98] cursor-pointer font-semibold"
                >
                  KEEP EXERCISE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Swap Exercise Modal */}
      <AnimatePresence>
        {showSwapModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowSwapModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-[#2a2a2a] border border-[#444933] rounded-xl w-full max-w-md p-6 shadow-2xl z-10 max-h-[85vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-headline text-2xl text-white uppercase font-bold tracking-tight">
                  Swap Exercise
                </h2>
                <button onClick={() => setShowSwapModal(false)} className="text-[#c4c9ac] hover:text-white">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <p className="text-sm text-[#c4c9ac] mb-3">Choose a replacement movement:</p>

              <div className="overflow-y-auto space-y-2 flex-1 pr-1">
                {[
                  'Safety Bar Squat',
                  'Front Squat (Barbell)',
                  'Hack Squat Machine',
                  'Leg Press (Heavy)',
                  'Bulgarian Split Squats',
                  'Goblet Squat (Dumbbell)',
                  'Romanian Deadlift',
                ].map((name) => (
                  <button
                    key={name}
                    onClick={() => handleSwapExercise(name)}
                    className="w-full text-left p-3.5 rounded-lg bg-[#1c1b1b] border border-[#444933] text-white hover:border-[#c3f400] hover:text-[#c3f400] flex justify-between items-center transition-all font-semibold font-headline"
                  >
                    <span>{name}</span>
                    <span className="material-symbols-outlined text-sm">swap_horiz</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Rest Timer Modal */}
      <AnimatePresence>
        {showRestModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowRestModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-[#201f1f] border border-[#444933] rounded-xl w-full max-w-md p-6 shadow-2xl z-10 text-center"
            >
              <h2 className="font-headline text-2xl text-white uppercase font-bold tracking-tight mb-2">
                Rest Timer Protocol
              </h2>
              <div className="font-mono text-5xl font-extrabold text-[#c3f400] timer-glow my-6">
                {restTimerSeconds !== null && restTimerSeconds > 0
                  ? `${restTimerSeconds}s`
                  : 'READY'}
              </div>

              <div className="grid grid-cols-4 gap-2 mb-6">
                {[30, 60, 90, 120].map((s) => (
                  <button
                    key={s}
                    onClick={() => setRestTimerSeconds(s)}
                    className={`py-2 rounded-lg font-mono text-sm font-bold border transition-colors ${
                      restTimerSeconds === s
                        ? 'bg-[#c3f400] text-[#161e00] border-[#c3f400]'
                        : 'bg-[#2a2a2a] text-[#c4c9ac] border-[#444933] hover:text-white'
                    }`}
                  >
                    {s}s
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setRestTimerSeconds(null)}
                  className="flex-1 py-3 bg-[#353534] text-white rounded-lg font-mono text-xs uppercase hover:bg-[#393939]"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowRestModal(false)}
                  className="flex-1 py-3 bg-[#c3f400] text-[#161e00] rounded-lg font-headline font-bold text-base uppercase"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Finish Workout Confirmation Modal */}
      <AnimatePresence>
        {showFinishConfirmModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowFinishConfirmModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-[#201f1f] border border-[#444933] rounded-xl w-full max-w-md p-6 shadow-2xl z-10"
            >
              <div className="flex items-center gap-3 mb-2 text-[#c3f400]">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  military_tech
                </span>
                <h2 className="font-headline text-2xl text-white uppercase font-bold tracking-tight">
                  Complete Session?
                </h2>
              </div>
              <p className="font-body-md text-[#c4c9ac] mb-4">
                Great effort! Ready to log session duration ({formatTimer(secondsElapsed)}) and record completed sets into your training analytics?
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setShowFinishConfirmModal(false);
                    triggerFinish();
                  }}
                  className="w-full bg-[#c3f400] text-[#161e00] font-headline font-bold text-xl uppercase py-4 rounded-xl hover:bg-[#abd600] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(195,244,0,0.35)] cursor-pointer"
                >
                  <span className="material-symbols-outlined font-bold">check_circle</span>
                  CONFIRM & LOG WORKOUT
                </button>
                <button
                  onClick={() => setShowFinishConfirmModal(false)}
                  className="w-full py-3 text-[#c4c9ac] font-mono text-xs uppercase tracking-wider hover:text-white"
                >
                  CONTINUE TRAINING
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
