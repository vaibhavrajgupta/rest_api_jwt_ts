import http from "http";
import app from "./app";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./routes"


dotenv.config();
const url = process.env.MONGO_URL;
mongoose.Promise = Promise;

const server = http.createServer(app);
const port = process.env.PORT;

server.listen(port, () => {
	console.log("Server is Running");
});
export const connectToDB = async () => {
	try {
		if (!url) throw new Error("The db url is not correct or not provided");
		const db = mongoose.connect(url);
		console.log("DB is connectd now");
	} catch (error) {
		mongoose.connection.on("error", (error: Error) => console.log(error));
		const errorMessage: string = (error as any)?.message || "Unknown error";
		console.log(errorMessage);
		throw new Error(errorMessage);
	}
};



connectToDB();

app.use("/", router());