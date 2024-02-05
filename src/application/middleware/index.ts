import { getUserBySessionToken } from "../../application/controllers/users/userController";
import express from "express";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
// import { get, merge } from "lodash";
// import {SECRET_KEY} from process.env;
import { expressjwt, Request as JWTRequest } from "express-jwt";

declare global {
	namespace Express {
		interface Request {
			userId?: string; // Define userId property in Request interface
		}
	}
}

export const isAuthenticated = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const authorizationHeader = req.headers.authorization;
	if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
		return res.status(401).json({ error: "Unauthorized" });
	}
	const auth_token = authorizationHeader.split(" ")[1];

	if (!auth_token) return res.status(401).json({ error: "Access denied" });
	try {
		const { userId } = jwt.verify(
			auth_token,
			process.env.SECRET_KEY
		) as JwtPayload;
		req.userId = userId;
		console.log(userId);
		return next();
	} catch (error) {
		res.status(401).json({ error: "Invalid token" });
	}
};

export const isOwner = async (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	try {
		const { id } = req.params;
		const currentUserId = req.userId;
		console.log(id, currentUserId);
		if (!currentUserId) return res.sendStatus(403);
		if (currentUserId.toString() !== id) return res.sendStatus(403);
		next();
	} catch (error) {
		console.log(error);
		return res.sendStatus(400);
	}
};
