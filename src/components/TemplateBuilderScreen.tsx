import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WorkoutTemplate, TemplateExercise, SetEntry, ScreenType } from '../types';
import { EXERCISE_LIBRARY } from '../data/mockData';

interface TemplateBuilderScreenProps {
  onSaveTemplate: (template: WorkoutTemplate) => void;
  onCancel: () => void;
  onNavigate: (screen: ScreenType) => void;
}

export const TemplateBuilderScreen: React.FC<TemplateBuilderScreenProps> = ({
  onSaveTemplate,
  onCancel,
}) => {
  const [templateName, setTemplateName] = useState('Heavy Legs Day');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'CHEST' | 'BACK' | 'LEGS' | 'CORE' | 'SHOULDERS'>('ALL');
  const [collapsedExercises, setCollapsedExercises] = useState<Record<string, boolean>>({
    'builder-ex-2': true,
  });
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);

  // Initial template exercises
  const [exercises, setExercises] = useState<TemplateExercise[]>([
    {
      id: 'builder-ex-1',
      name: 'Barbell Squat',
      targetMuscle: 'Legs',
      category: 'Compound',
      sets: [
        { setNumber: 1, targetWeight: 135, targetReps: 12 },
        { setNumber: 2, targetWeight: 225, targetReps: 8 },
      ],
    },
    {
      id: 'builder-ex-2',
      name: 'Romanian Deadlift',
      targetMuscle: 'Legs',
      category: 'Hamstrings',
      sets: [
        { setNumber: 1, targetWeight: 185, targetReps: 10 },
        { setNumber: 2, targetWeight: 225, targetReps: 8 },
      ],
    },
  ]);

  const toggleCollapse = (id: string) => {
    setCollapsedExercises((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleUpdateSet = (exerciseId: string, setIndex: number, field: 'targetWeight' | 'targetReps', val: number) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id === exerciseId) {
          const updatedSets = [...ex.sets];
          updatedSets[setIndex] = {
            ...updatedSets[setIndex],
            [field]: isNaN(val) ? 0 : val,
          };
          return { ...ex, sets: updatedSets };
        }
        return ex;
      })
    );
  };

  const handleAddSetToExercise = (exerciseId: string) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id === exerciseId) {
          const lastSet = ex.sets[ex.sets.length - 1];
          const newSet: SetEntry = {
            setNumber: ex.sets.length + 1,
            targetWeight: lastSet ? lastSet.targetWeight : 135,
            targetReps: lastSet ? lastSet.targetReps : 10,
          };
          return { ...ex, sets: [...ex.sets, newSet] };
        }
        return ex;
      })
    );
  };

  const handleRemoveExercise = (exerciseId: string) => {
    setExercises((prev) => prev.filter((e) => e.id !== exerciseId));
  };

  const handleSelectFromLibrary = (libItem: typeof EXERCISE_LIBRARY[0]) => {
    const newEx: TemplateExercise = {
      id: `builder-ex-${Date.now()}`,
      name: libItem.name,
      targetMuscle: libItem.muscle,
      category: libItem.category,
      sets: [
        { setNumber: 1, targetWeight: 135, targetReps: 10 },
        { setNumber: 2, targetWeight: 185, targetReps: 8 },
      ],
    };
    setExercises((prev) => [...prev, newEx]);
    setShowAddExerciseModal(false);
  };

  const handleSave = () => {
    if (!templateName.trim()) {
      alert('Please enter a template name');
      return;
    }
    if (exercises.length === 0) {
      alert('Please add at least one exercise');
      return;
    }

    const uniqueTags: string[] = Array.from(new Set(exercises.map((e) => e.targetMuscle.toUpperCase())));

    const newTemplate: WorkoutTemplate = {
      id: `template-${Date.now()}`,
      name: templateName.trim(),
      tags: uniqueTags.length > 0 ? uniqueTags : ['LEGS', 'COMPOUND'],
      durationMinutes: exercises.length * 12 + 10,
      exercisesCount: exercises.length,
      accentColor: 'cyan',
      exercises,
    };

    onSaveTemplate(newTemplate);
  };

  // Filter library items for modal or quick lookup
  const filteredLibrary = EXERCISE_LIBRARY.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.muscle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || item.muscle.toUpperCase() === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="antialiased min-h-screen flex flex-col bg-[#131313] text-[#e5e2e1]">
      <main className="flex-grow flex flex-col pb-28 md:pb-12 max-w-4xl mx-auto w-full">
        {/* Template Header Builder Area */}
        <section className="px-5 py-6 bg-[#1c1b1b] border-b border-[#353534] flex-shrink-0">
          <div className="flex justify-between items-end gap-4">
            <div className="flex-grow">
              <label
                htmlFor="templateName"
                className="block font-mono text-xs text-[#c4c9ac] mb-1.5 uppercase font-semibold tracking-wider"
              >
                Template Name
              </label>
              <input
                id="templateName"
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="e.g. Heavy Legs Day"
                className="w-full bg-[#201f1f] font-headline font-bold text-2xl md:text-3xl text-white border-b-2 border-transparent focus:border-[#c3f400] focus:ring-0 focus:outline-none placeholder-[#8e9379] px-3 py-2 rounded transition-colors"
              />
            </div>

            <div className="flex gap-2 flex-shrink-0 mb-1">
              <button
                onClick={onCancel}
                aria-label="Cancel"
                className="w-12 h-12 flex items-center justify-center rounded-full bg-[#353534] text-[#c4c9ac] hover:text-white active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
              <button
                onClick={handleSave}
                aria-label="Save Template"
                className="w-12 h-12 flex items-center justify-center rounded-full bg-[#c3f400] text-[#161e00] active:scale-95 transition-all shadow-[0_0_12px_rgba(195,244,0,0.3)] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Exercise Search & Filter Area */}
        <section className="px-5 py-4 flex-shrink-0 bg-[#131313] z-10 sticky top-16 border-b border-[#353534]/50">
          <div className="relative mb-3">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#c4c9ac]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find exercise..."
              className="w-full bg-[#2a2a2a] rounded-xl py-3 pl-11 pr-4 font-body-md text-sm md:text-base text-white border border-[#353534] focus:border-[#c3f400] focus:ring-1 focus:ring-[#c3f400] transition-all placeholder-[#8e9379]"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {(['ALL', 'CHEST', 'BACK', 'LEGS', 'CORE', 'SHOULDERS'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono font-semibold uppercase whitespace-nowrap active:scale-95 transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'border border-[#c3f400] bg-[#c3f400] text-[#161e00]'
                    : 'border border-[#444933] bg-transparent text-[#c4c9ac] hover:border-[#c3f400] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Workout Routine Canvas */}
        <section className="flex-grow px-5 py-4 flex flex-col gap-3.5">
          {exercises.map((ex) => {
            const isCollapsed = !!collapsedExercises[ex.id];

            return (
              <div
                key={ex.id}
                className="bg-[#131313] rounded-xl border-l-4 border-l-[#7df4ff] border border-[#353534] flex flex-col overflow-hidden shadow-sm transition-all"
              >
                {/* Card Header (Collapsible trigger) */}
                <div
                  onClick={() => toggleCollapse(ex.id)}
                  className="flex justify-between items-center p-4 cursor-pointer bg-[#0e0e0e] hover:bg-[#1c1b1b] transition-colors select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#2a2a2a] flex items-center justify-center text-[#c4c9ac]">
                      <span className="material-symbols-outlined text-[20px]">fitness_center</span>
                    </div>
                    <div>
                      <h3 className="font-headline font-bold text-xl md:text-2xl text-white tracking-tight leading-tight">
                        {ex.name}
                      </h3>
                      <span className="text-xs font-mono text-[#c4c9ac] uppercase font-semibold">
                        {ex.targetMuscle} • {ex.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveExercise(ex.id);
                      }}
                      className="text-[#8e9379] hover:text-[#ffb4ab] p-1.5 rounded-full"
                      aria-label="Remove exercise"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                    <button className="text-[#c4c9ac] p-1" aria-label="Expand/Collapse">
                      <span className="material-symbols-outlined text-[22px]">
                        {isCollapsed ? 'expand_more' : 'expand_less'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Card Content (Sets) */}
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="p-4 pt-2 flex flex-col gap-2 bg-[#131313]"
                    >
                      {/* Column Headers */}
                      <div className="grid grid-cols-12 gap-2 px-2 mb-1">
                        <div className="col-span-2 text-center font-mono text-xs text-[#c4c9ac] uppercase font-semibold">
                          Set
                        </div>
                        <div className="col-span-5 text-center font-mono text-xs text-[#c4c9ac] uppercase font-semibold">
                          Target Wgt
                        </div>
                        <div className="col-span-5 text-center font-mono text-xs text-[#c4c9ac] uppercase font-semibold">
                          Target Reps
                        </div>
                      </div>

                      {/* Set Rows */}
                      {ex.sets.map((set, setIdx) => (
                        <div
                          key={setIdx}
                          className="grid grid-cols-12 gap-2 items-center bg-[#1c1b1b] rounded-lg p-2 border border-[#353534] focus-within:border-[#c3f400] transition-colors"
                        >
                          <div className="col-span-2 text-center font-mono text-base font-bold text-[#c4c9ac]">
                            {set.setNumber}
                          </div>
                          <div className="col-span-5 relative">
                            <input
                              type="number"
                              value={set.targetWeight || ''}
                              onChange={(e) =>
                                handleUpdateSet(ex.id, setIdx, 'targetWeight', parseInt(e.target.value) || 0)
                              }
                              className="w-full bg-[#201f1f] text-center font-mono text-base font-bold text-white rounded py-2 border border-[#353534] focus:border-[#c3f400] focus:ring-0 focus:outline-none pr-8"
                              placeholder="0"
                            />
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-[10px] text-[#c4c9ac] pointer-events-none">
                              lbs
                            </span>
                          </div>
                          <div className="col-span-5">
                            <input
                              type="number"
                              value={set.targetReps || ''}
                              onChange={(e) =>
                                handleUpdateSet(ex.id, setIdx, 'targetReps', parseInt(e.target.value) || 0)
                              }
                              className="w-full bg-[#201f1f] text-center font-mono text-base font-bold text-white rounded py-2 border border-[#353534] focus:border-[#c3f400] focus:ring-0 focus:outline-none"
                              placeholder="0"
                            />
                          </div>
                        </div>
                      ))}

                      {/* Add Set Button */}
                      <button
                        onClick={() => handleAddSetToExercise(ex.id)}
                        className="mt-2 w-full py-3 rounded-lg border border-dashed border-[#444933] text-[#c4c9ac] font-mono text-xs uppercase font-semibold flex items-center justify-center gap-2 hover:border-[#c3f400] hover:text-[#c3f400] active:bg-[#201f1f] transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">add</span> Add Set
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* Add Exercise Global Button */}
          <button
            onClick={() => setShowAddExerciseModal(true)}
            className="w-full py-4 mt-2 rounded-xl bg-[#201f1f] border border-[#353534] text-[#c3f400] font-headline text-lg font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[0_0_15px_rgba(195,244,0,0.1)] hover:border-[#c3f400] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">add_circle</span> Add Another Exercise
          </button>
        </section>
      </main>

      {/* Exercise Library Picker Modal */}
      <AnimatePresence>
        {showAddExerciseModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowAddExerciseModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-[#201f1f] border border-[#444933] rounded-xl w-full max-w-lg p-6 shadow-2xl z-10 max-h-[85vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-headline text-2xl text-white uppercase font-bold tracking-tight">
                  Exercise Library
                </h2>
                <button
                  onClick={() => setShowAddExerciseModal(false)}
                  className="text-[#c4c9ac] hover:text-white"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="overflow-y-auto space-y-2 flex-1 pr-1">
                {filteredLibrary.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectFromLibrary(item)}
                    className="w-full text-left p-3.5 rounded-lg bg-[#1c1b1b] border border-[#444933] text-white hover:border-[#c3f400] hover:text-[#c3f400] flex justify-between items-center transition-all group cursor-pointer"
                  >
                    <div>
                      <div className="font-headline font-bold text-base text-white group-hover:text-[#c3f400]">
                        {item.name}
                      </div>
                      <div className="font-mono text-xs text-[#c4c9ac]">
                        {item.muscle} • {item.category}
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#c3f400] text-[20px]">
                      add_circle
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
