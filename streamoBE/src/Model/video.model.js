import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Video title is required"],
        trim: true,
        index: true
    },
    description: {
        type: String,
        trim: true
    },
    videoUrl: {
        type: String,
        required: [true, "Video file path is required"]
    },
    thumbnailUrl: {
        type: String,
        required: [true, "Thumbnail image path is required"]
    },
    views: {
        type: Number,
        default: 0
    },
    channelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel',
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

export const Video = mongoose.model('Video', videoSchema);