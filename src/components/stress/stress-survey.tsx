"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  baselineItems,
  dailyItems,
  SliderItem,
  scoreBaseline,
  scoreDaily,
} from "@/lib/stress-questions";

type Props = {
  mode: "baseline" | "daily";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: {
    answers: Record<string, any>;
    baselineScore?: number;
    dailyScore?: number;
  }) => Promise<void> | void;
  initialData?: Record<string, any>;
};

const getDefaultValue = (item: SliderItem) => {
  if (item.type === "number") return "";
  if (item.type === "select") return "";
  if (item.options?.length) {
    const midIndex = Math.floor(item.options.length / 2);
    return item.options[midIndex].value;
  }
  return 2;
};

const makeDefaultAnswers = (items: SliderItem[]) =>
  Object.fromEntries(items.map((item) => [item.id, getDefaultValue(item)]));

const findLabel = (item: SliderItem, value: number | string) =>
  item.options?.find((opt) => opt.value === value)?.label;

export function StressSurveyModal({ mode, open, onOpenChange, onSubmit, initialData }: Props) {
  const items = useMemo(() => (mode === "baseline" ? baselineItems : dailyItems), [mode]);
  const [answers, setAnswers] = useState<Record<string, any>>(makeDefaultAnswers(items));
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setAnswers((prev) => ({
        ...makeDefaultAnswers(items),
        ...initialData,
      }));
    } else {
      setAnswers(makeDefaultAnswers(items));
    }
  }, [items, initialData]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (mode === "baseline") {
        const baselineScore = scoreBaseline(answers);
        await onSubmit({ answers, baselineScore });
      } else {
        const dailyScore = scoreDaily(answers);
        await onSubmit({ answers, dailyScore });
      }
      setAnswers(makeDefaultAnswers(items));
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "baseline" ? "Build your baseline" : "Daily check-in"}
          </DialogTitle>
          <DialogDescription>
            {mode === "baseline"
              ? "15 quick sliders to set your stress/mood baseline."
              : "A 6-question pulse to capture how you feel today."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
          {items.map((item) => (
            <div key={item.id} className="space-y-2 rounded-xl border border-border/40 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium leading-tight">{item.label}</p>
                {item.reverse && (
                  <span className="text-[11px] text-muted-foreground uppercase tracking-wide">
                    Positive high
                  </span>
                )}
              </div>
              <div className="px-2 space-y-1">
                {item.type === "number" ? (
                  <Input
                    type="number"
                    placeholder={item.placeholder}
                    value={answers[item.id] || ""}
                    onChange={(e) =>
                      setAnswers((prev) => ({
                        ...prev,
                        [item.id]: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                ) : item.type === "select" ? (
                  <Select
                    value={answers[item.id]?.toString() || ""}
                    onValueChange={(val) =>
                      setAnswers((prev) => ({
                        ...prev,
                        [item.id]: val,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {item.options?.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value.toString()}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <>
                    <Slider
                      value={[answers[item.id] as number ?? getDefaultValue(item)]}
                      min={item.options?.[0]?.value as number ?? 0}
                      max={
                        item.options?.[item.options.length - 1]?.value as number ??
                        4
                      }
                      step={1}
                      onValueChange={([val]) =>
                        setAnswers((prev) => ({
                          ...prev,
                          [item.id]: val,
                        }))
                      }
                    />
                    {item.options ? (
                      <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                        {item.options.map((opt) => (
                          <span key={opt.value} className="text-center">
                            {opt.label}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                        <span>0</span>
                        <span>1</span>
                        <span>2</span>
                        <span>3</span>
                        <span>4</span>
                      </div>
                    )}
                    {findLabel(item, answers[item.id] as number) && (
                      <p className="text-[11px] text-primary">
                        Selected: {findLabel(item, answers[item.id] as number)}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        <Button className="w-full" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Saving..." : "Save"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

