import { Router } from "express";
import { createTodos, getTodos, updateTodo, deleteTodo } from "../controllers/todo.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/todos").post(verifyJWT, createTodos);
router.route("/todos").get(verifyJWT, getTodos);
router.route("/todos/:id").put(verifyJWT, updateTodo);
router.route("/todos/:id").delete(verifyJWT, deleteTodo);


export default router;