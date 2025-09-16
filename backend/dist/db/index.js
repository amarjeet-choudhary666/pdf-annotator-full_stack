"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async (MongoUri) => {
    try {
        const connectionInstances = await mongoose_1.default.connect(MongoUri, {
            dbName: "pdf-annotator"
        });
        console.log(`database connnected succesfully✅ to ${connectionInstances.connection.host}`);
    }
    catch (error) {
        console.log("database failed to connect: ", error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=index.js.map