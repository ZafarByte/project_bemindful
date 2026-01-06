"use client";

import { useEffect, useMemo, useState } from "react";
import { getDailyCheckinHistory } from "@/lib/api/stress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type MoodPoint = {
  timestamp: string;
  score: number;
};

type TimeRange = 7 | 14 | 30;

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const formatDateShort = (iso: string) =>
  new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
  });

export function MoodTrend() {
  const [data, setData] = useState<MoodPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>(7);
  const [hover, setHover] = useState<{
    x: number;
    y: number;
    point: MoodPoint;
  } | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getDailyCheckinHistory({ limit: timeRange });
        const points = res.data
          .map((d: any) => ({
            timestamp: d.timestamp,
            score: d.score,
          }))
          .filter((point: MoodPoint) => point.score != null && !isNaN(point.score))
          .reverse();
        setData(points);
      } catch (err: any) {
        setError(err.message || "Failed to load mood score history");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [timeRange]);

  const { pathD, areaD, points } = useMemo(() => {
    if (!data.length) return { pathD: "", areaD: "", points: [] };

    const width = 1000; // Internal SVG coordinate space
    const height = 400;
    const padding = 20;
    const graphHeight = height - padding * 2;
    const graphWidth = width - padding * 2;

    const maxScore = 100;
    
    const calculatedPoints = data.map((point, idx) => {
      const x = padding + (idx / Math.max(data.length - 1, 1)) * graphWidth;
      const y = height - padding - (point.score / maxScore) * graphHeight;
      return { x, y, ...point };
    });

    // Generate smooth path using Catmull-Rom spline algorithm
    let d = "";
    if (calculatedPoints.length > 1) {
      d = `M ${calculatedPoints[0].x} ${calculatedPoints[0].y}`;
      for (let i = 0; i < calculatedPoints.length - 1; i++) {
        const p0 = calculatedPoints[i === 0 ? 0 : i - 1];
        const p1 = calculatedPoints[i];
        const p2 = calculatedPoints[i + 1];
        const p3 = calculatedPoints[i + 2] || p2;

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;

        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
      }
    } else if (calculatedPoints.length === 1) {
        // If only one point, draw a small line or just rely on the dot
        d = `M ${calculatedPoints[0].x} ${calculatedPoints[0].y} L ${calculatedPoints[0].x + 1} ${calculatedPoints[0].y}`;
    }

    const areaPath = `${d} L ${calculatedPoints[calculatedPoints.length - 1].x} ${height} L ${calculatedPoints[0].x} ${height} Z`;

    return { pathD: d, areaD: areaPath, points: calculatedPoints };
  }, [data]);

  return (
    <Card className="border-primary/10 overflow-visible shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              Mood Trend
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Your emotional wellness over time
            </p>
          </div>
          <div className="flex gap-1 bg-secondary/50 p-1 rounded-lg">
            {[7, 14, 30].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange(range as TimeRange)}
                className={cn(
                  "h-7 px-3 text-xs font-medium transition-all",
                  timeRange === range && "bg-background text-foreground shadow-sm"
                )}
              >
                {range}d
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[250px] flex flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
            <p>Analyzing your patterns...</p>
          </div>
        ) : error ? (
          <div className="h-[250px] flex items-center justify-center text-sm text-destructive bg-destructive/5 rounded-lg">
            {error}
          </div>
        ) : data.length === 0 ? (
          <div className="h-[250px] flex flex-col items-center justify-center gap-3 text-sm text-muted-foreground text-center px-4 bg-secondary/20 rounded-lg border border-dashed">
            <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mb-2 shadow-sm">
              <TrendingUp className="w-8 h-8 opacity-20" />
            </div>
            <div>
              <p className="font-medium text-foreground">No mood data yet</p>
              <p className="text-xs opacity-70 mt-1">Complete your daily check-ins to see your trends here.</p>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-[250px] group">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[100, 75, 50, 25, 0].map((val) => (
                <div key={val} className="w-full border-t border-dashed border-primary/10 flex items-center">
                  <span className="text-[10px] font-medium text-muted-foreground/50 -mt-4 ml-1">{val}%</span>
                </div>
              ))}
            </div>

            <svg
              viewBox="0 0 1000 400"
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="moodGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Area Fill */}
              <motion.path
                d={areaD}
                fill="url(#moodGradient)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />

              {/* Line Path */}
              <motion.path
                d={pathD}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />

              {/* Interactive Points */}
              {points.map((point, idx) => (
                <g key={point.timestamp}>
                  {/* Invisible larger hit area */}
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="20"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHover({ x: point.x, y: point.y, point })}
                    onMouseLeave={() => setHover(null)}
                  />
                  {/* Visible Dot */}
                  <motion.circle
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill="hsl(var(--background))"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 * idx, duration: 0.3 }}
                    className="pointer-events-none"
                  />
                </g>
              ))}
            </svg>

            {/* Tooltip */}
            {hover && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute z-20 pointer-events-none"
                style={{
                  left: `${(hover.x / 1000) * 100}%`,
                  top: `${(hover.y / 400) * 100}%`,
                  transform: "translate(-50%, -100%)",
                  marginTop: "-16px",
                }}
              >
                <div className="bg-popover text-popover-foreground border shadow-xl rounded-xl p-3 text-xs min-w-[140px] flex flex-col gap-1">
                  <div className="flex items-center justify-between border-b pb-1 mb-1 border-border/50">
                    <span className="font-semibold text-primary text-lg">{Math.round(hover.point.score)}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Score</span>
                  </div>
                  <div className="text-muted-foreground font-medium">
                    {formatDateTime(hover.point.timestamp)}
                  </div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-popover border-r border-b"></div>
                </div>
              </motion.div>
            )}
          </div>
        )}
        
        {data.length > 0 && (
            <div className="flex justify-between text-[10px] text-muted-foreground px-2 mt-4 font-medium uppercase tracking-wider">
                <span>{formatDateShort(data[0].timestamp)}</span>
                <span>{formatDateShort(data[data.length - 1].timestamp)}</span>
            </div>
        )}
      </CardContent>
    </Card>
  );
}

