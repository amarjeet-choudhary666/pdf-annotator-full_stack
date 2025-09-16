"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const { v4: uuidv4 } = require('uuid');
const storage = multer_1.default.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (_req, file, cb) {
        const uniqueSuffix = uuidv4() + path_1.default.extname(file.originalname);
        cb(null, uniqueSuffix);
    }
});
const upload = (0, multer_1.default)({ storage });
exports.default = upload;
//# sourceMappingURL=upload.js.map