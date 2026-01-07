import type { TrainingPlan, WorkoutCategory } from "@shared/schema";

export const trainingPlan: TrainingPlan = {
  1: {
    monday: { type: 'intervals', title: '5min Intervals x3', details: '5min intervals X 3\n• 1-2min walk/jog between intervals\n• Goal: 2 miles at 10K pace\n\nDrills – and/or – strides', category: 'speed' },
    tuesday: { type: 'recovery', title: '20-30min Jog', details: '20-30min: Jog – or – 30min: Cross-train\n\nStrength', category: 'recovery' },
    wednesday: { type: 'aerobic', title: '30-40min Aerobic', details: '30-40min: Aerobic run\n\nStrides', category: 'aerobic' },
    thursday: { type: 'recovery', title: '20-30min Jog', details: '20-30min: Jog – or – 30min: Cross-train\n\nStrength', category: 'recovery' },
    friday: { type: 'jog', title: '40min Jog', details: '40min: Jog\n\nDrills', category: 'aerobic' },
    saturday: { type: 'long', title: '60min Long Run', details: '60min: Long run', category: 'long' },
    sunday: { type: 'rest', title: 'Rest', details: 'Rest – or – Fun active play', category: 'rest' }
  },
  2: {
    monday: { type: 'fartlek', title: '30min Fartlek', details: '30min: Fartlek – or – hill run\n\nDrills – and/or – strides', category: 'speed' },
    tuesday: { type: 'recovery', title: '20-30min Jog', details: '20-30min: Jog – or – 30min: Cross-train\n\nStrength', category: 'recovery' },
    wednesday: { type: 'aerobic', title: '40-45min Aerobic', details: '40-45 min: Aerobic run\n\nStrides', category: 'aerobic' },
    thursday: { type: 'recovery', title: '20-30min Jog', details: '20-30min: Jog – or – 30min: Cross-train\n\nStrength', category: 'recovery' },
    friday: { type: 'jog', title: '40min Jog', details: '40min: Jog\n\nDrills', category: 'aerobic' },
    saturday: { type: 'tempo', title: '40min Tempo', details: '40min: Tempo run\nGo out easy, finish fast & strong', category: 'tempo' },
    sunday: { type: 'rest', title: 'Rest', details: 'Rest – or – Fun active play', category: 'rest' }
  },
  3: {
    monday: { type: 'hills', title: '45min Hilly Run', details: '45min: Hilly run\nQuicker on the uphills. Practice opening your stride, increasing turnover and relaxing legs on the downhills.\n\nDrills – and/or – strides', category: 'speed' },
    tuesday: { type: 'recovery', title: '20-30min Jog', details: '20-30min: Jog – or – 30min: Cross-train\n\nStrength', category: 'recovery' },
    wednesday: { type: 'aerobic', title: '40-45min Aerobic', details: '40-45min: Aerobic run\n\nStrides', category: 'aerobic' },
    thursday: { type: 'recovery', title: '20-30min Jog', details: '20-30min: Jog – or – 30min: Cross-train\n\nStrength', category: 'recovery' },
    friday: { type: 'jog', title: '40min Jog', details: '40min: Jog\n\nDrills', category: 'aerobic' },
    saturday: { type: 'long', title: '60-70min Long Run', details: '60-70min: Long run', category: 'long' },
    sunday: { type: 'rest', title: 'Rest', details: 'Rest – or – Fun active play', category: 'rest' }
  },
  4: {
    monday: { type: 'intervals', title: '4min Intervals x4', details: '4min intervals X 4\n• 1-2min walk/jog between intervals\n• Goal: 2-3 miles at 10K pace\n\nDrills – and/or – strides', category: 'speed' },
    tuesday: { type: 'recovery', title: '20-30min Jog', details: '20-30min: Jog – or – 30min: Cross-train\n\nStrength', category: 'recovery' },
    wednesday: { type: 'aerobic', title: '45-50min Aerobic', details: '45-50min: Aerobic run\n\nStrides', category: 'aerobic' },
    thursday: { type: 'recovery', title: '20-30min Jog', details: '20-30min: Jog – or – 30min: Cross-train\n\nStrength', category: 'recovery' },
    friday: { type: 'jog', title: '45min Jog', details: '45min: Jog\n\nDrills', category: 'aerobic' },
    saturday: { type: 'tempo', title: '50min Tempo', details: '50min: Tempo run\nGo out easy, finish fast & strong\n\nDrills – and/or – strides', category: 'tempo' },
    sunday: { type: 'rest', title: 'Rest', details: 'Rest – or – Fun active play', category: 'rest' }
  },
  5: {
    monday: { type: 'fartlek', title: '45min Fartlek', details: '45min: Fartlek – or – hill run\n\nDrills – and/or – strides', category: 'speed' },
    tuesday: { type: 'recovery', title: '20-30min Jog', details: '20-30min: Jog – or – 30min: Cross-train\n\nStrength', category: 'recovery' },
    wednesday: { type: 'aerobic', title: '50-55min Aerobic', details: '50-55min: Aerobic run\n\nStrides', category: 'aerobic' },
    thursday: { type: 'recovery', title: '20-30min Jog', details: '20-30min: Jog – or – 30min: Cross-train\n\nStrength', category: 'recovery' },
    friday: { type: 'jog', title: '45min Jog', details: '45min: Jog\n\nDrills', category: 'aerobic' },
    saturday: { type: 'long', title: '90min Long Run', details: '90min: Long run', category: 'long' },
    sunday: { type: 'rest', title: 'Rest', details: 'Rest – or – Fun active play', category: 'rest' }
  },
  6: {
    monday: { type: 'fartlek', title: '50min Fartlek', details: '50min: Fartlek – or – hill run\n\nDrills – and/or – strides', category: 'speed' },
    tuesday: { type: 'recovery', title: '20-30min Jog', details: '20-30min: Jog – or – 30min: Cross-train\n\nStrength', category: 'recovery' },
    wednesday: { type: 'aerobic', title: '40-45min Aerobic', details: '40-45min: Aerobic run\n\nStrides', category: 'aerobic' },
    thursday: { type: 'recovery', title: '20-30min Jog', details: '20-30min: Jog – or – 30min: Cross-train\n\nStrength', category: 'recovery' },
    friday: { type: 'jog', title: '45min Jog', details: '45min: Jog\n\nDrills', category: 'aerobic' },
    saturday: { type: 'tempo', title: '55min Tempo', details: '55min: Tempo run\nGo out easy, finish fast & strong\n\nDrills – and/or – strides', category: 'tempo' },
    sunday: { type: 'rest', title: 'Rest', details: 'Rest – or – Fun active play', category: 'rest' }
  },
  7: {
    monday: { type: 'intervals', title: '5-6min Intervals x4', details: '5-6min intervals X 4\n• 1-2min walk/jog between intervals\n• Goal: approx. 3 miles at 10K pace\n\nDrills – and/or – strides', category: 'speed' },
    tuesday: { type: 'recovery', title: '20-30min Jog', details: '20-30min: Jog – or – 30min: Cross-train\n\nStrength', category: 'recovery' },
    wednesday: { type: 'aerobic', title: '50-55min Aerobic', details: '50-55min: Aerobic run\n\nStrides', category: 'aerobic' },
    thursday: { type: 'recovery', title: '20-30min Jog', details: '20-30min: Jog – or – 30min: Cross-train\n\nStrength', category: 'recovery' },
    friday: { type: 'jog', title: '50min Jog', details: '50min: Jog\n\nDrills', category: 'aerobic' },
    saturday: { type: 'long', title: '100-120min Long Run', details: '100-120min: Long run', category: 'long' },
    sunday: { type: 'rest', title: 'Rest', details: 'Rest – or – Fun active play', category: 'rest' }
  },
  8: {
    monday: { type: 'fartlek', title: '40-45min Fartlek', details: '40-45min: Fartlek – or – hill run\n\nDrills – and/or – strides', category: 'speed' },
    tuesday: { type: 'recovery', title: '20-30min Jog', details: '20-30min: Jog – or – 30min: Cross-train\n\nStrength', category: 'recovery' },
    wednesday: { type: 'aerobic', title: '60min Aerobic', details: '60min: Aerobic run\n\nStrides', category: 'aerobic' },
    thursday: { type: 'recovery', title: '20-30min Jog', details: '20-30min: Jog – or – 30min: Cross-train\n\nStrength', category: 'recovery' },
    friday: { type: 'jog', title: '50min Jog', details: '50min: Jog\n\nDrills', category: 'aerobic' },
    saturday: { type: 'long', title: '60-90min Long Run', details: '60-90min: Long run', category: 'long' },
    sunday: { type: 'rest', title: 'Rest', details: 'Rest – or – Fun active play', category: 'rest' }
  },
  9: {
    monday: { type: 'fartlek', title: '40-45min Fartlek', details: '40-45min: Fartlek – or – hill run\n\nDrills – and/or – strides', category: 'speed' },
    tuesday: { type: 'recovery', title: '20-30min Jog', details: '20-30min: Jog – or – 30min: Cross-train\n\nStrength', category: 'recovery' },
    wednesday: { type: 'aerobic', title: '60min Aerobic', details: '60min: Aerobic run\n\nStrides', category: 'aerobic' },
    thursday: { type: 'recovery', title: '20-30min Jog', details: '20-30min: Jog – or – 30min: Cross-train\n\nStrength', category: 'recovery' },
    friday: { type: 'jog', title: '50min Jog', details: '50min: Jog\n\nDrills', category: 'aerobic' },
    saturday: { type: 'tempo', title: '55min Tempo', details: '55min: Tempo run\nGo out easy, finish fast & strong\n\nDrills – and/or – strides', category: 'tempo' },
    sunday: { type: 'rest', title: 'Rest', details: 'Rest – or – Fun active play', category: 'rest' }
  },
  10: {
    monday: { type: 'intervals', title: '8min Intervals x3', details: '8min intervals X 3\n• Goal: approx. 3 miles at 10K pace\n• 1-2min walk/jog between intervals\n\nDrills – and/or – strides', category: 'speed' },
    tuesday: { type: 'recovery', title: '20-30min Jog', details: '20-30min: Jog – or – 30min: Cross-train\n\nStrength', category: 'recovery' },
    wednesday: { type: 'aerobic', title: '70min Aerobic', details: '70min: Aerobic run\n\nStrides', category: 'aerobic' },
    thursday: { type: 'recovery', title: '20-30min Jog', details: '20-30min: Jog – or – 30min: Cross-train\n\nStrength', category: 'recovery' },
    friday: { type: 'jog', title: '50-60min Jog', details: '50-60min: Jog\n\nDrills', category: 'aerobic' },
    saturday: { type: 'long', title: '100-120min Long Run', details: '100-120min: Long run', category: 'long' },
    sunday: { type: 'rest', title: 'Rest', details: 'Rest – or – Fun active play', category: 'rest' }
  },
  11: {
    monday: { type: 'fartlek', title: '50-55min Fartlek', details: '50-55min: Fartlek – or – hill run\n\nDrills – and/or – Strides', category: 'speed' },
    tuesday: { type: 'recovery', title: '20-30min Jog', details: '20-30min: Jog – or – 30min: Cross-train\n\nStrength', category: 'recovery' },
    wednesday: { type: 'aerobic', title: '70min Aerobic', details: '70min: Aerobic run\n\nStrides', category: 'aerobic' },
    thursday: { type: 'recovery', title: '20-30min Jog', details: '20-30min: Jog – or – 30min: Cross-train\n\nStrength', category: 'recovery' },
    friday: { type: 'jog', title: '50-60min Jog', details: '50-60min: Jog\n\nDrills', category: 'aerobic' },
    saturday: { type: 'tempo', title: '60min Tempo', details: '60min: Tempo run\nGo out easy, finish fast & strong\n\nDrills – and/or – strides', category: 'tempo' },
    sunday: { type: 'rest', title: 'Rest', details: 'Rest – or – Fun active play', category: 'rest' }
  },
  12: {
    monday: { type: 'fartlek', title: '45-50min Fartlek', details: '45-50min: Fartlek – or – hill run\n\nDrills – and/or – Strides', category: 'speed' },
    tuesday: { type: 'recovery', title: '20-30min Jog', details: '20-30min: Jog – or – 30min: Cross-train\n\nStrength', category: 'recovery' },
    wednesday: { type: 'aerobic', title: '60min Aerobic', details: '60min: Aerobic run\n\nStrides', category: 'aerobic' },
    thursday: { type: 'recovery', title: '20-30min Jog', details: '20-30min: Jog – or – 30min: Cross-train\n\nStrength', category: 'recovery' },
    friday: { type: 'jog', title: '50-60min Jog', details: '50-60min: Jog\n\nDrills', category: 'aerobic' },
    saturday: { type: 'long', title: '120min Long Run', details: '120min: Long run', category: 'long' },
    sunday: { type: 'rest', title: 'Rest', details: 'Rest – or – Fun active play', category: 'rest' }
  },
  13: {
    monday: { type: 'intervals', title: '5-6min Intervals x4', details: '5-6min intervals X 4\n• 1-2min walk/jog between intervals\n• Goal: approx. 3 miles at 10K pace\n\nDrills – and/or – strides', category: 'speed' },
    tuesday: { type: 'recovery', title: '20-30min Jog', details: '20-30min: Jog – or – 30min: Cross-train\n\nStrength', category: 'recovery' },
    wednesday: { type: 'aerobic', title: '75min Aerobic', details: '75min: Aerobic run\n\nStrides', category: 'aerobic' },
    thursday: { type: 'recovery', title: '20-30min Jog', details: '20-30min: Jog – or – 30min: Cross-train\n\nStrength', category: 'recovery' },
    friday: { type: 'jog', title: '50-60min Jog', details: '50-60min: Jog\n\nDrills', category: 'aerobic' },
    saturday: { type: 'tempo', title: '55min Tempo', details: '55min: Tempo run\nGo out easy, finish fast and strong\n\nDrills – and/or – strides', category: 'tempo' },
    sunday: { type: 'rest', title: 'Rest', details: 'Rest – or – Fun active play', category: 'rest' }
  },
  14: {
    monday: { type: 'fartlek', title: '45-50min Fartlek', details: '45-50min: Fartlek – or – hill run\n\nDrills – and/or – strides', category: 'speed' },
    tuesday: { type: 'recovery', title: '20-30min Jog', details: '20-30min: Jog – or – 30min: Cross-train\n\nStrength', category: 'recovery' },
    wednesday: { type: 'aerobic', title: '70min Aerobic', details: '70min: Aerobic run\n\nStrides', category: 'aerobic' },
    thursday: { type: 'recovery', title: '20-30min Jog', details: '20-30min: Jog – or – 30min: Cross-train\n\nStrength', category: 'recovery' },
    friday: { type: 'jog', title: '50min Jog', details: '50min: Jog\n\nDrills', category: 'aerobic' },
    saturday: { type: 'long', title: '90min Long Run', details: '90min: Long run', category: 'long' },
    sunday: { type: 'rest', title: 'Rest', details: 'Rest – or – Fun active play', category: 'rest' }
  },
  15: {
    monday: { type: 'fartlek', title: '45-50min Fartlek', details: '45-50min: Fartlek – or – hill run\n\nDrills – and/or – strides', category: 'speed' },
    tuesday: { type: 'recovery', title: '20-30min Jog', details: '20-30min: Jog – or – 30min: Cross-train\n\nStrength', category: 'recovery' },
    wednesday: { type: 'aerobic', title: '45-50min Aerobic', details: '45-50min: Aerobic run\n\nStrides', category: 'aerobic' },
    thursday: { type: 'recovery', title: '20-30min Jog', details: '20-30min: Jog – or – 30min: Cross-train\n\nStrength', category: 'recovery' },
    friday: { type: 'jog', title: '40min Jog', details: '40min: Jog\n\nDrills', category: 'aerobic' },
    saturday: { type: 'tempo', title: '45-50min Tempo', details: '45-50min: Tempo run\nGo out easy, finish fast and strong\n\nDrills – and/or – strides', category: 'tempo' },
    sunday: { type: 'rest', title: 'Rest', details: 'Rest – or – Fun active play', category: 'rest' }
  },
  16: {
    monday: { type: 'intervals', title: '4min Intervals x3', details: '4min intervals X 3\n• 2-3min walk/jog between intervals\n• Stay relaxed, keeping some speed in taper\n\nDrills – and/or – strides', category: 'speed' },
    tuesday: { type: 'recovery', title: '20-30min Jog', details: '20-30min: Jog – or – 30min: Cross-train\n\nStrength', category: 'recovery' },
    wednesday: { type: 'aerobic', title: '30min Aerobic', details: '30min: Aerobic run\n\nStrides', category: 'aerobic' },
    thursday: { type: 'rest', title: 'Rest', details: 'Rest', category: 'rest' },
    friday: { type: 'jog', title: '30min Easy', details: '30min: Easy run\n\nStrides', category: 'aerobic' },
    saturday: { type: 'rest', title: 'Rest', details: 'Rest', category: 'rest' },
    sunday: { type: 'race', title: 'Marathon Day!', details: 'Marathon Day!\n\nYou\'ve trained for this. Trust your preparation and run YOUR race.', category: 'race' }
  }
};

