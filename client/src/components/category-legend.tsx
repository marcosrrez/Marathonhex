import { motion } from "framer-motion";
import { categoryColors } from "@/lib/training-data";
import { cn } from "@/lib/utils";

export function CategoryLegend() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="flex flex-wrap gap-3 justify-center"
      data-testid="category-legend"
    >
      {Object.entries(categoryColors).map(([category, colors]) => (
        <div key={category} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: colors.bg }}
          />
          <span className="text-xs sm:text-sm text-muted-foreground capitalize font-medium">
            {category}
          </span>
        </div>
      ))}
    </motion.div>
  );
}
