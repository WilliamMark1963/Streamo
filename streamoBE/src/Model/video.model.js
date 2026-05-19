import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Video title is required'],
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    videoUrl: {
        type: String,
        required: [true, 'Video file URL reference string is required']
    },
    thumbnailUrl: {
        type: String,
        required: [true, 'Thumbnail image URL reference string is required']
    },
    category: { 
        type: String, 
        required: true, 
        default: "All",
        enum: ["All", "Tech", "Music", "Gaming", "Cooking", "Web Development", "Podcasts"] // Restricts options to valid tags
    },
    duration: {
        type: Number, // Stored in seconds
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel',
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

export const Video = mongoose.model('Video', videoSchema);