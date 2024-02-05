import express from "express";

import {
	deleteUser,
	getAllUsers,
	updateUser,
} from "../../application/controllers/users/userController";
import { isAuthenticated, isOwner } from "../../application/middleware/index";

export default (router: express.Router) => {
	router.get("/users", isAuthenticated, getAllUsers);
	router.delete("/users/:id", isAuthenticated, isOwner, deleteUser);
	router.patch("/users/:id", isAuthenticated, isOwner, updateUser);
};
