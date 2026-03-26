export interface TodoItem {
    _id: string;
    title: string;
    isCompleted: boolean;
    source: string;
    createdAt: string;
}

export async function getTodos(): Promise<{ success: boolean; data: TodoItem[] }> {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");

    const response = await fetch("/api/todo", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    return response.json();
}

export async function createTodo(title: string, source: string = "manual"): Promise<{ success: boolean; data: TodoItem }> {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");

    const response = await fetch("/api/todo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, source })
    });
    return response.json();
}

export async function updateTodo(id: string, updates: Partial<TodoItem>): Promise<{ success: boolean; data: TodoItem }> {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");

    const response = await fetch(`/api/todo/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updates)
    });
    return response.json();
}

export async function deleteTodo(id: string): Promise<{ success: boolean }> {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");

    const response = await fetch(`/api/todo/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    return response.json();
}
