"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, ListTodo, Loader2, Pencil, Check, X } from "lucide-react";
import { getTodos, createTodo, updateTodo, deleteTodo, TodoItem } from "@/lib/api/todo";
import { cn } from "@/lib/utils";

// Assuming we might use a toast library like sonner or just native alerts for now if not available
// Creating a simple internal toast helper if not present
const toast = {
    error: (msg: string) => console.error(msg),
    success: (msg: string) => console.log(msg)
};

export function TodoList({ className, refreshTrigger, onStatsChange }: { className?: string, refreshTrigger?: number, onStatsChange?: (total: number, completed: number) => void }) {
    const [todos, setTodos] = useState<TodoItem[]>([]);
    const [newItem, setNewItem] = useState("");
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState("");

    useEffect(() => {
        if (onStatsChange) {
            const completed = todos.filter(t => t.isCompleted).length;
            onStatsChange(todos.length, completed);
        }
    }, [todos, onStatsChange]);

    useEffect(() => {
        loadTodos();
    }, [refreshTrigger]);

    const loadTodos = async () => {
        try {
            const res = await getTodos();
            if (res.success) {
                setTodos(res.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!newItem.trim()) return;
        try {
            const res = await createTodo(newItem);
            if (res.success) {
                setTodos([res.data, ...todos]);
                setNewItem("");
            }
        } catch (error) {
            toast.error("Failed to add item");
        }
    };

    const handleToggle = async (id: string, currentStatus: boolean) => {
        try {
            // Optimistic update
            setTodos(todos.map(t => t._id === id ? { ...t, isCompleted: !currentStatus } : t));
            
            await updateTodo(id, { isCompleted: !currentStatus });
        } catch (error) {
            // Revert on error
            setTodos(todos.map(t => t._id === id ? { ...t, isCompleted: currentStatus } : t));
            toast.error("Failed to update status");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            setTodos(todos.filter(t => t._id !== id));
            await deleteTodo(id);
        } catch (error) {
            loadTodos(); 
            toast.error("Failed to delete item");
        }
    };

    const startEditing = (todo: TodoItem) => {
        setEditingId(todo._id);
        setEditText(todo.title);
    };

    const saveEdit = async () => {
        if (!editingId || !editText.trim()) return;
        try {
            // Optimistic update
            setTodos(todos.map(t => t._id === editingId ? { ...t, title: editText } : t));
            
            await updateTodo(editingId, { title: editText });
            setEditingId(null);
            setEditText("");
        } catch (error) {
             toast.error("Failed to update item");
             loadTodos();
        }
    };
    
    const cancelEdit = () => {
        setEditingId(null);
        setEditText("");
    };

    return (
        <Card className={cn("h-full flex flex-col", className)}>
            <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                    <div className="p-2 bg-primary/10 rounded-full">
                        <ListTodo className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                        <CardTitle>My Action Plan</CardTitle>
                        <CardDescription>Break down your goals into small steps</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
                <div className="flex gap-2">
                    <Input 
                        placeholder="Add a new task..." 
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    />
                    <Button size="icon" onClick={handleAdd}>
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                <div className="flex-1 overflow-auto space-y-2 pr-2">
                    {loading ? (
                        <div className="flex justify-center p-4"><Loader2 className="animate-spin w-5 h-5 text-muted-foreground" /></div>
                    ) : todos.length === 0 ? (
                        <div className="text-center text-muted-foreground text-sm py-8 border-2 border-dashed rounded-lg">
                            <p>No tasks yet.</p>
                            <p className="text-xs mt-1">Add actionable steps from your recommendations!</p>
                        </div>
                    ) : (
                        todos.map((todo) => (
                            <div key={todo._id} className={cn("flex items-center gap-3 p-2 rounded-lg border group transition-colors", todo.isCompleted ? "bg-muted/50" : "bg-card")}>
                                {editingId === todo._id ? (
                                    <div className="flex flex-1 items-center gap-2">
                                        <Input
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            className="h-8 text-sm"
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') saveEdit();
                                                if (e.key === 'Escape') cancelEdit();
                                            }}
                                        />
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100" onClick={saveEdit}>
                                            <Check className="w-4 h-4" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={cancelEdit}>
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <Checkbox 
                                            checked={todo.isCompleted} 
                                            onCheckedChange={() => handleToggle(todo._id, todo.isCompleted)}
                                        />
                                        <span className={cn("flex-1 text-sm break-words", todo.isCompleted && "line-through text-muted-foreground")}>
                                            {todo.title}
                                        </span>
                                        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => startEditing(todo)}>
                                                <Pencil className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(todo._id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
