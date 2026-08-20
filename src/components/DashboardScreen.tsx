import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { WorkoutTemplate, ScreenType } from "../types";

interface DashboardScreenProps {
  templates: WorkoutTemplate[];
  onStartWorkout: (template: WorkoutTemplate) => void;
  onEditTemplate: (template: WorkoutTemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
  onNavigate: (screen: ScreenType) => void;
  userWeeklyVolume?: number;
  userWorkoutsCompleted?: number;
  userWorkoutGoal?: number;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  templates,
  onStartWorkout,
  onEditTemplate,
  onDeleteTemplate,
  onNavigate,
  userWeeklyVolume = 24500,
  userWorkoutsCompleted = 4,
  userWorkoutGoal = 5,
}) => {
  const [selectedTemplateForModal, setSelectedTemplateForModal] =
    useState<WorkoutTemplate | null>(null);
  const [openTemplateMenuId, setOpenTemplateMenuId] = useState<string | null>(
    null,
  );

  const getBorderColorClass = (accent: "cyan" | "lime" | "coral") => {
    switch (accent) {
      case "cyan":
        return "border-l-[#00eefc]";
      case "lime":
        return "border-l-[#abd600]";
      case "coral":
        return "border-l-[#ffb4ab]";
      default:
        return "border-l-[#c3f400]";
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-5 pt-6 md:pt-10 pb-28 md:pb-12 flex flex-col gap-8">
      {/* Header / Welcome */}
      <section className="flex flex-col gap-2">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-headline text-3xl md:text-4xl lg:text-5xl text-white font-extrabold tracking-tight"
        >
          Welcome back, Athlete
        </motion.h1>
        <p className="text-[#c4c9ac] text-base md:text-lg">
          Ready to crush your goals today?
        </p>
      </section>

      {/* Key Stats Bento */}
      <section className="grid grid-cols-2 gap-3 md:gap-5">
        {/* Weekly Volume */}
        <div className="bg-[#131313] rounded-xl border border-[#444933] p-4 md:p-5 flex flex-col gap-2 relative overflow-hidden group hover:border-[#8e9379] transition-colors">
          <div className="flex items-center gap-2 text-[#c4c9ac]">
            <span className="material-symbols-outlined text-[18px]">
              bar_chart
            </span>
            <span className="font-mono text-xs tracking-wider uppercase font-semibold">
              Weekly Volume
            </span>
          </div>
          <div className="font-mono text-2xl md:text-3xl font-bold text-white tracking-tight">
            {userWeeklyVolume.toLocaleString()}{" "}
            <span className="text-[#c4c9ac] text-sm font-normal font-sans">
              lbs
            </span>
          </div>
          <div className="text-[#abd600] font-mono text-xs font-semibold mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">
              arrow_upward
            </span>{" "}
            12% vs last week
          </div>
        </div>

        {/* Workouts */}
        <div className="bg-[#131313] rounded-xl border border-[#444933] p-4 md:p-5 flex flex-col gap-2 relative overflow-hidden group hover:border-[#8e9379] transition-colors">
          <div className="flex items-center gap-2 text-[#c4c9ac]">
            <span className="material-symbols-outlined text-[18px]">
              fitness_center
            </span>
            <span className="font-mono text-xs tracking-wider uppercase font-semibold">
              Workouts
            </span>
          </div>
          <div className="font-mono text-2xl md:text-3xl font-bold text-white tracking-tight">
            {userWorkoutsCompleted}{" "}
            <span className="text-[#c4c9ac] text-sm font-normal font-sans">
              / {userWorkoutGoal} days
            </span>
          </div>
          {/* Mini Progress Bar */}
          <div className="w-full h-2 bg-[#2a2a2a] rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00eefc] to-[#c3f400] transition-all duration-500 rounded-full"
              style={{
                width: `${Math.min(100, (userWorkoutsCompleted / userWorkoutGoal) * 100)}%`,
              }}
            />
          </div>
        </div>
      </section>

      {/* My Workouts Section */}
      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <h2 className="font-headline text-2xl md:text-3xl font-bold text-white tracking-tight">
            My Workouts
          </h2>
          <button
            onClick={() => onNavigate("create_workout")}
            className="text-[#c3f400] hover:text-white font-mono text-xs uppercase tracking-wider flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>{" "}
            NEW
          </button>
        </div>

        <div className="flex flex-col gap-3.5">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => setSelectedTemplateForModal(template)}
              className={`relative bg-[#131313] rounded-xl border border-[#444933] p-4 md:p-5 flex flex-col gap-3 border-l-4 ${getBorderColorClass(
                template.accentColor,
              )} hover:border-[#c3f400] transition-all duration-200 cursor-pointer active:scale-[0.99] group shadow-sm`}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-headline text-xl md:text-2xl font-bold text-white leading-tight group-hover:text-[#c3f400] transition-colors">
                  {template.name}
                </h3>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenTemplateMenuId((current) =>
                        current === template.id ? null : template.id,
                      );
                    }}
                    className="text-[#c4c9ac] hover:text-white p-1"
                    aria-label="More options"
                  >
                    <span className="material-symbols-outlined text-[22px]">
                      more_vert
                    </span>
                  </button>

                  {openTemplateMenuId === template.id && (
                    <div className="absolute right-0 top-full mt-2 z-20 w-40 rounded-lg border border-[#444933] bg-[#1b1b1b] shadow-2xl overflow-hidden">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditTemplate(template);
                          setOpenTemplateMenuId(null);
                        }}
                        className="w-full px-3 py-2.5 text-left text-sm text-[#e5e2e1] hover:bg-[#2a2a2a] transition-colors font-medium"
                      >
                        Edit template
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteTemplate(template.id);
                          setOpenTemplateMenuId(null);
                        }}
                        className="w-full px-3 py-2.5 text-left text-sm text-[#ffb4ab] hover:bg-[#2a2a2a] transition-colors font-medium"
                      >
                        Delete template
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded border border-[#444933] text-[#c4c9ac] font-mono text-xs uppercase font-semibold bg-[#1c1b1b]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Meta stats */}
              <div className="flex items-center gap-5 mt-1 text-[#c4c9ac] font-mono text-xs uppercase">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#8e9379]">
                    schedule
                  </span>
                  {template.durationMinutes}m
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#8e9379]">
                    format_list_numbered
                  </span>
                  {template.exercises.length || template.exercisesCount}{" "}
                  Exercises
                </div>
              </div>
            </div>
          ))}

          {/* Create New Card */}
          <button
            onClick={() => onNavigate("create_workout")}
            className="bg-[#201f1f] border border-dashed border-[#444933] rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-white hover:bg-[#393939]/50 transition-all active:scale-[0.98] cursor-pointer mt-1"
          >
            <span className="material-symbols-outlined text-white text-[34px]">
              add_circle
            </span>
            <span className="font-headline text-xl font-bold text-white">
              Create New Template
            </span>
            <span className="text-[#c4c9ac] font-mono text-xs tracking-wider uppercase">
              BUILD FROM SCRATCH
            </span>
          </button>
        </div>
      </section>

      {/* Start Workout Modal */}
      <AnimatePresence>
        {selectedTemplateForModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
              onClick={() => setSelectedTemplateForModal(null)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-[#2a2a2a] border border-[#444933] rounded-xl w-full max-w-md p-6 flex flex-col gap-6 shadow-2xl z-10"
            >
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs uppercase px-2 py-0.5 rounded bg-[#1c1b1b] border border-[#444933] text-[#c3f400]">
                    TRAINING PROTOCOL
                  </span>
                  <button
                    onClick={() => setSelectedTemplateForModal(null)}
                    className="text-[#c4c9ac] hover:text-white"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                <h2 className="font-headline text-2xl md:text-3xl text-white font-bold tracking-tight">
                  Start {selectedTemplateForModal.name}?
                </h2>
                <p className="text-[#c4c9ac] font-mono text-xs">
                  {selectedTemplateForModal.durationMinutes}m •{" "}
                  {selectedTemplateForModal.exercises.length ||
                    selectedTemplateForModal.exercisesCount}{" "}
                  Exercises
                </p>

                <div className="mt-2 bg-[#131313] p-3 rounded-lg border border-[#444933]/60 max-h-40 overflow-y-auto">
                  <div className="text-xs font-mono text-[#8e9379] uppercase mb-2">
                    Exercise Sequence
                  </div>
                  <ul className="text-sm space-y-1.5 text-[#e5e2e1]">
                    {selectedTemplateForModal.exercises.map((ex, i) => (
                      <li
                        key={ex.id}
                        className="flex justify-between items-center text-xs"
                      >
                        <span>
                          {i + 1}. {ex.name}
                        </span>
                        <span className="text-[#c4c9ac] font-mono">
                          {ex.sets.length} sets
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    const t = selectedTemplateForModal;
                    setSelectedTemplateForModal(null);
                    onStartWorkout(t);
                  }}
                  className="w-full bg-[#c3f400] text-[#161e00] font-headline font-bold py-4 rounded-xl hover:bg-[#abd600] active:scale-[0.98] transition-all text-xl uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(195,244,0,0.3)] cursor-pointer"
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    play_arrow
                  </span>
                  START WORKOUT
                </button>
                <button
                  onClick={() => setSelectedTemplateForModal(null)}
                  className="w-full py-3 text-[#c4c9ac] font-mono text-xs uppercase tracking-wider hover:text-white transition-colors cursor-pointer"
                >
                  CANCEL
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
