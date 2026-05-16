import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Channel name is required'],
        trim: true,
        minlength: [3, 'Channel name must be at least 3 characters']
    },
    handle: {
        type: String,
        required: [true, 'Handle is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[a-z0-9._]+$/, 'Handle can only contain letters, numbers, dots, and underscores']
    },
    description: {
        type: String,
        default: ""
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    avatar: { 
        type: String, 
        default: "" 
    },
    banner: {
        type: String,
        default: ""
    },
    subscribersCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export const Channel = mongoose.model('Channel', channelSchema);