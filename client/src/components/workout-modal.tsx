import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, RotateCcw, MapPin, Clock, Gauge, Heart, Mountain, Cloud, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Workout, WorkoutCompletion, DayName } from "@shared/schema";
import { categoryColors, dayFullNames } from "@/lib/training-data";
import { cn } from "@/lib/utils";

interface WorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  week: number;
  day: DayName;
  workout: Workout;
  completionData?: WorkoutCompletion;
  onSave: (data: WorkoutCompletion) => void;
}

export function WorkoutModal({
  isOpen,
  onClose,
  week,
  day,
  workout,
  completionData,
  onSave,
}: WorkoutModalProps) {
  const [formData, setFormData] = useState<Partial<WorkoutCompletion>>({
    status: "incomplete",
    distance: "",
    duration: "",
    pace: "",
    elevation: "",
    heartRate: "",
    effort: 5,
    weather: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (completionData) {
      setFormData(completionData);
    } else {
      setFormData({
        status: "incomplete",
        distance: "",
        duration: "",
        pace: "",
        elevation: "",
        heartRate: "",
        effort: 5,
        weather: "",
        notes: "",
        date: new Date().toISOString().split("T")[0],
      });
    }
  }, [completionData, isOpen]);

  const color = categoryColors[workout.category];

  const handleSave = () => {
    onSave({
      week,
      day,
      status: formData.status || "incomplete",
      distance: formData.distance,
      duration: formData.duration,
      pace: formData.pace,
      elevation: formData.elevation,
      heartRate: formData.heartRate,
      effort: formData.effort,
      weather: formData.weather,
      notes: formData.notes,
      date: formData.date,
      completedAt: formData.completedAt,
    });
    onClose();
  };

  const handleMarkComplete = () => {
    const updatedData: WorkoutCompletion = {
      ...formData,
      week,
      day,
      status: "complete",
      completedAt: new Date().toISOString(),
    };
    onSave(updatedData);
    onClose();
  };

  const handleMarkIncomplete = () => {
    setFormData((prev) => ({
      ...prev,
      status: "incomplete",
      completedAt: undefined,
    }));
  };

  const isComplete = formData.status === "complete";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-card-border">
        <DialogHeader className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  className="text-white border-0"
                  style={{ backgroundColor: color.bg }}
                >
                  {workout.category.charAt(0).toUpperCase() + workout.category.slice(1)}
                </Badge>
                {isComplete && (
                  <Badge variant="outline" className="text-green-500 border-green-500">
                    <Check className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-xl sm:text-2xl font-display font-bold">
                Week {week} — {dayFullNames[day]}
              </DialogTitle>
              <p
                className="text-lg font-semibold"
                style={{ color: color.bg }}
              >
                {workout.title}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="p-4 rounded-md bg-muted/50 border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">
              Workout Details
            </h3>
            <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed">
              {workout.details}
            </pre>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Track Your Run
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  Distance (miles)
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={formData.distance || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, distance: e.target.value })
                  }
                  data-testid="input-distance"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  Duration (min)
                </Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.duration || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  data-testid="input-duration"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-muted-foreground">
                  <Gauge className="w-4 h-4" />
                  Avg Pace (min/mi)
                </Label>
                <Input
                  type="text"
                  placeholder="8:30"
                  value={formData.pace || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, pace: e.target.value })
                  }
                  data-testid="input-pace"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-muted-foreground">
                  <Heart className="w-4 h-4" />
                  Avg Heart Rate
                </Label>
                <Input
                  type="number"
                  placeholder="145"
                  value={formData.heartRate || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, heartRate: e.target.value })
                  }
                  data-testid="input-heart-rate"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-muted-foreground">
                  <Mountain className="w-4 h-4" />
                  Elevation (ft)
                </Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.elevation || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, elevation: e.target.value })
                  }
                  data-testid="input-elevation"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-muted-foreground">
                  <Cloud className="w-4 h-4" />
                  Weather
                </Label>
                <Input
                  type="text"
                  placeholder="Sunny, 65°F"
                  value={formData.weather || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, weather: e.target.value })
                  }
                  data-testid="input-weather"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-muted-foreground">
                Effort Level: {formData.effort}/10
              </Label>
              <Slider
                value={[formData.effort || 5]}
                onValueChange={([value]) =>
                  setFormData({ ...formData, effort: value })
                }
                min={1}
                max={10}
                step={1}
                className="w-full"
                data-testid="slider-effort"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Easy</span>
                <span>Moderate</span>
                <span>Hard</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <FileText className="w-4 h-4" />
                Notes
              </Label>
              <Textarea
                placeholder="How did it feel? Any observations..."
                value={formData.notes || ""}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="resize-none"
                rows={3}
                data-testid="input-notes"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            {isComplete ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleMarkIncomplete}
                  className="flex-1"
                  data-testid="button-mark-incomplete"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Mark Incomplete
                </Button>
                <Button onClick={handleSave} className="flex-1" data-testid="button-save">
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={handleSave}
                  className="flex-1"
                  data-testid="button-save-progress"
                >
                  Save Progress
                </Button>
                <Button
                  onClick={handleMarkComplete}
                  className="flex-1"
                  style={{ backgroundColor: color.bg }}
                  data-testid="button-mark-complete"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Mark Complete
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
