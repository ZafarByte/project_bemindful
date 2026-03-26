"use client";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Sparkles, MessageSquare, ArrowRight, BrainCircuit, Heart, Activity as ActivityIcon, Brain, Trophy, Loader2, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useSession } from "../../../lib/context/session-context";
import { AnxietyGames } from "../../../components/games/anxiety-games";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { StressSurveyModal } from "@/components/stress/stress-survey";
import { fetchStressSummary, submitBaseline, submitDaily } from "@/lib/api/stress";
import { getMoodHistory, getLatestRecommendations } from "@/lib/api/mood";
import { logActivity as logActivityApi, fetchActivities } from "@/lib/api/activity";
import { getTodos, TodoItem } from "@/lib/api/todo";
import { getAllChatSessions } from "@/lib/api/chat";
import { combinedScore as combineScores, labelScore } from "@/lib/stress-questions";
import { MoodTrend } from "@/components/mood/mood-trend";
import { ConsistencyHeatmap } from "@/components/mood/consistency-heatmap";
import { JournalCard } from "@/components/journal/journal-card";
import { StreakMilestoneModal } from "@/components/ui/streak-milestone-modal";
import { ReportDownloadButton } from "@/components/reports/report-download-button";
import { RecommendationsModal } from "@/components/ui/recommendations-modal";
import { RecommendationCard } from "@/components/dashboard/recommendation-card";
import { WellnessResources } from "@/components/dashboard/wellness-resources";
import { TodoList } from "@/components/todo/todo-list";


interface DailyStats {
    moodScore: number | null;
    completionRate: number;
    mindfulnessCount: number;
    totalActivities: number;
    lastUpdated: Date;
}

// renamed to avoid collision with Activity icon import
interface ActivityItem {
    id: string;
    userId: string | null;
    type: string;
    name: string;
    description: string | null;
    timestamp: Date;
    duration: number | null;
    completed: boolean;
    moodScore: number | null;
    moodNote: string | null;
    createdAt: Date;
    updatedAt: Date;
}

interface StressSummary {
    hasBaseline: boolean;
    baselineScore: number | null;
    baselineCompletedAt: string | null;
    baselineAnswers?: Record<string, any>;
    streak: number;
    latestDaily: {
        dailyScore: number;
        combinedScore: number;
        label: string;
        moodScore: number | null;
        moodType: string | null;
        createdAt: string;
    } | null;
}

import { useCallback } from "react";

