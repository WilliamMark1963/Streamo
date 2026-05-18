import multer from 'multer';
import path from 'path';

// 1. SHARED DISK STORAGE ENGINE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // If it's a video file, we can optionally route it to a different directory or keep it in temp
    if (file.fieldname === 'videoFile') {
      cb(null, './uploads/videos'); // Matches static app.use('/uploads/videos') directory setup
    } else if (file.fieldname === 'thumbnailFile') {
      cb(null, './uploads/thumbnails'); // Matches static app.use('/uploads/thumbnails') directory setup
    } else {
      cb(null, './public/temp'); // Fallback for avatars / banners
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// 2. IMAGE ONLY FILTER & INSTANCE (For Avatars / Banners)
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed for this asset slot!'), false);
  }
};

export const upload = multer({ 
    storage: storage,
    fileFilter: imageFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // Strict 2MB restriction for images
});


// 3. VIDEO + THUMBNAIL MULTI-FILTER & INSTANCE (For Video Uploads)
const videoFormFilter = (req, file, cb) => {
  if (file.fieldname === 'videoFile') {
    // Allow standard common streaming video files
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Please upload a valid video format file!'), false);
    }
  } else if (file.fieldname === 'thumbnailFile') {
    // Allow images for the companion thumbnail slot
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Thumbnail must be an image file format!'), false);
    }
  } else {
    cb(null, true);
  }
};

export const uploadVideo = multer({
    storage: storage,
    fileFilter: videoFormFilter,
    limits: { fileSize: 500 * 1024 * 1024 } // Expanded 100MB capacity ceiling to safely capture high-fidelity video streams
});