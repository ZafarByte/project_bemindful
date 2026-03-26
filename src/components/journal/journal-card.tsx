"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, Save, Loader2, History, Sparkles, ArrowLeft, Edit2, BookOpen, PenLine, Lock } from "lucide-react";
import { logActivity, fetchActivities, updateActivity } from "@/lib/api/activity";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface JournalEntry {
  _id: string;
  description: string;
  timestamp: string;
  name: string;
}

const SUGGESTIONS = [
  "I'm feeling grateful for...",
  "Today was challenging because...",
  "I'm proud of myself for...",
  "One thing I learned today...",
  "I want to let go of...",
  "My goal for tomorrow is...",
];

const FEELING_TAGS = [
  "Happy", "Anxious", "Calm", "Tired", "Excited", "Stressed", "Grateful", "Sad"
];

export function JournalCard() {
  const [mode, setMode] = useState<"write" | "search" | "view">("write");
  const [note, setNote] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "encrypting" | "saving">("idle");
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const loadEntries = async () => {
    setLoading(true);
    try {
      const res = await fetchActivities({ 
        type: "journaling", 
        search: searchQuery,
        limit: 20 
      });
      setEntries(res.data);
    } catch (error) {
      console.error("Failed to load entries", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mode === "search") {
      const timer = setTimeout(() => {
        loadEntries();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, mode]);

  const handleSave = async () => {
    if (!note.trim()) return;
    setSaveStatus("encrypting");
    
    // Simulate encryption
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSaveStatus("saving");
    try {
      await logActivity({
        type: "journaling",
        name: "Journal entry",
        description: note.trim(),
      });
      setNote("");
      alert("Note saved!");
    } catch (error) {
      console.error("Failed to save note", error);
      alert("Failed to save note");
    } finally {
      setSaveStatus("idle");
    }
  };

  const handleUpdate = async () => {
    if (!selectedEntry || !note.trim()) return;
    setSaveStatus("encrypting");
    
    // Simulate encryption
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSaveStatus("saving");
    try {
      await updateActivity(selectedEntry._id, {
        description: note.trim(),
      });
      
      // Update local state
      setEntries(prev => prev.map(e => 
        e._id === selectedEntry._id ? { ...e, description: note.trim() } : e
      ));
      setSelectedEntry(prev => prev ? { ...prev, description: note.trim() } : null);
      setIsEditing(false);
      alert("Note updated!");
    } catch (error) {
      console.error("Failed to update note", error);
      alert("Failed to update note");
    } finally {
      setSaveStatus("idle");
    }
  };

  const insertSuggestion = (text: string) => {
    setNote((prev) => (prev ? prev + "\n" + text : text));
  };

  const handleEntryClick = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setNote(entry.description);
    setMode("view");
    setIsEditing(false);
  };

  const handleBack = () => {
    if (mode === "view") {
      setMode("search");
      setSelectedEntry(null);
      setNote("");
    }
  };

  return (
    <Card className="border-primary/10 shadow-sm h-full flex flex-col overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/40 bg-secondary/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {mode === "view" ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 -ml-2 rounded-full hover:bg-background"
                onClick={handleBack}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            ) : (
                <div className="p-2 bg-blue-500/10 rounded-lg">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                </div>
            )}
            <div>
                <CardTitle className="text-lg font-semibold">
                {mode === "view" ? "View Entry" : "Journaling"}
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                {mode === "write" 
                    ? "Capture your thoughts" 
                    : mode === "search"
                    ? "Past reflections"
                    : format(new Date(selectedEntry?.timestamp || new Date()), "MMM d, yyyy · h:mm a")}
                </CardDescription>
            </div>
          </div>
          <div className="flex gap-1 bg-background p-1 rounded-lg border border-border/50">
            {mode !== "view" && (
              <>
                <Button
                  variant={mode === "write" ? "secondary" : "ghost"}
                  size="icon"
                  className={cn("h-7 w-7 rounded-md transition-all", mode === "write" && "bg-primary/10 text-primary hover:bg-primary/20")}
                  onClick={() => setMode("write")}
                  title="Write new note"
                >
                  <PenLine className="h-4 w-4" />
                </Button>
                <Button
                  variant={mode === "search" ? "secondary" : "ghost"}
                  size="icon"
                  className={cn("h-7 w-7 rounded-md transition-all", mode === "search" && "bg-primary/10 text-primary hover:bg-primary/20")}
                  onClick={() => setMode("search")}
                  title="Search history"
                >
                  <History className="h-4 w-4" />
                </Button>
              </>
            )}
            {mode === "view" && !isEditing && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setIsEditing(true)}
                title="Edit note"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3 p-0 relative">
        <AnimatePresence mode="wait">
        {mode === "write" ? (
          <motion.div 
            key="write"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col h-full p-4 gap-3"
          >
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar mask-fade-right">
              {FEELING_TAGS.map((tag) => (
                <Button
                  key={tag}
                  variant="outline"
                  size="xs"
                  className="whitespace-nowrap rounded-full text-[10px] h-6 border-primary/20 hover:border-primary/50 hover:bg-primary/5"
                  onClick={() => insertSuggestion(`I am feeling ${tag.toLowerCase()} because...`)}
                >
                  {tag}
                </Button>
              ))}
            </div>
            
            <textarea
              className="flex-1 w-full resize-none rounded-xl border border-input/50 bg-secondary/5 px-4 py-3 text-sm shadow-inner placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:border-primary/30 transition-all"
              placeholder="Write whatever is on your mind..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium px-1">
                <Sparkles className="h-3 w-3 text-yellow-500" />
                <span>Prompts:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.slice(0, 3).map((s) => (
                  <button
                    key={s}
                    className="text-xs bg-secondary/50 hover:bg-secondary px-3 py-1.5 rounded-lg transition-colors text-left border border-transparent hover:border-border/50"
                    onClick={() => insertSuggestion(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80 px-1">
                <Lock className="h-3 w-3" />
                <span>All your notes are encrypted. Feel free to express yourself.</span>
              </div>
              <Button 
                size="sm" 
                onClick={handleSave} 
                disabled={!note.trim() || saveStatus !== 'idle'}
                className="w-full sm:w-auto rounded-lg shadow-sm"
              >
                {saveStatus === 'encrypting' ? (
                  <>
                    <Lock className="mr-2 h-4 w-4 animate-pulse" />
                    Encrypting...
                  </>
                ) : saveStatus === 'saving' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Note
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        ) : mode === "view" ? (
          <motion.div 
            key="view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col h-full p-4"
          >
            <textarea
              className={cn(
                "flex-1 w-full resize-none rounded-xl border bg-transparent px-4 py-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30 transition-all",
                isEditing ? "border-input bg-secondary/5" : "border-transparent focus-visible:ring-0"
              )}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              readOnly={!isEditing}
            />
            
            {isEditing && (
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                    setNote(selectedEntry?.description || "");
                  }}
                  disabled={saveStatus !== 'idle'}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleUpdate} 
                  disabled={!note.trim() || saveStatus !== 'idle'}
                >
                  {saveStatus === 'encrypting' ? (
                    <>
                      <Lock className="mr-2 h-4 w-4 animate-pulse" />
                      Encrypting...
                    </>
                  ) : saveStatus === 'saving' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="search"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col h-full p-4 gap-4"
          >
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                className="pl-9 rounded-xl bg-secondary/10 border-transparent focus:bg-background focus:border-input transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <ScrollArea className="flex-1 -mx-4 px-4">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : entries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
                  <BookOpen className="h-8 w-8 opacity-20" />
                  <p className="text-sm">{searchQuery ? "No matching notes found" : "No journal history yet"}</p>
                </div>
              ) : (
                <div className="space-y-2 pb-4">
                  {entries.map((entry) => (
                    <motion.div 
                      layoutId={entry._id}
                      key={entry._id} 
                      className="p-3 rounded-xl border border-border/40 bg-card hover:bg-secondary/10 hover:border-primary/20 transition-all cursor-pointer group"
                      onClick={() => handleEntryClick(entry)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                          {format(new Date(entry.timestamp), "MMM d, yyyy · h:mm a")}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/80 line-clamp-3 leading-relaxed">
                        {entry.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </motion.div>
        )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
