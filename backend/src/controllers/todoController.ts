import { Request, Response, NextFunction } from "express";
import { Todo } from "../models/Todo";

export const getTodos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const todos = await Todo.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: todos });
    } catch (error) {
        next(error);
    }
};

export const createTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const { title, source } = req.body;
        
        const todo = new Todo({
            userId,
            title,
            source
        });
        await todo.save();
        res.status(201).json({ success: true, data: todo });
    } catch (error) {
        next(error);
    }
};

export const updateTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const updates = req.body;

        const todo = await Todo.findOneAndUpdate(
            { _id: id, userId },
            updates,
            { new: true }
        );

        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        res.status(200).json({ success: true, data: todo });
    } catch (error) {
        next(error);
    }
};

export const deleteTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const todo = await Todo.findOneAndDelete({ _id: id, userId });

        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        res.status(200).json({ success: true, data: { message: "Todo deleted" } });
    } catch (error) {
        next(error);
    }
};
