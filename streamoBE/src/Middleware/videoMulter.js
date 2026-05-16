import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Automatically generate asset storage directories if they don't exist
const videoDir = './uploads/videos';
const thumbDir = './uploads/thumbnails';
if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });
if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });

// 1. Storage Engine Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "videoFile") {
            cb(null, videoDir);
        } else if (file.fieldname === "thumbnail") {
            cb(null, thumbDir);
        } else {
            cb(new Error("Unexpected field mapping context"), false);
        }
    },
    filename: (req, file, cb) => {
        // Formulate standard: timestamp-randomInt.extension
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// 2. Structural File Validation Filters
const fileFilter = (req, file, cb) => {
    if (file.fieldname === "videoFile") {
        if (file.mimetype.startsWith("video/")) {
            cb(null, true);
        } else {
            cb(new Error("Invalid format. Please supply a valid video stream binary!"), false);
        }
    } else if (file.fieldname === "thumbnail") {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Invalid format. Thumbnails must be an image type!"), false);
        }
    } else {
        cb(null, false);
    }
};

export const uploadMedia = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024 // Hard limit ceiling capped to 100MB videos
    }
});