import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Moon, Smartphone, Brain, ChevronRight, Clock, ArrowRight, Sun, Coffee, Activity } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface Article {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  readTime: string;
  category: string;
  content: React.ReactNode;
}

const articles: Article[] = [
  {
    id: "sleep",
    title: "How to Improve Sleep",
    description: "Discover evident-based strategies to get better rest and wake up refreshed.",
    icon: Moon,
    color: "text-indigo-500",
    readTime: "5 min read",
    category: "Physical Health",
    content: (
        <div className="space-y-4 text-sm leading-relaxed">
            <p>Quality sleep is foundational for mental health. Here are proven strategies to improve your sleep hygiene:</p>
            
            <h4 className="font-semibold text-foreground">1. Stick to a Schedule</h4>
            <p>Go to bed and wake up at the same time every day, even on weekends. This reinforces your body's sleep-wake cycle.</p>
            
            <h4 className="font-semibold text-foreground">2. Create a Restful Environment</h4>
            <p>Keep your room cool, dark, and quiet. Exposure to light in the evenings might make it more challenging to fall asleep. Consider using room-darkening shades, earplugs, or white noise machines.</p>
            
            <h4 className="font-semibold text-foreground">3. Limit Screen Exposure</h4>
            <p>Blue light from phones and computers can interfere with melatonin production. Try a "digital curfew" one hour before bed.</p>

            <h4 className="font-semibold text-foreground">4. Mind What You Eat and Drink</h4>
            <p>Don't go to bed either hungry or stuffed. In particular, avoid heavy or large meals within a couple of hours of bedtime. Nicotine, caffeine, and alcohol deserve caution, too.</p>
        </div>
    )
  },
  {
    id: "detox",
    title: "Social Media Detox",
    description: "Reclaim your time and mental space by setting healthy digital boundaries.",
    icon: Smartphone,
    color: "text-rose-500",
    readTime: "4 min read",
    category: "Digital Wellness",
    content: (
        <div className="space-y-4 text-sm leading-relaxed">
            <p>Constant connectivity can increase anxiety and feelings of inadequacy. A detox can help reset your perspective.</p>
            
            <h4 className="font-semibold text-foreground">Signs You Need a Break</h4>
            <ul className="list-disc pl-5 space-y-1">
                <li>You feel anxious when you can't check your phone.</li>
                <li>You constantly compare your life to others.</li>
                <li>You check your phone immediately upon waking up.</li>
            </ul>

            <h4 className="font-semibold text-foreground">How to Start</h4>
            <p>Start small. Designate tech-free zones in your house (like the bedroom or dining table). Turn off non-essential notifications. Set a specific time limit for social media apps.</p>
            
            <h4 className="font-semibold text-foreground">The Benefits</h4>
            <p>Better sleep, improved focus, deeper real-world connections, and reduced anxiety are common benefits reported after just a week of reduced usage.</p>
        </div>
    )
  },
  {
    id: "stress",
    title: "Stress Management 101",
    description: "Practical tools and techniques to handle daily pressure effectively.",
    icon: Brain,
    color: "text-emerald-500",
    readTime: "6 min read",
    category: "Mental resilience",
    content: (
        <div className="space-y-4 text-sm leading-relaxed">
            <p>Stress is a normal psychological and physical reaction to the demands of life. Managing it is key to maintaining balance.</p>
            
            <h4 className="font-semibold text-foreground">The 4 A's of Stress Management</h4>
            <ul className="space-y-2">
                <li><strong>Avoid:</strong> Learn to say no, avoid people who stress you out, and take control of your environment.</li>
                <li><strong>Alter:</strong> Express your feelings instead of bottling them up. Be willing to compromise.</li>
                <li><strong>Adapt:</strong> Reframe problems. Look at the big picture. Adjust your standards.</li>
                <li><strong>Accept:</strong> Don't try to control the uncontrollable. Look for the upside. Learn to forgive.</li>
            </ul>

            <h4 className="font-semibold text-foreground">Quick Relief Techniques</h4>
            <p>Deep breathing (Box Breathing), progressive muscle relaxation, and a quick walk in nature can reset your stress response in minutes.</p>
        </div>
    )
  },
  {
    id: "mindfulness",
    title: "The Power of Mindfulness",
    description: "Learn how staying present can reduce anxiety and improve cognitive function.",
    icon: Sun,
    color: "text-amber-500",
    readTime: "5 min read",
    category: "Mental Health",
    content: (
        <div className="space-y-4 text-sm leading-relaxed">
            <p>Mindfulness is the practice of purposely focusing your attention on the present moment—and accepting it without judgment.</p>
            
            <h4 className="font-semibold text-foreground">Why It Matters</h4>
            <p>Research confirms that mindfulness practice helps reduce stress, improves memory and focus, and decreases emotional reactivity.</p>
            
            <h4 className="font-semibold text-foreground">Simple Ways to Practice</h4>
            <ul className="list-disc pl-5 space-y-1">
                <li><strong>Mindful Eating:</strong> Pay full attention to the taste, texture, and smell of your food.</li>
                <li><strong>Body Scan:</strong> Mentally scan your body from head to toe, noticing any tension or sensations.</li>
                <li><strong>Mindful Walking:</strong> Focus on the sensation of your feet touching the ground and the rhythm of your breath.</li>
            </ul>
        </div>
    )
  },
  {
    id: "nutrition",
    title: "Mood-Boosting Foods",
    description: "Understand the gut-brain connection and fuel your body for better mental health.",
    icon: Coffee,
    color: "text-orange-500",
    readTime: "4 min read",
    category: "Nutrition",
    content: (
        <div className="space-y-4 text-sm leading-relaxed">
            <p>What you eat directly affects the structure and function of your brain and, ultimately, your mood.</p>
            
            <h4 className="font-semibold text-foreground">Top Foods for Brain Health</h4>
            <ul className="space-y-2">
                <li><strong>Fatty Fish:</strong> Rich in Omega-3s, essential for brain function.</li>
                <li><strong>Fermented Foods:</strong> Yogurt, kimchi, and kombucha support a healthy gut microbiome, which produces most of your serotonin.</li>
                <li><strong>Dark Chocolate:</strong> Contains flavonoids and antioxidants that may boost brain health.</li>
                <li><strong>Berries:</strong> Packed with antioxidants that help reduce inflammation.</li>
            </ul>

            <h4 className="font-semibold text-foreground">Habits to Avoid</h4>
            <p>High sugar diets and processed foods are linked to higher rates of depression and anxiety. Aim for a balanced, whole-food diet.</p>
        </div>
    )
  },
  {
    id: "exercise",
    title: "Moving for Mental Health",
    description: "Why physical activity is one of the most effective tools for emotional well-being.",
    icon: Activity,
    color: "text-blue-500",
    readTime: "5 min read",
    category: "Physical Health",
    content: (
        <div className="space-y-4 text-sm leading-relaxed">
            <p>Exercise isn't just about aerobic capacity and muscle size. Sure, exercise can improve your physical health, but it also has a profound effect on mental well-being.</p>
            
            <h4 className="font-semibold text-foreground">The Chemistry of Happiness</h4>
            <p>Physical activity stimulates the release of endorphins, dopamine, norepinephrine, and serotonin. These brain chemicals play an important part in regulating your mood.</p>
            
            <h4 className="font-semibold text-foreground">How Much Do You Need?</h4>
            <p>You don't need to train for a marathon. 30 minutes of moderate exercise (like brisk walking) three to five times a week can significantly reduce symptoms of depression and anxiety.</p>

            <h4 className="font-semibold text-foreground">Getting Started</h4>
            <p>Find an activity you enjoy. Whether it's dancing, gardening, hiking, or swimming, the best exercise is the one you'll actually do.</p>
        </div>
    )
  }
];