export default function DashboardPage() {
    const { checkSession } = useSession();
     const {isAuthenticated,logout,user} = useSession();
    const [currentTime, setCurrentTime] = useState(new Date());
    const router = useRouter();
    const [stressSummary, setStressSummary] = useState<StressSummary | null>(null);
    const [loadingStress, setLoadingStress] = useState(true);
    const [showBaselineModal, setShowBaselineModal] = useState(false);
    const [showDailyModal, setShowDailyModal] = useState(false);
    const [sessionCount, setSessionCount] = useState(0);
    const [activityCount, setActivityCount] = useState(0);
    const [latestMoodScore, setLatestMoodScore] = useState<number | null>(null);
    const [showStreakModal, setShowStreakModal] = useState(false);
    const [streakMilestone, setStreakMilestone] = useState(0);
    const [recommendations, setRecommendations] = useState<string[]>([]);
    const [needsProfessionalHelp, setNeedsProfessionalHelp] = useState(false);
    const [showRecommendationsModal, setShowRecommendationsModal] = useState(false);
    const [todoRefreshTrigger, setTodoRefreshTrigger] = useState(0);
    const [todoStats, setTodoStats] = useState({ total: 0, completed: 0 });

    const handleTodoStatsChange = useCallback((total: number, completed: number) => {
        setTodoStats({ total, completed });
    }, []);

    const isToday = (isoDate: string | null | undefined) => {
        if (!isoDate) return false;
        const target = new Date(isoDate);
        const now = new Date();
        return (
            target.getFullYear() === now.getFullYear() &&
            target.getMonth() === now.getMonth() &&
            target.getDate() === now.getDate()
        );
    };

    useEffect(() => {
        const loadStress = async () => {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            if (!token) {
                setLoadingStress(false);
                return;
            }
            try {
                const [summary, sessions, moodHistory, latestRecs, activitiesRes] = await Promise.all([
                    fetchStressSummary(),
                    getAllChatSessions().catch(() => []),
                    getMoodHistory({ limit: 1 }).catch(() => ({ data: [] })),
                    getLatestRecommendations().catch(() => ({ recommendations: [], needsProfessionalHelp: false })),
                    fetchActivities({ limit: 1 }).catch(() => ({ success: false, data: [], total: 0 }))
                ]);
                
                setStressSummary(summary);
                if (activitiesRes.total !== undefined) {
                    setActivityCount(activitiesRes.total);
                }

                
                if (latestRecs.recommendations && latestRecs.recommendations.length > 0) {
                    setRecommendations(latestRecs.recommendations);
                    setNeedsProfessionalHelp(latestRecs.needsProfessionalHelp);
                }

                const validSessions = sessions.filter(session => {
                    const hasUserMessage = session.messages.some(m => m.role === 'user');
                    const hasAssistantMessage = session.messages.some(m => m.role === 'assistant');
                    return hasUserMessage && hasAssistantMessage;
                });
                setSessionCount(validSessions.length);

                if (moodHistory.data && moodHistory.data.length > 0) {
                    setLatestMoodScore(moodHistory.data[0].score);
                }

                // Check for streak milestones
                const streak = summary?.streak || 0;
                const milestones = [30, 15, 7];
                
                for (const milestone of milestones) {
                    if (streak >= milestone) {
                        const key = `bemindful_streak_milestone_${milestone}`;
                        const hasSeen = localStorage.getItem(key);
                        
                        if (!hasSeen) {
                            setStreakMilestone(milestone);
                            setShowStreakModal(true);
                            localStorage.setItem(key, "true");
                            
                            // Mark lower milestones as seen too, to avoid spamming
                            milestones.filter(m => m < milestone).forEach(m => {
                                localStorage.setItem(`bemindful_streak_milestone_${m}`, "true");
                            });
                            
                            break;
                        }
                    }
                }

                if (!summary.hasBaseline) {
                    setShowBaselineModal(true);
                } else if (!isToday(summary.latestDaily?.createdAt ?? null)) {
                    setShowDailyModal(true);
                }
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoadingStress(false);
            }
        };

        loadStress();
    }, []);
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const combinedValue = stressSummary?.latestDaily?.combinedScore ?? null;
    const baselineScore = stressSummary?.baselineScore ?? null;
    const dailyScore = stressSummary?.latestDaily?.dailyScore ?? null;
    const stressLabel =
        stressSummary?.latestDaily?.label ??
        (stressSummary?.hasBaseline ? "Baseline captured" : "Baseline needed");
    const resolvedMoodScore = combinedValue ?? dailyScore ?? baselineScore ?? null;

    const wellnessStats = useMemo(() => {
        const moodValue = latestMoodScore !== null 
            ? `${Math.round(latestMoodScore)}` 
            : "No data";

        return [
            {
                title: "Mood Score",
                value: moodValue,
                icon: Brain,
                color: "text-purple-500",
                bgColor: "bg-purple-500/10",
                description: "Latest AI Prediction",
            },
            {
                title: "Consistency Streak",
                value: `${stressSummary?.streak ?? 0} days`,
                icon: Flame,
                color: "text-orange-500",
                bgColor: "bg-orange-500/10",
                description: "Consecutive check-ins",
            },
            {
                title: "Completion Rate",
                value: todoStats.total > 0 ? `${Math.round((todoStats.completed / todoStats.total) * 100)}%` : "0%",
                icon: Trophy,
                color: "text-yellow-500",
                bgColor: "bg-yellow-500/10",
                description: "Action Plan completion",
            },
            {
                title: "Therapy Sessions",
                value: `${sessionCount} sessions`,
                icon: Heart,
                color: "text-rose-500",
                bgColor: "bg-rose-500/10",
                description: "Total sessions completed",
            },
            {
                title: "Total Activities",
                value: `${activityCount}`,
                icon: ActivityIcon,
                color: "text-blue-500",
                bgColor: "bg-blue-500/10",
                description: "Mindful Activities done",
            },
        ] as {
            title: string;
            value: string;
            icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
            color: string;
            bgColor: string;
            description: string;
        }[];
    }, [baselineScore, combinedValue, dailyScore, stressSummary?.latestDaily, sessionCount, stressSummary?.streak, activityCount, todoStats]);

    const [dailyStats, setDailyStats] = useState<DailyStats>({
        moodScore: null,
        completionRate: 100,
        mindfulnessCount: 0,
        totalActivities: 0,
        lastUpdated: new Date(),
    });

    // removed insights state as it wasn't used; re-add if you plan to show it
    // const [insights, setInsights] = useState<...>([]);

   const handleStartTherapy = async () => {
  try {
    console.log("Attempting client navigation to /therapy/new");
    await router.push("/therapy/new");
    console.log("router.push resolved — check URL and page render");
  } catch (err) {
    console.error("router.push threw:", err);
    // fallback: force a full page load
    window.location.href = "/therapy/new";
  }
};

    const handleBaselineSubmit = async (payload: { answers: Record<string, any>; baselineScore?: number }) => {
        try {
            const res = await submitBaseline(payload.answers);
            
            // Preserve existing daily check-in if it exists and recalculate combined score
            let latestDaily = stressSummary?.latestDaily ?? null;
            if (latestDaily) {
                const newBaseline = res.baselineScore ?? 0;
                const dailyScore = latestDaily.dailyScore;
                const newCombined = combineScores(newBaseline, dailyScore);
                const newLabel = labelScore(newCombined);
                
                latestDaily = {
                    ...latestDaily,
                    combinedScore: newCombined,
                    label: newLabel
                };
            }

            const updated: StressSummary = {
                hasBaseline: true,
                baselineScore: res.baselineScore,
                baselineCompletedAt: new Date().toISOString(),
                baselineAnswers: payload.answers,
                latestDaily: latestDaily,
            };
            setStressSummary(updated);
            
            // Update mood score from baseline (baselineScore is 0-1, mood score is 0-100)
            if (res.baselineScore !== undefined && res.baselineScore !== null) {
                setLatestMoodScore(res.baselineScore * 100);
            }

            setShowBaselineModal(false);
            
            // Only prompt for daily check-in if not done today
            if (!latestDaily || !isToday(latestDaily.createdAt)) {
                setShowDailyModal(true);
            }
        } catch (error) {
            console.error("Failed to save baseline", error);
        }
    };

    const handleDailySubmit = async (payload: { answers: Record<string, number>; dailyScore?: number }) => {
        try {
            if (!stressSummary?.baselineScore && stressSummary?.baselineScore !== 0) {
                setShowBaselineModal(true);
                return;
            }
            const res = await submitDaily(payload.answers);
            const combined =
                res.combinedScore ??
                combineScores(stressSummary.baselineScore ?? 0, payload.dailyScore ?? 0);
            const label = res.label ?? labelScore(combined);
            const updated: StressSummary = {
                hasBaseline: true,
                baselineScore: res.baselineScore ?? stressSummary.baselineScore ?? 0,
                baselineCompletedAt: stressSummary.baselineCompletedAt,
                latestDaily: {
                    dailyScore: res.dailyScore,
                    combinedScore: combined,
                    label,
                    moodScore: res.moodScore ?? null,
                    moodType: res.moodType ?? null,
                    createdAt: new Date().toISOString(),
                },
            };
            setStressSummary(updated);

            // Update mood score from daily check-in
            if (res.moodScore !== null && res.moodScore !== undefined) {
                setLatestMoodScore(res.moodScore);
            }

            if (res.recommendations && res.recommendations.length > 0) {
                setRecommendations(res.recommendations);
                setNeedsProfessionalHelp(!!res.needsProfessionalHelp);
                setShowRecommendationsModal(true);
            }

            setShowDailyModal(false);
        } catch (error) {
            console.error("Failed to save daily check-in", error);
        }
    };

    const lastMoodLoggedAt =
        stressSummary?.latestDaily?.createdAt ?? stressSummary?.baselineCompletedAt ?? null;

    const QUOTES = [
        "Every moment is a fresh beginning.",
        "Believe you can and you're halfway there.",
        "You are enough just as you are.",
        "One day at a time.",
        "Breathe. It's just a bad day, not a bad life.",
        "Your mental health is a priority.",
        "Small steps every day."
    ];

    const [quoteIndex, setQuoteIndex] = useState(0);
    const [displayedQuote, setDisplayedQuote] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentQuote = QUOTES[quoteIndex];
        const typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && displayedQuote === currentQuote) {
            const timeout = setTimeout(() => setIsDeleting(true), 3000);
            return () => clearTimeout(timeout);
        }

        if (isDeleting && displayedQuote === "") {
            setIsDeleting(false);
            setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
            return;
        }

        const timeout = setTimeout(() => {
            setDisplayedQuote((prev) => {
                if (isDeleting) {
                    return prev.slice(0, -1);
                } else {
                    return currentQuote.slice(0, prev.length + 1);
                }
            });
        }, typeSpeed);

        return () => clearTimeout(timeout);
    }, [displayedQuote, isDeleting, quoteIndex]);

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <Container className="pt-20 pb-8 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-2"
                    >
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Welcome back, <span className="text-primary capitalize">{user?.name || "Friend"}</span>
                        </h1>
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-muted-foreground">
                            <p className="text-sm font-medium">
                                {currentTime.toLocaleDateString("en-US", {
                                    weekday: "long",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                            <span className="hidden md:inline">•</span>
                            <p className="text-sm italic min-h-[20px]">
                                "{displayedQuote}
                                <span className="animate-pulse">|</span>"
                            </p>
                        </div>
                    </motion.div>
                    <ReportDownloadButton />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Main Content (2/3) */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Stats Row */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                            {wellnessStats.map((stat, i) => (
                                <motion.div
                                    key={stat.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Card className="border-primary/10 hover:shadow-md transition-all duration-200 hover:-translate-y-1 h-full">
                                        <CardContent className="p-3 flex flex-col justify-between h-full gap-2">
                                            <div className="flex justify-between items-start">
                                                <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                                                    <stat.icon className={cn("w-4 h-4", stat.color)} />
                                                </div>
                                                {i === 0 && (
                                                    <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-xl font-bold tracking-tight">{stat.value}</p>
                                                <p className="text-[10px] text-muted-foreground font-medium mt-1 leading-tight">{stat.title}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        {/* Mood Trend Graph */}
                        <MoodTrend />

                        {/* Consistency Heatmap */}
                        <ConsistencyHeatmap />

                        {/* Games Section */}
                        <div className="pt-4">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-primary" />
                                Mindfulness Activities
                            </h2>
                            <AnxietyGames />
                        </div>

                        {/* Wellness Resources Section */}
                        <WellnessResources />
                    </div>

                    {/* Right Column: Sidebar (1/3) */}
                    <div className="space-y-8">
                        
                        {/* Stress & Mood Summary */}
                        <Card className="border-primary/10 shadow-sm">
                            <CardHeader className="pb-3 border-b border-border/40 bg-secondary/5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-orange-500/10 rounded-lg">
                                            <ActivityIcon className="w-4 h-4 text-orange-500" />
                                        </div>
                                        <CardTitle className="text-base font-semibold">Stress & Mood Status</CardTitle>
                                    </div>
                                    {stressSummary?.hasBaseline && (
                                        <div className="px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-600 text-[10px] font-medium border border-green-500/20">
                                            Active
                                        </div>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-4">
                                <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl border border-border/50">
                                    <div className="flex items-center gap-2">
                                        <Brain className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground font-medium">Current Status</span>
                                    </div>
                                    <span className="font-semibold text-primary">{stressLabel}</span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 border border-border/50 rounded-xl text-center bg-card hover:bg-secondary/5 transition-colors">
                                        <div className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wider">Baseline</div>
                                        <div className="font-bold text-xl text-foreground">
                                            {baselineScore !== null ? `${Math.round(baselineScore * 100)}%` : "-"}
                                        </div>
                                    </div>
                                    <div className="p-3 border border-border/50 rounded-xl text-center bg-card hover:bg-secondary/5 transition-colors">
                                        <div className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wider">Daily</div>
                                        <div className="font-bold text-xl text-foreground">
                                            {dailyScore !== null ? `${Math.round(dailyScore * 100)}%` : "-"}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-1">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex-1 text-xs h-8 border-primary/20 hover:bg-primary/5 hover:text-primary"
                                        onClick={() => setShowBaselineModal(true)}
                                    >
                                        Update Baseline
                                    </Button>
                                    <Button 
                                        size="sm"
                                        variant="outline" 
                                        className="flex-1 text-xs h-8 border-primary/20 hover:bg-primary/5 hover:text-primary" 
                                        onClick={() => setShowDailyModal(true)}
                                    >
                                        Daily Check-in
                                    </Button>
                                </div>
                                <p className="text-[10px] text-muted-foreground text-center">
                                    Update your baseline according to your changing lifestyle or habit.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Recommendation Card */}
                        <RecommendationCard 
                            recommendations={recommendations} 
                            needsProfessionalHelp={needsProfessionalHelp}
                            onTodoAdded={() => setTodoRefreshTrigger(prev => prev + 1)}
                        />

                        {/* Todo List */}
                        <div className="h-[400px]">
                            <TodoList 
                                refreshTrigger={todoRefreshTrigger} 
                                onStatsChange={handleTodoStatsChange}
                            />
                        </div>
                        
                        {/* Quick Actions Card */}
                        <Card className="border-primary/10 relative overflow-hidden group shadow-md">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent" />
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                                <CardDescription>Start your wellness journey</CardDescription>
                            </CardHeader>
                            <CardContent className="relative space-y-4">
                                <Button
                                    variant="default"
                                    className={cn(
                                        "w-full justify-between items-center p-6 h-auto group/button shadow-lg",
                                        "bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90",
                                        "transition-all duration-200 group-hover:translate-y-[-2px]"
                                    )}
                                    onClick={handleStartTherapy}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                            <MessageSquare className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-semibold text-white text-lg">
                                                Start Therapy
                                            </div>
                                            <div className="text-xs text-white/90">
                                                Chat with AI Companion
                                            </div>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-white opacity-80 group-hover/button:translate-x-1 transition-transform" />
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Journal Widget */}
                        <div className="h-[500px]">
                            <JournalCard />
                        </div>

                    </div>
                </div>
            </Container>

            <StressSurveyModal
                mode="baseline"
                open={showBaselineModal}
                onOpenChange={setShowBaselineModal}
                onSubmit={handleBaselineSubmit}
                initialData={stressSummary?.baselineAnswers}
            />
            <StressSurveyModal
                mode="daily"
                open={showDailyModal}
                onOpenChange={setShowDailyModal}
                onSubmit={handleDailySubmit}
            />

            <StreakMilestoneModal 
                open={showStreakModal} 
                onOpenChange={setShowStreakModal} 
                streak={streakMilestone} 
            />

            <RecommendationsModal
                open={showRecommendationsModal}
                onOpenChange={setShowRecommendationsModal}
                recommendations={recommendations}
            />
        </div>
    );
}
