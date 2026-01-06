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
  HeartPulse,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const features = [
  {
    title: "AI Mood Tracking",
    description: "Track your emotional state with our advanced AI model. It analyzes your inputs to provide deep insights into your mood patterns over time.",
    icon: Brain,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    link: "/dashboard"
  },
  {
    title: "Stress Assessment",
    description: "Comprehensive stress monitoring through baseline surveys and daily check-ins. Understand your stress triggers and trends.",
    icon: Activity,
    color: "text-red-500",
    bg: "bg-red-500/10",
    link: "/dashboard"
  },
  {
    title: "Smart Journaling",
    description: "A secure, interactive space to record your thoughts. Features search capabilities to help you reflect on your personal growth journey.",
    icon: Book,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    link: "/dashboard"
  },
  {
    title: "AI Therapy Companion",
    description: "24/7 support from our empathetic AI companion. A safe, judgment-free zone to vent, seek advice, or just chat.",
    icon: MessageSquare,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    link: "/chat"
  },
  {
    title: "Mindfulness Games",
    description: "Engage in calming activities designed to reduce anxiety and promote relaxation instantly.",
    icon: Gamepad2,
    color: "text-green-500",
    bg: "bg-green-500/10",
    link: "/dashboard"
  },
  {
    title: "Analytics & Insights",
    description: "Visual data representation of your mental wellness journey. See your progress with beautiful, easy-to-understand charts.",
    icon: LineChart,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    link: "/dashboard"
  }
];

const games = [
  {
    title: "Breathing Exercises",
    desc: "Guided 4-7-8 breathing technique",
    icon: Wind,
    color: "text-cyan-500"
  },
  {
    title: "Zen Garden",
    desc: "Interactive digital sand garden",
    icon: Trees,
    color: "text-emerald-500"
  },
  {
    title: "Ocean Waves",
    desc: "Soothing visual and audio experience",
    icon: Waves,
    color: "text-blue-400"
  }
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b bg-primary/5 py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold tracking-tight sm:text-6xl mb-6"
            >
              Features designed for your <span className="text-primary">Well-being</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground mb-8"
            >
              Discover a comprehensive suite of tools built to help you understand, manage, and improve your mental health.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link href="/dashboard">
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </Container>
      </div>

      {/* Main Features Grid */}
      <Container className="py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={feature.link}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/10">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${feature.bg} flex items-center justify-center mb-4`}>
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>

      {/* Games Highlight Section */}
      <div className="bg-secondary/30 py-20">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Instant Relief Tools</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Feeling overwhelmed? Our collection of mindfulness games provides immediate grounding and relaxation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {games.map((game, index) => (
              <motion.div
                key={game.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-background rounded-xl p-6 shadow-sm border flex items-center gap-4"
              >
                <div className={`p-3 rounded-full bg-secondary ${game.color}`}>
                  <game.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{game.title}</h3>
                  <p className="text-sm text-muted-foreground">{game.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </div>

      {/* CTA Section */}
      <Container className="py-20">
        <div className="bg-primary text-primary-foreground rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to start your journey?</h2>
            <p className="text-primary-foreground/80 text-lg">
              Join thousands of users who are taking control of their mental well-being today.
            </p>
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="mt-4">
                Create Free Account
              </Button>
            </Link>
          </div>
          
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
        </div>
      </Container>
    </div>
  );
}
