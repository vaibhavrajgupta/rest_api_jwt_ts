import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createUser, getUserByEmail } from "../users/userController";

export const register = async (req: express.Request, res: express.Response) => {
	try {
		const { email, password, username } = req.body;
		if (!email || !username || !password) return res.sendStatus(400);
		const existingUser = await getUserByEmail(email);
		if (existingUser) return res.sendStatus(400);
		const hashedPassword = await bcrypt.hash(password, 11);
		const user = await createUser({
			email,
			username,
			password: hashedPassword,
		});

		const authToken = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
			expiresIn: "1h",
		});

		return res.status(200).json({authToken});
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

export const login = async (req: express.Request, res: express.Response) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) return res.sendStatus(400);

		const user = await getUserByEmail(email);
		if (!email) return res.sendStatus(400);

		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			return res.status(401).json({ error: "Authentication failed" });
		}
		const authToken = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
			expiresIn: "1h",
		});

		// await user.save();
		console.log("Successfully logged innnnn");

		return res.status(200).json({authToken});
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Login failed" });
	}
};
