import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ExpandableStatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  suffix?: string;
  color: string;
  details?: {
    label: string;
    value: string | number;
    suffix?: string;
  }[];
  trend?: {
    direction: 'up' | 'down' | 'stable';
    value: number;
  };
  index?: number;
}

export function ExpandableStatCard({
  icon: Icon,
  label,
  value,
  suffix,
  color,
  details,
  trend,
  index = 0,
}: ExpandableStatCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasDetails = details && details.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card 
        className={cn(
          "border-card-border bg-card transition-all",
          hasDetails && "cursor-pointer hover-elevate"
        )}
        onClick={() => hasDetails && setIsExpanded(!isExpanded)}
        data-testid={`stat-card-${label.toLowerCase().replace(/\s/g, '-')}`}
      >
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <Icon className={cn("w-5 h-5", color)} />
            {hasDetails && (
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
              >
                {isExpanded ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </Button>
            )}
          </div>
          
          <div className="space-y-1">
            <div className="flex items-baseline gap-1">
              <p className="text-2xl sm:text-3xl font-display font-bold tracking-tight">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </p>
              {suffix && (
                <span className="text-sm font-normal text-muted-foreground">
                  {suffix}
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                {label}
              </p>
              {trend && (
                <span className={cn(
                  "text-xs font-medium",
                  trend.direction === 'up' && "text-emerald-500",
                  trend.direction === 'down' && "text-red-500",
                  trend.direction === 'stable' && "text-muted-foreground"
                )}>
                  {trend.direction === 'up' && '+'}
                  {trend.direction === 'down' && '-'}
                  {trend.value}%
                </span>
              )}
            </div>
          </div>

          <AnimatePresence>
            {isExpanded && details && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-border space-y-2">
                  {details.map((detail, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground">{detail.label}</span>
                      <span className="font-medium">
                        {detail.value}
                        {detail.suffix && (
                          <span className="text-muted-foreground ml-1">
                            {detail.suffix}
                          </span>
                        )}
                      </span>
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
