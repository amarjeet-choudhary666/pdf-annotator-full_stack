import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({limit: "16kb", extended: true}))
app.use(cookieParser())

import userRoutes from "./routes/userRoutes";
import pdfRoutes from "./routes/pdfRoutes";
import highlightRoutes from "./routes/highlighRoutes";

app.use("/v1/api/users", userRoutes)
app.use("/v1/api/pdfs", pdfRoutes)
app.use("/v1/api/highlights", highlightRoutes)

app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

export {app};
