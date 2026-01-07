import { motion } from "framer-motion";
import { Moon, Sun, Menu, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/lib/theme-context";

interface HeaderProps {
  currentWeek: number;
  totalWorkouts: number;
  completedWorkouts: number;
}

export function Header({ currentWeek, totalWorkouts, completedWorkouts }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const progress = Math.round((completedWorkouts / totalWorkouts) * 100);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <Trophy className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display font-bold text-lg tracking-tight text-foreground">
                Marathon Tracker
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
            <div className="relative w-8 h-8">
              <svg viewBox="0 0 36 36" className="w-8 h-8 -rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-muted-foreground/20"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={100}
                  strokeDashoffset={100 - progress}
                  strokeLinecap="round"
                  className="text-primary transition-all duration-500"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground">
                {progress}%
              </span>
            </div>
            <div className="text-sm">
              <span className="font-semibold text-foreground">Week {currentWeek}</span>
              <span className="text-muted-foreground">/16</span>
            </div>
          </div>

          <Badge variant="secondary" className="hidden md:flex">
            {completedWorkouts} workouts done
          </Badge>

          <Button
            size="icon"
            variant="ghost"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
