import type { WorkoutCompletion, Insight, WeeklySummary, TrainingMetrics, RollingStats, InsightCategory, InsightSeverity } from "@shared/schema";
import { dayNames, type DayName } from "@shared/schema";
import { trainingPlan } from "./training-data";

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function parseDistance(distanceStr?: string): number {
  if (!distanceStr) return 0;
  const match = distanceStr.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

function parseDuration(durationStr?: string): number {
  if (!durationStr) return 0;
  const parts = durationStr.split(":");
  if (parts.length === 2) {
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  }
  return parseInt(durationStr) || 0;
}

function parsePace(paceStr?: string): number {
  if (!paceStr) return 0;
  const match = paceStr.match(/(\d+):(\d+)/);
  if (match) {
    return parseInt(match[1]) * 60 + parseInt(match[2]);
  }
  return 0;
}

function parseHeartRate(hrStr?: string): number {
  if (!hrStr) return 0;
  const match = hrStr.match(/\d+/);
  return match ? parseInt(match[0]) : 0;
}

export function calculateWeeklySummary(
  week: number,
  completions: Record<string, WorkoutCompletion>
): WeeklySummary {
  const weekPlan = trainingPlan[week];
  if (!weekPlan) {
    return {
      week,
      plannedWorkouts: 0,
      completedWorkouts: 0,
      adherenceRate: 0,
      totalDistance: 0,
      totalDuration: 0,
      avgPace: 0,
      intensityScore: 0,
      recoveryDays: 0,
    };
  }

  let plannedWorkouts = 0;
  let completedWorkouts = 0;
  let totalDistance = 0;
  let totalDuration = 0;
  let totalPace = 0;
  let paceCount = 0;
  let totalHeartRate = 0;
  let hrCount = 0;
  let totalEffort = 0;
  let effortCount = 0;
  let recoveryDays = 0;
  let intensityPoints = 0;

  const intensityWeights: Record<string, number> = {
    speed: 3,
    tempo: 2.5,
    long: 2,
    aerobic: 1.5,
    recovery: 0.5,
    rest: 0,
    race: 3,
  };

  for (const day of dayNames) {
    const workout = weekPlan[day];
    if (workout.category === "rest") {
      recoveryDays++;
      continue;
    }

    plannedWorkouts++;
    const key = `${week}-${day}`;
    const completion = completions[key];

    if (completion?.status === "complete") {
      completedWorkouts++;
      totalDistance += parseDistance(completion.distance);
      totalDuration += parseDuration(completion.duration);

      const pace = parsePace(completion.pace);
      if (pace > 0) {
        totalPace += pace;
        paceCount++;
      }

      const hr = parseHeartRate(completion.heartRate);
      if (hr > 0) {
        totalHeartRate += hr;
        hrCount++;
      }

      if (completion.effort) {
        totalEffort += completion.effort;
        effortCount++;
      }

      intensityPoints += intensityWeights[workout.category] || 1;
    }
  }

  return {
    week,
    plannedWorkouts,
    completedWorkouts,
    adherenceRate: plannedWorkouts > 0 ? (completedWorkouts / plannedWorkouts) * 100 : 0,
    totalDistance,
    totalDuration,
    avgPace: paceCount > 0 ? totalPace / paceCount : 0,
    avgHeartRate: hrCount > 0 ? totalHeartRate / hrCount : undefined,
    avgEffort: effortCount > 0 ? totalEffort / effortCount : undefined,
    intensityScore: intensityPoints,
    recoveryDays,
  };
}

export function calculateTrainingMetrics(
  completions: Record<string, WorkoutCompletion>,
  currentWeek: number
): TrainingMetrics {
  const completionValues = Object.values(completions);
  const completed = completionValues.filter(c => c.status === "complete");

  let totalDistance = 0;
  let totalDuration = 0;
  let totalWorkouts = completed.length;
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const weeklyDistances: number[] = [];
  const weeklyDurations: number[] = [];

  for (let w = 1; w <= currentWeek; w++) {
    const summary = calculateWeeklySummary(w, completions);
    weeklyDistances.push(summary.totalDistance);
    weeklyDurations.push(summary.totalDuration);
  }

  for (const c of completed) {
    totalDistance += parseDistance(c.distance);
    totalDuration += parseDuration(c.duration);
  }

  for (let w = currentWeek; w >= 1; w--) {
    for (let d = dayNames.length - 1; d >= 0; d--) {
      const day = dayNames[d];
      const key = `${w}-${day}`;
      const workout = trainingPlan[w]?.[day];
      
      if (workout?.category === "rest") continue;
      
      if (completions[key]?.status === "complete") {
        tempStreak++;
      } else {
        if (tempStreak > longestStreak) longestStreak = tempStreak;
        if (currentStreak === 0 && tempStreak > 0) currentStreak = tempStreak;
        tempStreak = 0;
        if (currentStreak > 0) break;
      }
    }
    if (currentStreak > 0 && tempStreak === 0) break;
  }

  if (tempStreak > currentStreak) currentStreak = tempStreak;
  if (tempStreak > longestStreak) longestStreak = tempStreak;

  const totalPlanned = Object.entries(trainingPlan)
    .filter(([w]) => parseInt(w) <= currentWeek)
    .reduce((sum, [w, plan]) => {
      return sum + dayNames.filter(d => plan[d].category !== "rest").length;
    }, 0);

  const adherenceRate = totalPlanned > 0 ? (totalWorkouts / totalPlanned) * 100 : 0;
  const avgWeeklyDistance = currentWeek > 0 ? totalDistance / currentWeek : 0;
  const avgWeeklyDuration = currentWeek > 0 ? totalDuration / currentWeek : 0;

  let paceImprovement = 0;
  if (weeklyDistances.length >= 4) {
    const firstHalf = weeklyDistances.slice(0, Math.floor(weeklyDistances.length / 2));
    const secondHalf = weeklyDistances.slice(Math.floor(weeklyDistances.length / 2));
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    if (firstAvg > 0) {
      paceImprovement = ((secondAvg - firstAvg) / firstAvg) * 100;
    }
  }

  const consistencyVariance = weeklyDistances.length > 1
    ? Math.sqrt(weeklyDistances.reduce((sum, d, _, arr) => {
        const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
        return sum + Math.pow(d - mean, 2);
      }, 0) / weeklyDistances.length)
    : 0;

  const maxDistance = Math.max(...weeklyDistances, 1);
  const consistencyScore = Math.max(0, 100 - (consistencyVariance / maxDistance) * 100);

  let weeklyTrend: 'improving' | 'stable' | 'declining' = 'stable';
  if (weeklyDistances.length >= 3) {
    const recent = weeklyDistances.slice(-3);
    const trend = recent[2] - recent[0];
    if (trend > recent[0] * 0.1) weeklyTrend = 'improving';
    else if (trend < -recent[0] * 0.1) weeklyTrend = 'declining';
  }

  return {
    currentStreak,
    longestStreak,
    totalDistance,
    totalDuration,
    totalWorkouts,
    avgWeeklyDistance,
    avgWeeklyDuration,
    adherenceRate,
    paceImprovement,
    consistencyScore,
    weeklyTrend,
  };
}

export function calculateRollingStats(
  completions: Record<string, WorkoutCompletion>,
  trainingStart: Date,
  today: Date = new Date()
): RollingStats {
  const getDaysAgo = (days: number) => {
    const date = new Date(today);
    date.setDate(date.getDate() - days);
    return date;
  };

  const getStatsForPeriod = (startDate: Date, endDate: Date) => {
    let distance = 0;
    let duration = 0;
    let workouts = 0;

    for (const c of Object.values(completions)) {
      if (c.status !== "complete" || !c.completedAt) continue;
      const completedDate = new Date(c.completedAt);
      if (completedDate >= startDate && completedDate <= endDate) {
        distance += parseDistance(c.distance);
        duration += parseDuration(c.duration);
        workouts++;
      }
    }

    return { distance, duration, workouts };
  };

  return {
    last7Days: getStatsForPeriod(getDaysAgo(7), today),
    last14Days: getStatsForPeriod(getDaysAgo(14), today),
    last28Days: getStatsForPeriod(getDaysAgo(28), today),
  };
}

export function generateInsights(
  completions: Record<string, WorkoutCompletion>,
  currentWeek: number,
  metrics: TrainingMetrics,
  weeklySummaries: WeeklySummary[]
): Insight[] {
  const insights: Insight[] = [];
  const now = new Date().toISOString();

  const createInsight = (
    category: InsightCategory,
    severity: InsightSeverity,
    title: string,
    message: string,
    extras?: Partial<Insight>
  ): Insight => ({
    id: generateId(),
    category,
    severity,
    title,
    message,
    createdAt: now,
    ...extras,
  });

  if (metrics.adherenceRate >= 90) {
    insights.push(createInsight(
      'consistency',
      'success',
      'Outstanding Consistency',
      `You've completed ${Math.round(metrics.adherenceRate)}% of your planned workouts. Elite-level commitment!`,
      { value: metrics.adherenceRate }
    ));
  } else if (metrics.adherenceRate >= 75) {
    insights.push(createInsight(
      'consistency',
      'info',
      'Good Training Consistency',
      `${Math.round(metrics.adherenceRate)}% completion rate - you're on track for race day.`,
      { value: metrics.adherenceRate }
    ));
  } else if (metrics.adherenceRate < 60 && currentWeek > 2) {
    insights.push(createInsight(
      'consistency',
      'warning',
      'Training Consistency Slipping',
      `Only ${Math.round(metrics.adherenceRate)}% completion. Consider adjusting your schedule to fit more workouts.`,
      { value: metrics.adherenceRate }
    ));
  }

  if (metrics.currentStreak >= 7) {
    insights.push(createInsight(
      'milestone',
      'success',
      `${metrics.currentStreak}-Day Streak!`,
      `Amazing dedication! You've trained ${metrics.currentStreak} days in a row.`,
      { value: metrics.currentStreak }
    ));
  } else if (metrics.currentStreak >= 3) {
    insights.push(createInsight(
      'milestone',
      'info',
      'Building Momentum',
      `${metrics.currentStreak}-day streak going. Keep it up!`,
      { value: metrics.currentStreak }
    ));
  }

  if (metrics.weeklyTrend === 'improving') {
    insights.push(createInsight(
      'trend',
      'success',
      'Training Volume Increasing',
      'Your weekly distance has been trending upward. Great progressive overload!',
      { change: metrics.paceImprovement }
    ));
  } else if (metrics.weeklyTrend === 'declining' && currentWeek < 14) {
    insights.push(createInsight(
      'trend',
      'warning',
      'Volume Declining',
      'Your training volume has decreased recently. Make sure this is intentional.',
      { change: metrics.paceImprovement }
    ));
  }

  if (currentWeek > 2 && weeklySummaries.length >= 2) {
    const currentSummary = weeklySummaries[weeklySummaries.length - 1];
    const previousSummary = weeklySummaries[weeklySummaries.length - 2];

    if (currentSummary && previousSummary) {
      const distanceChange = previousSummary.totalDistance > 0
        ? ((currentSummary.totalDistance - previousSummary.totalDistance) / previousSummary.totalDistance) * 100
        : 0;

      if (distanceChange > 20) {
        insights.push(createInsight(
          'recovery',
          'warning',
          'Big Volume Jump',
          `This week's distance is ${Math.round(distanceChange)}% higher than last week. Watch for fatigue.`,
          { change: distanceChange, week: currentWeek }
        ));
      }

      if (currentSummary.recoveryDays < 1 && currentSummary.intensityScore > 8) {
        insights.push(createInsight(
          'recovery',
          'warning',
          'Recovery Check',
          'High intensity week with minimal rest. Consider adding an easy day.',
          { week: currentWeek }
        ));
      }
    }
  }

  const milestones = [10, 25, 50, 100, 150, 200];
  for (const milestone of milestones) {
    if (metrics.totalDistance >= milestone && metrics.totalDistance < milestone + 5) {
      insights.push(createInsight(
        'milestone',
        'success',
        `${milestone} Miles Club!`,
        `You've logged over ${milestone} miles of training. Incredible progress!`,
        { value: milestone }
      ));
      break;
    }
  }

  if (currentWeek === 16) {
    insights.push(createInsight(
      'recommendation',
      'info',
      'Race Week',
      'Focus on rest, hydration, and mental preparation. Trust your training!',
      { week: 16 }
    ));
  } else if (currentWeek >= 14) {
    insights.push(createInsight(
      'recommendation',
      'info',
      'Taper Time',
      'Your body is adapting from months of training. Reduce volume but maintain intensity.',
      { week: currentWeek }
    ));
  }

  if (metrics.consistencyScore > 80) {
    insights.push(createInsight(
      'performance',
      'success',
      'Consistent Runner',
      `Your training consistency score is ${Math.round(metrics.consistencyScore)}%. This predicts race day success!`,
      { value: metrics.consistencyScore }
    ));
  }

  return insights.sort((a, b) => {
    const severityOrder = { critical: 0, warning: 1, success: 2, info: 3 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  }).slice(0, 6);
}
