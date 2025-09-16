import { app } from "./app";
import dotenv from "dotenv";
import { connectDB } from "./db";
dotenv.config()

const MongoUri = process.env.MONGO_URI

connectDB(MongoUri!)
.then(() => {
    app.listen(process.env.PORT, () => {
    console.log(`server running on port ${process.env.PORT}`)
})
})
.catch((err: any) => {
    console.log("failed to connect to server", err)
})