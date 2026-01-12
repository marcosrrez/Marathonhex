import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Flame, Target, Clock, MapPin, ChevronDown, ChevronUp, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

interface ExpandableStatProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  suffix?: string;
  color: string;
  details?: { label: string; value: string | number }[];
  index?: number;
}

function ExpandableStat({ icon: Icon, label, value, suffix, color, details, index = 0 }: ExpandableStatProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasDetails = details && details.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card 
        className={cn("border-card-border bg-card transition-all", hasDetails && "cursor-pointer hover-elevate")}
        onClick={() => hasDetails && setIsExpanded(!isExpanded)}
      >
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <Icon className={cn("w-5 h-5", color)} />
            {hasDetails && (
              <Button variant="ghost" size="icon" className="h-5 w-5 shrink-0">
                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </Button>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-display font-bold tracking-tight">
              {typeof value === 'number' ? value.toLocaleString() : value}
              {suffix && <span className="text-sm font-normal text-muted-foreground ml-1">{suffix}</span>}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">{label}</p>
          </div>
          <AnimatePresence>
            {isExpanded && details && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-border space-y-2">
                  {details.map((d, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{d.label}</span>
                      <span className="font-medium">{d.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
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
    const dur = c.duration || "0";
    const parts = dur.split(":");
    if (parts.length === 2) {
      return sum + parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    return sum + (parseInt(dur) || 0);
  }, 0);

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  const today = new Date();

  for (let w = currentWeek; w >= 1; w--) {
    for (let d = dayNames.length - 1; d >= 0; d--) {
      const key = `${w}-${dayNames[d]}`;
      const workout = trainingPlan[w]?.[dayNames[d]];
      if (workout?.category === "rest") continue;
      if (completions[key]?.status === "complete") {
        tempStreak++;
      } else {
        if (tempStreak > longestStreak) longestStreak = tempStreak;
        if (currentStreak === 0 && tempStreak > 0) currentStreak = tempStreak;
        tempStreak = 0;
      }
    }
  }
  if (tempStreak > currentStreak) currentStreak = tempStreak;
  if (tempStreak > longestStreak) longestStreak = tempStreak;

  const thisWeekCompleted = Object.entries(completions).filter(
    ([key, c]) => key.startsWith(`${currentWeek}-`) && c.status === "complete"
  ).length;

  const totalPlanned = dayNames.filter(d => trainingPlan[currentWeek]?.[d]?.category !== "rest").length;
  const adherenceRate = totalPlanned > 0 ? Math.round((thisWeekCompleted / totalPlanned) * 100) : 0;

  const avgWeeklyDistance = currentWeek > 0 ? (totalDistance / currentWeek).toFixed(1) : "0";
  const avgWeeklyTime = currentWeek > 0 ? Math.round(totalDuration / currentWeek / 60) : 0;

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
      details: [
        { label: "This Week", value: `${thisWeekCompleted}/${totalPlanned}` },
        { label: "Week Adherence", value: `${adherenceRate}%` },
        { label: "Remaining", value: totalWorkouts - completedWorkouts },
      ],
    },
    {
      icon: MapPin,
      label: "Miles Logged",
      value: totalDistance.toFixed(1),
      suffix: "mi",
      color: "text-emerald-500",
      details: [
        { label: "Avg per Week", value: `${avgWeeklyDistance} mi` },
        { label: "Marathon Goal", value: "26.2 mi" },
      ],
    },
    {
      icon: Clock,
      label: "Time Trained",
      value: Math.round(totalDuration / 60),
      suffix: "hrs",
      color: "text-blue-500",
      details: [
        { label: "Avg per Week", value: `${avgWeeklyTime} hrs` },
        { label: "Total Minutes", value: totalDuration.toLocaleString() },
      ],
    },
    {
      icon: Flame,
      label: "Current Streak",
      value: currentStreak,
      suffix: "days",
      color: "text-amber-500",
      details: [
        { label: "Longest Streak", value: `${longestStreak} days` },
        { label: "Consistency", value: currentStreak >= 7 ? "Elite" : currentStreak >= 3 ? "Good" : "Building" },
      ],
    },
  ];

  return (
    <div className="space-y-6" data-testid="stats-dashboard">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, index) => (
          <ExpandableStat
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            suffix={stat.suffix}
            color={stat.color}
            details={stat.details}
            index={index}
          />
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
