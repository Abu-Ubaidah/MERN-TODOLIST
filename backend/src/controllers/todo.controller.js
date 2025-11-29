import { Todo } from "../models/todo.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

// Create a new Todo
export const createTodos = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { title, priority, description, category, status } = req.body;

  if (!title || !priority || !description || !category) {
    throw new ApiError(400, "All Fields required");
  }

  if (!userId) {
    throw new ApiError(401, "Unauthorized: Access.");
  }

  const newtodo = await Todo.create({
    title,
    priority, 
    description,
    category,
    status: status || "Pending",
    user: userId,
  });

  // Return ONLY the new todo so frontend can append it to the existing list
  res.status(201).json(new ApiResponse(201, newtodo, "ToDo Created Successfully"));
});

// Get all Todos
export const getTodos = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized: Access.");
  }

  const todos = await Todo.find({ user: userId }).sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, todos, "ToDos Fetched Successfully"));
});

// Update a Todo
export const updateTodo = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { id } = req.params;
  const updates = req.body;

  if (!userId) {
    throw new ApiError(401, "Unauthorized: Access.");
  }

  // Find by ID and User 
  const updatedTodo = await Todo.findOneAndUpdate(
    { _id: id, user: userId },
    { $set: updates },
    { new: true } // Return the updated document
  );

  if (!updatedTodo) {
    throw new ApiError(404, "Todo not found or unauthorized");
  }

  res.status(200).json(new ApiResponse(200, updatedTodo, "Todo updated successfully"));
});

// Delete a Todo
export const deleteTodo = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { id } = req.params;

  if (!userId) {
    throw new ApiError(401, "Unauthorized: Access.");
  }

  const deletedTodo = await Todo.findOneAndDelete({ _id: id, user: userId });

  if (!deletedTodo) {
    throw new ApiError(404, "Todo not found or unauthorized");
  }

  res.status(200).json(new ApiResponse(200, {}, "Todo deleted successfully"));
});