export const categoryColors: Record<WorkoutCategory, { bg: string; light: string; dark: string; tailwind: string }> = {
  speed: { bg: '#ef4444', light: '#fca5a5', dark: '#b91c1c', tailwind: 'bg-red-500' },
  recovery: { bg: '#3b82f6', light: '#93c5fd', dark: '#1e40af', tailwind: 'bg-blue-500' },
  aerobic: { bg: '#10b981', light: '#6ee7b7', dark: '#047857', tailwind: 'bg-emerald-500' },
  tempo: { bg: '#f59e0b', light: '#fcd34d', dark: '#d97706', tailwind: 'bg-amber-500' },
  long: { bg: '#8b5cf6', light: '#c4b5fd', dark: '#6d28d9', tailwind: 'bg-violet-500' },
  rest: { bg: '#6b7280', light: '#d1d5db', dark: '#374151', tailwind: 'bg-gray-500' },
  race: { bg: '#ec4899', light: '#f9a8d4', dark: '#be185d', tailwind: 'bg-pink-500' }
};

export const dayAbbreviations: Record<string, string> = {
  monday: 'M',
  tuesday: 'T', 
  wednesday: 'W',
  thursday: 'T',
  friday: 'F',
  saturday: 'S',
  sunday: 'S'
};

export const dayFullNames: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday'
};
