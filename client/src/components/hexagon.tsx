import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { Workout, WorkoutCompletion, DayName } from "@shared/schema";
import { categoryColors, dayAbbreviations } from "@/lib/training-data";
import { cn } from "@/lib/utils";

interface HexagonProps {
  week: number;
  day: DayName;
  workout: Workout;
  completionData?: WorkoutCompletion;
  onSelect: (week: number, day: DayName) => void;
  onComplete: (week: number, day: DayName) => void;
  isToday?: boolean;
}

export function Hexagon({
  week,
  day,
  workout,
  completionData,
  onSelect,
  onComplete,
  isToday = false,
}: HexagonProps) {
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const holdStartRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);

  const status = completionData?.status || "incomplete";
  const color = categoryColors[workout.category];

  const startHold = useCallback(() => {
    if (status === "complete") return;
    
    setIsHolding(true);
    holdStartRef.current = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - holdStartRef.current;
      const progress = Math.min((elapsed / 2000) * 100, 100);
      setHoldProgress(progress);

      if (progress >= 100) {
        onComplete(week, day);
        setHoldProgress(0);
        setIsHolding(false);
      } else {
        animationFrameRef.current = requestAnimationFrame(updateProgress);
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateProgress);
  }, [status, week, day, onComplete]);

  const endHold = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
    }
    setIsHolding(false);
    if (holdProgress < 100) {
      setHoldProgress(0);
    }
  }, [holdProgress]);

  const handleClick = () => {
    if (!isHolding || holdProgress < 10) {
      onSelect(week, day);
    }
  };

  const dayAbbr = dayAbbreviations[day];

  return (
    <motion.div
      className={cn(
        "relative cursor-pointer select-none",
        "w-[52px] h-[60px] sm:w-[60px] sm:h-[69px] md:w-[68px] md:h-[78px]"
      )}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.98 }}
      onMouseDown={startHold}
      onMouseUp={endHold}
      onMouseLeave={endHold}
      onTouchStart={startHold}
      onTouchEnd={endHold}
      onClick={handleClick}
      data-testid={`hexagon-week-${week}-${day}`}
    >
      <svg viewBox="0 0 100 115.47" className="w-full h-full drop-shadow-lg">
        <defs>
          <linearGradient id={`grad-${week}-${day}`} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color.dark} />
            <stop offset="100%" stopColor={color.bg} />
          </linearGradient>
          <linearGradient id={`fill-${week}-${day}`} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={color.light} />
            <stop offset="100%" stopColor={color.bg} />
          </linearGradient>
          <clipPath id={`hex-clip-${week}-${day}`}>
            <polygon points="50,0 100,28.87 100,86.6 50,115.47 0,86.6 0,28.87" />
          </clipPath>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <polygon
          points="50,0 100,28.87 100,86.6 50,115.47 0,86.6 0,28.87"
          className={cn(
            "transition-all duration-300",
            status === "complete"
              ? "fill-current"
              : "fill-zinc-800 dark:fill-zinc-900"
          )}
          style={status === "complete" ? { fill: `url(#grad-${week}-${day})` } : undefined}
          stroke={isToday ? color.bg : "transparent"}
          strokeWidth={isToday ? 3 : 0}
          filter={isToday ? "url(#glow)" : undefined}
        />

        {status === "incomplete" && holdProgress > 0 && (
          <g clipPath={`url(#hex-clip-${week}-${day})`}>
            <rect
              x="0"
              y={115.47 - (holdProgress / 100) * 115.47}
              width="100"
              height={(holdProgress / 100) * 115.47}
              fill={`url(#fill-${week}-${day})`}
              className="transition-none"
            />
          </g>
        )}

        {isToday && (
          <polygon
            points="50,0 100,28.87 100,86.6 50,115.47 0,86.6 0,28.87"
            fill="none"
            stroke={color.bg}
            strokeWidth="2"
            className="animate-pulse"
            opacity="0.6"
          />
        )}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        {status === "complete" ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-white"
          >
            <Check className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={3} />
          </motion.div>
        ) : (
          <>
            <span className="text-[8px] sm:text-[9px] text-muted-foreground font-medium tracking-wide">
              W{week}
            </span>
            <span className="text-[11px] sm:text-xs font-bold text-foreground">
              {dayAbbr}
            </span>
          </>
        )}
      </div>
    </motion.div>
  );
}
