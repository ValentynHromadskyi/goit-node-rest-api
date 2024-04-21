import express from "express";
import { createUserSchema } from "../schemas/usersSchemas.js";
import validateBody from "../helpers/validateBody.js";
import {
  createNewUser,
  currentUser,
  login,
  logout,
} from "../controllers/usersControllers.js";
import { protect } from "../midelwares/authMiddlewares.js";

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(createUserSchema), createNewUser);

usersRouter.post("/login", validateBody(createUserSchema), login);

usersRouter.post("/logout", protect, logout);

usersRouter.get("/current", protect, currentUser);

export default usersRouter;
