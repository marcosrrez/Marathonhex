import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  Flame, 
  Target, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  ChevronDown,
  ChevronUp,
  Zap,
  Heart,
  Award
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Insight, InsightSeverity, InsightCategory } from "@shared/schema";
import { cn } from "@/lib/utils";

interface InsightsFeedProps {
  insights: Insight[];
  onDismiss?: (id: string) => void;
  expanded?: boolean;
}

const severityConfig: Record<InsightSeverity, { icon: typeof Info; color: string; bg: string }> = {
  info: { icon: Info, color: "text-blue-500", bg: "bg-blue-500/10" },
  success: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  warning: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10" },
  critical: { icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" },
};

const categoryIcons: Record<InsightCategory, typeof Flame> = {
  consistency: Target,
  performance: TrendingUp,
  recovery: Heart,
  milestone: Award,
  trend: Zap,
  recommendation: Info,
};

function InsightCard({ insight, onDismiss }: { insight: Insight; onDismiss?: (id: string) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = severityConfig[insight.severity];
  const CategoryIcon = categoryIcons[insight.category];
  const SeverityIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      layout
    >
      <Card 
        className={cn(
          "border-l-4 transition-all cursor-pointer hover-elevate",
          insight.severity === "success" && "border-l-emerald-500",
          insight.severity === "warning" && "border-l-amber-500",
          insight.severity === "critical" && "border-l-red-500",
          insight.severity === "info" && "border-l-blue-500"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
        data-testid={`insight-card-${insight.id}`}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={cn("p-2 rounded-lg shrink-0", config.bg)}>
              <SeverityIcon className={cn("w-4 h-4", config.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="font-semibold text-foreground text-sm truncate">
                  {insight.title}
                </h4>
                <Badge variant="secondary" className="shrink-0 text-xs">
                  <CategoryIcon className="w-3 h-3 mr-1" />
                  {insight.category}
                </Badge>
              </div>
              <p className={cn(
                "text-sm text-muted-foreground transition-all",
                !isExpanded && "line-clamp-2"
              )}>
                {insight.message}
              </p>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-3 pt-3 border-t border-border"
                  >
                    <div className="flex flex-wrap gap-2">
                      {insight.value !== undefined && (
                        <Badge variant="outline">
                          Value: {insight.value.toFixed(1)}
                        </Badge>
                      )}
                      {insight.change !== undefined && (
                        <Badge 
                          variant="outline"
                          className={cn(
                            insight.change > 0 ? "text-emerald-500" : "text-red-500"
                          )}
                        >
                          {insight.change > 0 ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          )}
                          {insight.change > 0 ? "+" : ""}{insight.change.toFixed(1)}%
                        </Badge>
                      )}
                      {insight.week && (
                        <Badge variant="outline">
                          Week {insight.week}
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function InsightsFeed({ insights, onDismiss, expanded = false }: InsightsFeedProps) {
  const [showAll, setShowAll] = useState(expanded);
  const displayedInsights = showAll ? insights : insights.slice(0, 3);
  const hasMore = insights.length > 3;

  if (insights.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <Info className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Complete a few workouts to see personalized insights
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4" data-testid="insights-feed">
      <AnimatePresence mode="popLayout">
        {displayedInsights.map((insight) => (
          <InsightCard
            key={insight.id}
            insight={insight}
            onDismiss={onDismiss}
          />
        ))}
      </AnimatePresence>

      {hasMore && (
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => setShowAll(!showAll)}
          data-testid="button-show-more-insights"
        >
          {showAll ? (
            <>
              <ChevronUp className="w-4 h-4 mr-2" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-2" />
              Show {insights.length - 3} More Insights
            </>
          )}
        </Button>
      )}
    </div>
  );
}
