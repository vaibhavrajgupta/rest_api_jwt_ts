import { UserModel } from "../../../domain/models/users/userModel";
import express from "express";

export const getUsers = () => UserModel.find();

export const getUserByEmail = (email: string) => UserModel.findOne({ email });

export const getUserBySessionToken = (sessionToken: string) =>
	UserModel.findOne({
		"authentication.sessionToken": sessionToken,
	});

export const getUserById = (id: string) => UserModel.findById(id);

export const deleteUserById = (id: string) =>
	UserModel.findByIdAndDelete({ _id: id });

export const updateUserById = (id: string, values: Record<string, any>) =>
	UserModel.findByIdAndUpdate(id, values);

export const createUser = (values: Record<string, any>) =>
	new UserModel(values).save().then((user) => user.toObject());

export const getAllUsers = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const users = await getUsers();
		return res.status(200).json(users);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

export const deleteUser = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { id } = req.params;
		const deletedUser = await deleteUserById(id);
		return res.json(deletedUser);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

export const updateUser = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { username } = req.body;
		const { id } = req.params;
		if (!username) res.sendStatus(400);

		const user = await getUserById(id);
		user.username = username;
		await user.save();

		return res.status(200).json(user).end();
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};
