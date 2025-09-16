import mongoose from "mongoose";

export const connectDB = async(MongoUri: string) => {
    try {
        const connectionInstances = await mongoose.connect(MongoUri, {
            dbName: "pdf-annotator"
        })
        console.log(`database connnected succesfully✅ to ${connectionInstances.connection.host}`)
    } catch (error: any) {
        console.log("database failed to connect: ", error)
        process.exit(1);
    }
}