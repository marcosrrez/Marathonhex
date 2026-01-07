import { motion } from "framer-motion";
import { ChevronDown, Play, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  currentWeek: number;
  daysUntilRace: number;
  onScrollToCalendar: () => void;
}

export function HeroSection({ currentWeek, daysUntilRace, onScrollToCalendar }: HeroSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-[50vh] sm:min-h-[60vh] flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
      
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 50px,
            rgba(255,255,255,0.03) 50px,
            rgba(255,255,255,0.03) 51px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 50px,
            rgba(255,255,255,0.03) 50px,
            rgba(255,255,255,0.03) 51px
          )`
        }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-white/90">
              16-Week Training Plan
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">
            Your Marathon
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-amber-400 to-primary">
              Journey Starts Here
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-white/70 leading-relaxed">
            Track every stride, celebrate every milestone. 
            16 weeks of structured training to get you race-ready.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="relative"
            >
              <div className="text-6xl sm:text-7xl font-display font-bold text-white">
                {daysUntilRace}
              </div>
              <div className="text-sm uppercase tracking-widest text-white/60 font-medium">
                Days to Race
              </div>
            </motion.div>

            <div className="hidden sm:block w-px h-20 bg-white/20" />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="relative"
            >
              <div className="text-6xl sm:text-7xl font-display font-bold text-white">
                {currentWeek}
              </div>
              <div className="text-sm uppercase tracking-widest text-white/60 font-medium">
                Current Week
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="pt-8"
          >
            <Button
              size="lg"
              onClick={onScrollToCalendar}
              className="gap-2 text-base px-8 py-6 rounded-full bg-white text-zinc-900 hover:bg-white/90"
              data-testid="button-view-plan"
            >
              <Play className="w-5 h-5" />
              View Training Plan
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="cursor-pointer"
          onClick={onScrollToCalendar}
        >
          <ChevronDown className="w-8 h-8 text-white/40" />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
