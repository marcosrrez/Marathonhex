import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { StatsDashboard } from "@/components/stats-dashboard";
import { WeekRow } from "@/components/week-row";
import { WorkoutModal } from "@/components/workout-modal";
import { CategoryLegend } from "@/components/category-legend";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { trainingPlan } from "@/lib/training-data";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { WorkoutCompletion, DayName } from "@shared/schema";
import { dayNames } from "@shared/schema";

function getTrainingStartDate(): Date {
  const storedDate = localStorage.getItem("marathon-training-start");
  if (storedDate) {
    return new Date(storedDate);
  }
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  const dayOfWeek = startDate.getDay();
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  startDate.setDate(startDate.getDate() - daysFromMonday);
  localStorage.setItem("marathon-training-start", startDate.toISOString());
  return startDate;
}

function getCurrentWeekAndDay(): { week: number; day: DayName; daysUntilRace: number } {
  const startDate = getTrainingStartDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffTime = today.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  const week = Math.min(16, Math.max(1, Math.floor(diffDays / 7) + 1));
  
  const dayOfWeek = today.getDay();
  const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  
  const raceDate = new Date(startDate);
  raceDate.setDate(raceDate.getDate() + 16 * 7 - 1);
  const daysUntilRace = Math.max(0, Math.ceil((raceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  
  return {
    week,
    day: dayNames[dayIndex],
    daysUntilRace,
  };
}

export default function Home() {
  const { toast } = useToast();
  const calendarRef = useRef<HTMLDivElement>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<{
    week: number;
    day: DayName;
  } | null>(null);

  const { week: currentWeek, day: currentDay, daysUntilRace } = getCurrentWeekAndDay();

  const { data: completions = {}, isLoading } = useQuery<Record<string, WorkoutCompletion>>({
    queryKey: ["/api/completions"],
  });

  const updateCompletionMutation = useMutation({
    mutationFn: async (data: WorkoutCompletion) => {
      return apiRequest("POST", "/api/completions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/completions"] });
    },
    onError: (error) => {
      toast({
        title: "Error saving workout",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleSelectWorkout = useCallback((week: number, day: DayName) => {
    setSelectedWorkout({ week, day });
  }, []);

  const handleCompleteWorkout = useCallback(
    (week: number, day: DayName) => {
      const existingData = completions[`${week}-${day}`];
      updateCompletionMutation.mutate({
        week,
        day,
        status: "complete",
        completedAt: new Date().toISOString(),
        distance: existingData?.distance,
        duration: existingData?.duration,
        pace: existingData?.pace,
        elevation: existingData?.elevation,
        heartRate: existingData?.heartRate,
        effort: existingData?.effort,
        weather: existingData?.weather,
        notes: existingData?.notes,
        date: existingData?.date || new Date().toISOString().split("T")[0],
      });

      toast({
        title: "Workout completed!",
        description: `Week ${week} ${day} marked as complete`,
      });
    },
    [completions, updateCompletionMutation, toast]
  );

  const handleSaveWorkout = useCallback(
    (data: WorkoutCompletion) => {
      updateCompletionMutation.mutate(data);
      toast({
        title: data.status === "complete" ? "Workout completed!" : "Progress saved",
        description: `Week ${data.week} ${data.day} updated`,
      });
    },
    [updateCompletionMutation, toast]
  );

  const scrollToCalendar = useCallback(() => {
    calendarRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const totalWorkouts = 16 * 7;
  const completedWorkouts = Object.values(completions).filter(
    (c) => c.status === "complete"
  ).length;

  const selectedWorkoutData = selectedWorkout
    ? trainingPlan[selectedWorkout.week]?.[selectedWorkout.day]
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentWeek={currentWeek}
        totalWorkouts={totalWorkouts}
        completedWorkouts={completedWorkouts}
      />

      <HeroSection
        currentWeek={currentWeek}
        daysUntilRace={daysUntilRace}
        onScrollToCalendar={scrollToCalendar}
      />

      <main className="container mx-auto px-4 py-8 sm:py-12 space-y-12">
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">
              Your Progress
            </h2>
            <p className="text-muted-foreground">
              Track your training journey at a glance
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-md" />
              ))}
            </div>
          ) : (
            <StatsDashboard
              completions={completions}
              currentWeek={currentWeek}
            />
          )}
        </section>

        <section ref={calendarRef} className="scroll-mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">
              Training Calendar
            </h2>
            <p className="text-muted-foreground mb-4">
              Hold to complete, tap to view details
            </p>
            <CategoryLegend />
          </motion.div>

          <div className="space-y-2">
            {isLoading ? (
              [...Array(16)].map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-md" />
              ))
            ) : (
              [...Array(16)].map((_, i) => {
                const week = i + 1;
                return (
                  <WeekRow
                    key={week}
                    week={week}
                    completions={completions}
                    onSelectWorkout={handleSelectWorkout}
                    onCompleteWorkout={handleCompleteWorkout}
                    isCurrentWeek={week === currentWeek}
                    currentDay={week === currentWeek ? currentDay : undefined}
                  />
                );
              })
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Marathon Training Tracker — Your 16-week journey to race day
          </p>
        </div>
      </footer>

      {selectedWorkout && selectedWorkoutData && (
        <WorkoutModal
          isOpen={!!selectedWorkout}
          onClose={() => setSelectedWorkout(null)}
          week={selectedWorkout.week}
          day={selectedWorkout.day}
          workout={selectedWorkoutData}
          completionData={completions[`${selectedWorkout.week}-${selectedWorkout.day}`]}
          onSave={handleSaveWorkout}
        />
      )}
    </div>
  );
}
