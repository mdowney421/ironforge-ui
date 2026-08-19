import React, { useState, useEffect } from "react";
import {
  ScreenType,
  WorkoutTemplate,
  ActiveWorkout,
  UserProfile,
  HistorySession,
} from "./types";
import { INITIAL_TEMPLATES, INITIAL_PROFILE } from "./data/mockData";
import { TopAppBar, BottomNavBar } from "./components/Navigation";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { DashboardScreen } from "./components/DashboardScreen";
import { ActiveWorkoutScreen } from "./components/ActiveWorkoutScreen";
import { TemplateBuilderScreen } from "./components/TemplateBuilderScreen";
import { HistoryAnalyticsScreen } from "./components/HistoryAnalyticsScreen";
import { ProfileScreen } from "./components/ProfileScreen";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("dashboard");
  const [templates, setTemplates] = useState<WorkoutTemplate[]>(() => {
    const saved = localStorage.getItem("ironforge_templates");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_TEMPLATES;
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("ironforge_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PROFILE;
  });

  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkout | null>(
    () => {
      const saved = localStorage.getItem("ironforge_active_workout");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
      return null;
    },
  );

  const [weeklyVolume, setWeeklyVolume] = useState<number>(() => {
    const saved = localStorage.getItem("ironforge_volume");
    return saved ? parseInt(saved, 10) : 24500;
  });

  const [workoutsCompleted, setWorkoutsCompleted] = useState<number>(() => {
    const saved = localStorage.getItem("ironforge_workouts_count");
    return saved ? parseInt(saved, 10) : 4;
  });

  // Persist templates
  useEffect(() => {
    localStorage.setItem("ironforge_templates", JSON.stringify(templates));
  }, [templates]);

  // Persist profile
  useEffect(() => {
    localStorage.setItem("ironforge_profile", JSON.stringify(profile));
  }, [profile]);

  // Persist active workout
  useEffect(() => {
    if (activeWorkout) {
      localStorage.setItem(
        "ironforge_active_workout",
        JSON.stringify(activeWorkout),
      );
    } else {
      localStorage.removeItem("ironforge_active_workout");
    }
  }, [activeWorkout]);

  // Start a workout from a template
  const handleStartWorkout = (template: WorkoutTemplate) => {
    const newActiveWorkout: ActiveWorkout = {
      id: `session-${Date.now()}`,
      templateId: template.id,
      templateName: template.name,
      startTime: Date.now() - 5560 * 1000, // Pre-seed ~92 mins to match screenshot aesthetic if desired
      currentExerciseIndex: 1, // Start on Back Squat (Ex 2/5) as in screenshot demo or 0
      exercises: template.exercises.map((ex, idx) => ({
        id: `active-${ex.id}-${idx}`,
        name: ex.name,
        tags: [ex.targetMuscle.toUpperCase(), ex.category.toUpperCase()],
        sets: (
          ex.sets || [
            { setNumber: 1, targetWeight: 135, targetReps: 10 },
            { setNumber: 2, targetWeight: 185, targetReps: 8 },
            { setNumber: 3, targetWeight: 225, targetReps: 5 },
          ]
        ).map((s, sIdx) => ({
          id: `set-${sIdx + 1}`,
          setNumber: s.setNumber || sIdx + 1,
          weight: s.targetWeight || 135,
          reps: s.targetReps || 10,
          isCompleted: sIdx < 2 && idx === 1, // Set 1 and 2 completed if on Back Squat
        })),
      })),
    };

    setActiveWorkout(newActiveWorkout);
    setCurrentScreen("active_workout");
  };

  // Finish active workout
  const handleFinishWorkout = (workout: ActiveWorkout) => {
    // Calculate total session volume
    let sessionVolume = 0;
    workout.exercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        if (s.isCompleted) {
          sessionVolume += (s.weight || 0) * (s.reps || 0);
        }
      });
    });

    if (sessionVolume === 0) sessionVolume = 4850;

    const newVolume = weeklyVolume + sessionVolume;
    const newCount = workoutsCompleted + 1;

    setWeeklyVolume(newVolume);
    setWorkoutsCompleted(newCount);
    localStorage.setItem("ironforge_volume", newVolume.toString());
    localStorage.setItem("ironforge_workouts_count", newCount.toString());

    setActiveWorkout(null);
    setCurrentScreen("history");
  };

  const handleCancelWorkout = () => {
    setActiveWorkout(null);
    setCurrentScreen("dashboard");
  };

  const handleSaveNewTemplate = (newTemplate: WorkoutTemplate) => {
    setTemplates((prev) => [newTemplate, ...prev]);
    setCurrentScreen("dashboard");
  };

  return (
    <div className="min-h-screen bg-black text-[#e5e2e1] flex flex-col antialiased">
      {/* Top App Bar (Suppressed in Welcome & Active Workout) */}
      {currentScreen !== "welcome" && currentScreen !== "active_workout" && (
        <TopAppBar onNavigate={(screen) => setCurrentScreen(screen)} />
      )}

      {/* Screen Routing */}
      <div className="flex-1 flex flex-col">
        {currentScreen === "welcome" && (
          <WelcomeScreen onEngage={() => setCurrentScreen("dashboard")} />
        )}

        {currentScreen === "dashboard" && (
          <DashboardScreen
            templates={templates}
            onStartWorkout={handleStartWorkout}
            onNavigate={(screen) => setCurrentScreen(screen)}
            userWeeklyVolume={weeklyVolume}
            userWorkoutsCompleted={workoutsCompleted}
          />
        )}

        {currentScreen === "active_workout" && activeWorkout && (
          <ActiveWorkoutScreen
            workout={activeWorkout}
            onUpdateWorkout={(updated) => setActiveWorkout(updated)}
            onFinishWorkout={handleFinishWorkout}
            onCancelWorkout={handleCancelWorkout}
            onNavigate={(screen) => setCurrentScreen(screen)}
          />
        )}

        {currentScreen === "create_workout" && (
          <TemplateBuilderScreen
            onSaveTemplate={handleSaveNewTemplate}
            onCancel={() => setCurrentScreen("dashboard")}
            onNavigate={(screen) => setCurrentScreen(screen)}
          />
        )}

        {currentScreen === "history" && (
          <HistoryAnalyticsScreen
            onNavigate={(screen) => setCurrentScreen(screen)}
          />
        )}

        {currentScreen === "profile" && (
          <ProfileScreen
            profile={profile}
            onUpdateProfile={(p) => setProfile(p)}
            onLogout={() => setCurrentScreen("welcome")}
            onNavigate={(screen) => setCurrentScreen(screen)}
          />
        )}
      </div>

      {/* Persistent Bottom Nav Bar (Mobile) */}
      <BottomNavBar
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
      />
    </div>
  );
}
