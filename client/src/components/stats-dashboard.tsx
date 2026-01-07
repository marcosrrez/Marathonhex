import { motion } from "framer-motion";
import { TrendingUp, Calendar, Flame, Target, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { WorkoutCompletion } from "@shared/schema";
import { dayNames } from "@shared/schema";
import { trainingPlan, categoryColors } from "@/lib/training-data";
import { cn } from "@/lib/utils";

interface StatsDashboardProps {
  completions: Record<string, WorkoutCompletion>;
  currentWeek: number;
  raceDate?: Date;
}

function CountUpNumber({ value, duration = 1000 }: { value: number; duration?: number }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {value}
    </motion.span>
  );
}

export function StatsDashboard({ completions, currentWeek, raceDate }: StatsDashboardProps) {
  const totalWorkouts = 16 * 7;
  const completedWorkouts = Object.values(completions).filter(
    (c) => c.status === "complete"
  ).length;
  const overallProgress = Math.round((completedWorkouts / totalWorkouts) * 100);

  const totalDistance = Object.values(completions).reduce((sum, c) => {
    return sum + (parseFloat(c.distance || "0") || 0);
  }, 0);

  const totalDuration = Object.values(completions).reduce((sum, c) => {
    return sum + (parseInt(c.duration || "0") || 0);
  }, 0);

  let currentStreak = 0;
  const today = new Date();
  for (let w = currentWeek; w >= 1; w--) {
    for (let d = dayNames.length - 1; d >= 0; d--) {
      const key = `${w}-${dayNames[d]}`;
      if (completions[key]?.status === "complete") {
        currentStreak++;
      } else if (trainingPlan[w]?.[dayNames[d]]?.category !== "rest") {
        break;
      }
    }
  }

  const daysUntilRace = raceDate
    ? Math.max(0, Math.ceil((raceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))
    : 16 * 7 - (currentWeek - 1) * 7;

  const weeksRemaining = Math.ceil(daysUntilRace / 7);

  const categoryStats = Object.values(completions).reduce((acc, c) => {
    if (c.status === "complete") {
      const workout = trainingPlan[c.week]?.[c.day];
      if (workout) {
        acc[workout.category] = (acc[workout.category] || 0) + 1;
      }
    }
    return acc;
  }, {} as Record<string, number>);

  const stats = [
    {
      icon: Target,
      label: "Workouts Done",
      value: completedWorkouts,
      suffix: `/${totalWorkouts}`,
      color: "text-primary",
    },
    {
      icon: MapPin,
      label: "Miles Logged",
      value: totalDistance.toFixed(1),
      suffix: "mi",
      color: "text-emerald-500",
    },
    {
      icon: Clock,
      label: "Time Trained",
      value: Math.round(totalDuration / 60),
      suffix: "hrs",
      color: "text-blue-500",
    },
    {
      icon: Flame,
      label: "Current Streak",
      value: currentStreak,
      suffix: "days",
      color: "text-amber-500",
    },
  ];

  return (
    <div className="space-y-6" data-testid="stats-dashboard">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="border-card-border bg-card">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                </div>
                <div className="space-y-1">
                  <p className="text-2xl sm:text-3xl font-display font-bold tracking-tight">
                    <CountUpNumber value={typeof stat.value === 'string' ? parseFloat(stat.value) : stat.value} />
                    <span className="text-sm font-normal text-muted-foreground ml-1">
                      {stat.suffix}
                    </span>
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card className="border-card-border bg-card">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Training Progress</h3>
              </div>
              <Badge variant="secondary">
                Week {currentWeek} of 16
              </Badge>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Overall Completion</span>
                <span className="font-semibold">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Start</span>
                <span>{weeksRemaining} weeks until race day</span>
                <span>Race</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Card className="border-card-border bg-card">
          <CardContent className="p-4 sm:p-6">
            <h3 className="font-semibold text-foreground mb-4">Workout Categories</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(categoryColors).map(([category, colors]) => {
                const count = categoryStats[category] || 0;
                return (
                  <Badge
                    key={category}
                    variant="outline"
                    className="px-3 py-1.5"
                    style={{
                      borderColor: colors.bg,
                      color: colors.bg,
                      backgroundColor: `${colors.bg}15`,
                    }}
                  >
                    <span className="capitalize">{category}</span>
                    <span className="ml-1.5 opacity-70">{count}</span>
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
