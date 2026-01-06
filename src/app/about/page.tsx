"use client";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Shield, 
  Users, 
  Sparkles, 
  Github, 
  Linkedin, 
  Mail 
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b bg-primary/5 py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6"
            >
              <Heart className="w-8 h-8 text-primary fill-primary/20" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold tracking-tight sm:text-6xl mb-6"
            >
              Making mental wellness <span className="text-primary">accessible</span> to everyone
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground mb-8 leading-relaxed"
            >
              BeMindful is more than just an app; it's a companion on your journey to better mental health. 
              Born from a desire to bridge the gap between professional therapy and daily self-care, 
              we provide tools that empower you to understand and improve your emotional well-being.
            </motion.p>
          </div>
        </Container>
      </div>

      {/* Mission & Values */}
      <Container className="py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold">Privacy First</h3>
            <p className="text-muted-foreground">
              Your mental health journey is personal. We employ industry-standard encryption 
              and privacy practices to ensure your data and conversations remain completely confidential.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-xl font-bold">AI-Powered Insights</h3>
            <p className="text-muted-foreground">
              Leveraging cutting-edge machine learning, we help you identify patterns in your mood 
              and stress levels that might otherwise go unnoticed, offering personalized recommendations.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold">For Everyone</h3>
            <p className="text-muted-foreground">
              Whether you're dealing with high stress, anxiety, or just want to maintain a healthy 
              mindset, our tools are designed to be intuitive, accessible, and helpful for all.
            </p>
          </motion.div>
        </div>
      </Container>

      {/* Story Section */}
      <div className="bg-secondary/30 py-20">
        <Container>
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold">Our Story</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                BeMindful started as a Final Year Project with a simple yet ambitious goal: 
                to use technology to make mental health support more immediate and accessible.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Recognizing that not everyone has immediate access to therapy, we built a platform 
                that combines the therapeutic benefits of journaling, mindfulness exercises, and 
                mood tracking with the analytical power of AI.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Today, it stands as a comprehensive toolkit for emotional regulation and self-discovery.
              </p>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-md aspect-square bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-full flex items-center justify-center animate-pulse-gentle">
                <div className="absolute inset-4 bg-background rounded-full flex items-center justify-center shadow-xl">
                   <Heart className="w-32 h-32 text-primary/40" />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Contact / Team Section */}
      <Container className="py-20">
        <div className="text-center max-w-2xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold">Get in Touch</h2>
          <p className="text-muted-foreground">
            Have questions, suggestions, or just want to say hello? We'd love to hear from you.
          </p>
          
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="lg" className="gap-2">
              <Mail className="w-4 h-4" />
              Contact Support
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <Github className="w-4 h-4" />
              View on GitHub
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
