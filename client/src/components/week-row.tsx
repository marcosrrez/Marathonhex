import { motion } from "framer-motion";
import { Hexagon } from "./hexagon";
import { Badge } from "@/components/ui/badge";
import { dayNames, type DayName, type WorkoutCompletion } from "@shared/schema";
import { trainingPlan } from "@/lib/training-data";
import { cn } from "@/lib/utils";

interface WeekRowProps {
  week: number;
  completions: Record<string, WorkoutCompletion>;
  onSelectWorkout: (week: number, day: DayName) => void;
  onCompleteWorkout: (week: number, day: DayName) => void;
  isCurrentWeek?: boolean;
  currentDay?: DayName;
}

export function WeekRow({
  week,
  completions,
  onSelectWorkout,
  onCompleteWorkout,
  isCurrentWeek = false,
  currentDay,
}: WeekRowProps) {
  const weekPlan = trainingPlan[week];
  if (!weekPlan) return null;

  const completedCount = dayNames.filter(
    (day) => completions[`${week}-${day}`]?.status === "complete"
  ).length;
  const completionPercentage = Math.round((completedCount / 7) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: week * 0.03 }}
      className={cn(
        "relative rounded-md p-3 sm:p-4 transition-all duration-300",
        isCurrentWeek
          ? "bg-card border border-primary/20 shadow-lg"
          : "bg-transparent"
      )}
      data-testid={`week-row-${week}`}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-display font-bold text-sm sm:text-base tracking-wide text-foreground">
            WEEK {week}
          </span>
          {isCurrentWeek && (
            <Badge variant="default" className="text-xs">
              Current
            </Badge>
          )}
          {week === 16 && (
            <Badge className="bg-pink-500 text-white border-pink-600 text-xs">
              Race Week
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5">
            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            {completedCount}/7
          </span>
        </div>
      </div>

      <div className="flex gap-1 sm:gap-1.5 md:gap-2 flex-wrap justify-start">
        {dayNames.map((day) => (
          <Hexagon
            key={`${week}-${day}`}
            week={week}
            day={day}
            workout={weekPlan[day]}
            completionData={completions[`${week}-${day}`]}
            onSelect={onSelectWorkout}
            onComplete={onCompleteWorkout}
            isToday={isCurrentWeek && currentDay === day}
          />
        ))}
      </div>
    </motion.div>
  );
}
