"use client";

import { useEffect, useMemo, useState } from "react";
import { getDailyCheckinHistory } from "@/lib/api/stress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { subDays, format, eachDayOfInterval, getDay, isSameDay, differenceInDays, startOfYear, endOfYear } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CheckinPoint = {
  timestamp: string;
  score: number;
};

export function ConsistencyHeatmap() {
  const [data, setData] = useState<CheckinPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Fetch enough history for 3 years (approx 1100 days)
        const res = await getDailyCheckinHistory({ limit: 1100 });
        const points = res.data
          .map((d: any) => ({
            timestamp: d.timestamp,
            score: d.score,
          }))
          .filter((point: CheckinPoint) => point.score != null);
        setData(points);
      } catch (err: any) {
        setError(err.message || "Failed to load check-in history");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stats = useMemo(() => {
    if (!data.length) return { maxStreak: 0, totalActiveDays: 0, currentStreak: 0 };

    // Sort data by date ascending
    const sortedData = [...data].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    // Filter unique days (in case of multiple check-ins per day)
    const uniqueDays = sortedData.filter((item, index, self) => 
      index === 0 || !isSameDay(new Date(item.timestamp), new Date(self[index - 1].timestamp))
    );

    const totalActiveDays = uniqueDays.length;

    let maxStreak = 0;
    let currentStreak = 0;
    let streak = 0;

    for (let i = 0; i < uniqueDays.length; i++) {
      if (i === 0) {
        streak = 1;
      } else {
        const diff = differenceInDays(new Date(uniqueDays[i].timestamp), new Date(uniqueDays[i - 1].timestamp));
        if (diff === 1) {
          streak++;
        } else {
          streak = 1;
        }
      }
      maxStreak = Math.max(maxStreak, streak);
    }

    // Calculate current streak
    const today = new Date();
    const lastCheckin = uniqueDays[uniqueDays.length - 1];
    if (lastCheckin && differenceInDays(today, new Date(lastCheckin.timestamp)) <= 1) {
        // If last checkin was today or yesterday, we might have an active streak
        // We need to walk back from the last checkin
        let tempStreak = 1;
        for (let i = uniqueDays.length - 1; i > 0; i--) {
             const diff = differenceInDays(new Date(uniqueDays[i].timestamp), new Date(uniqueDays[i - 1].timestamp));
             if (diff === 1) {
                 tempStreak++;
             } else {
                 break;
             }
        }
        currentStreak = tempStreak;
    }

    return { maxStreak, totalActiveDays, currentStreak };
  }, [data]);

  const { weeks, monthLabels } = useMemo(() => {
    const startDate = new Date(selectedYear, 0, 1);
    const endDate = new Date(selectedYear, 11, 31);
    
    const days = eachDayOfInterval({
      start: startDate,
      end: endDate,
    });

    const weeks: (Date | null)[][] = [];
    let currentWeek: (Date | null)[] = [];

    // Pad the first week
    const startDayOfWeek = getDay(startDate); // 0 = Sunday
    for (let i = 0; i < startDayOfWeek; i++) {
      currentWeek.push(null);
    }

    days.forEach((day) => {
      if (getDay(day) === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    });
    
    // Pad the last week
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    // Generate month labels and process weeks with gaps
    const monthLabels: { label: string; x: number }[] = [];
    let currentX = 0;
    const GAP_SIZE = 16; // Gap between months (px)
    const WEEK_WIDTH = 12; // 10px cell + 2px gap
    let lastMonth = -1;

    const processedWeeks = weeks.map((week) => {
        const firstDay = week.find(d => d !== null);
        let isNewMonth = false;
        
        if (firstDay) {
            const month = firstDay.getMonth();
            
            if (lastMonth === -1) {
                lastMonth = month;
                monthLabels.push({ label: format(firstDay, "MMM"), x: currentX });
            } else if (month !== lastMonth) {
                isNewMonth = true;
                currentX += GAP_SIZE;
                lastMonth = month;
                monthLabels.push({ label: format(firstDay, "MMM"), x: currentX });
            }
        }
        
        const weekData = { week, isNewMonth };
        currentX += WEEK_WIDTH;
        return weekData;
    });

    return { weeks: processedWeeks, monthLabels };
  }, [selectedYear]);

  const getIntensity = (date: Date) => {
    const checkin = data.find((d) => isSameDay(new Date(d.timestamp), date));
    if (!checkin) return 0;
    return 1; 
  };

  if (loading) {
    return (
      <Card className="w-full h-[200px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full p-6">
        <div className="text-center text-red-500">
          <p>Error loading consistency data</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full border-primary/10 overflow-visible shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CalendarDays className="w-5 h-5 text-primary" />
              </div>
              Check-in Consistency
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Your daily check-in history
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select
              value={selectedYear.toString()}
              onValueChange={(value) => setSelectedYear(parseInt(value))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={currentYear.toString()}>{currentYear}</SelectItem>
                <SelectItem value={(currentYear - 1).toString()}>{currentYear - 1}</SelectItem>
                <SelectItem value={(currentYear - 2).toString()}>{currentYear - 2}</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-4">
              <div className="flex flex-col items-end">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Max Streak</span>
                  <span className="text-xs font-bold text-foreground">{stats.maxStreak} days</span>
              </div>
              <div className="flex flex-col items-end">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Total Active</span>
                  <span className="text-xs font-bold text-foreground">{stats.totalActiveDays} days</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto pb-2 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-primary/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-primary/40">
          <div className="min-w-fit flex flex-col gap-2">
            {/* Month Labels */}
            <div className="flex text-xs text-muted-foreground ml-8 relative h-5">
              {monthLabels.map((month, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${month.x}px`,
                  }}
                >
                  {month.label}
                </div>
              ))}
            </div>

            <div className="flex gap-0.5">
              {/* Day Labels (Mon, Wed, Fri) */}
              <div className="flex flex-col gap-0.5 text-[10px] text-muted-foreground pt-[2px] pr-2">
                <div className="h-[10px]"></div>
                <div className="h-[10px] leading-[10px]">Mon</div>
                <div className="h-[10px]"></div>
                <div className="h-[10px] leading-[10px]">Wed</div>
                <div className="h-[10px]"></div>
                <div className="h-[10px] leading-[10px]">Fri</div>
                <div className="h-[10px]"></div>
              </div>

              {/* Heatmap Grid */}
              <div className="flex gap-0.5">
                {weeks.map((weekData, weekIndex) => (
                  <div 
                    key={weekIndex} 
                    className="flex flex-col gap-0.5"
                    style={{ marginLeft: weekData.isNewMonth ? "16px" : "0" }}
                  >
                    {weekData.week.map((day, dayIndex) => {
                      if (!day) {
                        return <div key={`empty-${dayIndex}`} className="w-[10px] h-[10px]" />;
                      }

                      const intensity = getIntensity(day);
                      const checkin = data.find((d) => isSameDay(new Date(d.timestamp), day));
                      const title = `${format(day, "MMM d, yyyy")}${checkin ? ` - Score: ${checkin.score}` : ""}`;
                      
                      return (
                        <div
                          key={day.toISOString()}
                          title={title}
                          className={cn(
                            "w-[10px] h-[10px] rounded-[1px] transition-colors cursor-default",
                            intensity === 0
                              ? "bg-muted/50"
                              : "bg-primary"
                          )}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground mt-2">
              <span>Less</span>
              <div className="w-[10px] h-[10px] rounded-[1px] bg-muted/50" />
              <div className="w-[10px] h-[10px] rounded-[1px] bg-primary" />
              <span>More</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}