export function WellnessResources() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  return (
    <div className="pt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Wellness Library
        </h2>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
            View All <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {articles.map((article) => (
            <Dialog key={article.id}>
                <DialogTrigger asChild>
                    <Card className="group hover:shadow-md transition-all duration-300 cursor-pointer border-primary/10 hover:border-primary/30 flex flex-col h-full">
                        <CardHeader className="space-y-3 pb-3">
                            <div className="flex items-start justify-between">
                                <div className={`p-2.5 rounded-lg bg-secondary/50 group-hover:bg-background border border-transparent group-hover:border-border/50 transition-colors`}>
                                    <article.icon className={`w-5 h-5 ${article.color}`} />
                                </div>
                                <Badge variant="secondary" className="text-[10px] font-normal opacity-70">
                                    {article.category}
                                </Badge>
                            </div>
                            <div className="space-y-1">
                                <CardTitle className="text-base leading-tight group-hover:text-primary transition-colors">
                                    {article.title}
                                </CardTitle>
                                <CardDescription className="text-xs line-clamp-2">
                                    {article.description}
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="mt-auto pt-0 pb-3">
                            <div className="flex items-center text-[10px] text-muted-foreground font-medium">
                                <Clock className="w-3 h-3 mr-1" />
                                {article.readTime}
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0 pb-3">
                            <div className="text-xs font-medium text-primary flex items-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300">
                                Read Article <ArrowRight className="w-3 h-3 ml-1" />
                            </div>
                        </CardFooter>
                    </Card>
                </DialogTrigger>
                <DialogContent className="max-w-2xl flex flex-col">
                    <DialogHeader>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">{article.category}</Badge>
                            <span className="text-xs text-muted-foreground flex items-center">
                                <Clock className="w-3 h-3 mr-1" /> {article.readTime}
                            </span>
                        </div>
                        <DialogTitle className="text-2xl">{article.title}</DialogTitle>
                        <DialogDescription className="text-base">
                            {article.description}
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[60vh] pr-4 mt-2">
                        <div className="pr-4 pb-8">
                            {article.content}
                        </div>
                    </ScrollArea>
                    <div className="pt-4 border-t flex justify-end">
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        ))}
      </div>
    </div>
  );
}
