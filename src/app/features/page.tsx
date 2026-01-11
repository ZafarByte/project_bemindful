"use client";

import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Activity, 
  Book, 
  MessageSquare, 
  Wind, 
  Trees, 
  Waves, 
  Gamepad2, 
  LineChart, 
  ArrowRight,
  BookOpen,
  Stethoscope,
  Sparkles,
  Zap,
  Cloud,
  Focus
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const categories = [
  {
    name: "Core Features",
    features: [
      {
        title: "AI Therapy Companion",
        description: "Your 24/7 empathetic support system. Have meaningful conversations, vent safely, and get instant guidance anchored in therapeutic techniques.",
        icon: MessageSquare,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        link: "/chat"
      },
      {
        title: "Smart Mood Tracking",
        description: "Log your emotions daily with our intuitive interface. Our AI analyzes patterns to provide personalized insights into your emotional well-being.",
        icon: Brain,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        link: "/dashboard"
      },
      {
        title: "Stress Management",
        description: "Comprehensive stress assessments including baseline surveys and daily check-ins to monitor your stress levels and triggers.",
        icon: Activity,
        color: "text-red-500",
        bg: "bg-red-500/10",
        link: "/dashboard"
      }
    ]
  },
  {
    name: "Interactive Wellness",
    features: [
      {
        title: "Mindfulness Games",
        description: "A suite of 7+ interactive games designed to reduce anxiety instantly, including Bubble Burst, Zen Garden, and Focus Dots.",
        icon: Gamepad2,
        color: "text-green-500",
        bg: "bg-green-500/10",
        link: "/dashboard"
      },
      {
        title: "Digital Journal",
        description: "A secure, private space to record your thoughts, gratitude, and daily reflections with rich formatting support.",
        icon: Book,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        link: "/dashboard"
      },
      {
        title: "Wellness Library",
        description: "Access a curated collection of articles on sleep hygiene, social media detox, nutrition, and mental resilience.",
        icon: BookOpen,
        color: "text-teal-500",
        bg: "bg-teal-500/10",
        link: "/dashboard"
      }
    ]
  },
  {
    name: "Insights & Professional Care",
    features: [
      {
        title: "Advanced Analytics",
        description: "Visualize your journey with Mood Trend graphs and Consistency Heatmaps to understand your long-term progress.",
        icon: LineChart,
        color: "text-indigo-500",
        bg: "bg-indigo-500/10",
        link: "/dashboard"
      },
      {
        title: "Daily Recommendations",
        description: "Receive personalized, actionable advice every day based on your latest mood and stress check-ins.",
        icon: Sparkles,
        color: "text-yellow-500",
        bg: "bg-yellow-500/10",
        link: "/dashboard"
      },
      {
        title: "Professional Connection",
        description: "Seamlessly connect with qualified psychiatrists and download progress reports to share with your healthcare provider.",
        icon: Stethoscope,
        color: "text-rose-500",
        bg: "bg-rose-500/10",
        link: "/dashboard"
      }
    ]
  }
];

const games = [
  { title: "Breathing", icon: Wind, color: "text-cyan-500" },
  { title: "Zen Garden", icon: Trees, color: "text-emerald-500" },
  { title: "Ocean Waves", icon: Waves, color: "text-blue-400" },
  { title: "Thought Clouds", icon: Cloud, color: "text-sky-400" },
  { title: "Bubble Burst", icon: Zap, color: "text-yellow-400" },
  { title: "Focus Dots", icon: Focus, color: "text-violet-400" },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b bg-primary/5 py-20">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
        <Container>
          <div className="mx-auto max-w-3xl text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-4" variant="outline">Complete Mental Wellness Suite</Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                Everything you need to find your balance
              </h1>
              <p className="text-lg text-muted-foreground mb-8 text-balance">
                BeMindful combines advanced AI technology with proven therapeutic techniques to provide a holistic approach to mental well-being.
              </p>
              <div className="flex justify-center gap-4">
                <Button size="lg" asChild className="rounded-full">
                  <Link href="/dashboard">
                    Get Started <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="rounded-full">
                  <Link href="/about">
                    About Us
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </Container>
      </div>

      {/* Main Features Grid */}
      <div className="py-20">
        <Container>
            {categories.map((category, categoryIndex) => (
                <div key={category.name} className="mb-20 last:mb-0">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="mb-8"
                    >
                        <h2 className="text-2xl font-bold tracking-tight mb-2">{category.name}</h2>
                        <div className="h-1 w-20 bg-primary/20 rounded-full" />
                    </motion.div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {category.features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Link href={feature.link}>
                            <Card className="h-full border-primary/10 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group bg-card/50 backdrop-blur-sm">
                                <CardHeader>
                                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                                </div>
                                <CardTitle className="group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                <CardDescription className="text-base leading-relaxed">
                                    {feature.description}
                                </CardDescription>
                                </CardContent>
                            </Card>
                            </Link>
                        </motion.div>
                        ))}
                    </div>
                </div>
            ))}
        </Container>
      </div>

      {/* Games Preview Section */}
      <div className="py-20 bg-secondary/30 relative border-t">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Interactive Relief Activities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our collection of mindfulness games uses clinically proven techniques to help you reground and reduce anxiety in the moment.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
             {games.map((game, i) => (
                <motion.div
                    key={game.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    viewport={{ once: true }}
                >
                    <div className="bg-background border rounded-xl p-4 flex flex-col items-center justify-center text-center gap-3 hover:border-primary/50 transition-colors h-full">
                        <game.icon className={`w-8 h-8 ${game.color}`} />
                        <span className="font-medium text-sm">{game.title}</span>
                    </div>
                </motion.div>
             ))}
          </div>
        </Container>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <Container>
          <div className="bg-primary rounded-3xl p-8 md:p-16 text-center text-primary-foreground relative overflow-hidden">
             <div className="absolute inset-0 bg-black/10" />
             <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-50" />
             <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-50" />
             
             <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-4">Start Your Wellness Journey Today</h2>
                <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
                    Join thousands of users who have found their balance with BeMindful. It's free to get started.
                </p>
                <Button size="lg" variant="secondary" asChild className="rounded-full font-semibold">
                    <Link href="/signup">
                        Create Free Account
                    </Link>
                </Button>
             </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
