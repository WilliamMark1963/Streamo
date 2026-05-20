// src/seed.js
import mongoose from 'mongoose';
import { User } from './Model/user.model.js';
import { Channel } from './Model/channel.model.js';
import { Video } from './Model/video.model.js';

const sampleVideos = [
    {
        title: "Building a MERN Stack YouTube Clone from Scratch",
        description: "Master full-stack development by building a production-ready video streaming application using MongoDB, Express, React, and Node.js.",
        category: "Web Development",
        videoUrl: "https://www.youtube.com/watch?v=7CqJlxBYj-M", 
        thumbnailUrl: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=600&auto=format&fit=crop",
        views: 12450
    },
    {
        title: "Lo-Fi Beats for Coding and Focus 🎧",
        description: "Chill instrumentals and ambient synth soundscapes designed to optimize concentration, flow state, and deep work programming blocks.",
        category: "Music",
        videoUrl: "https://www.youtube.com/watch?v=oM_OFNmkt5A", 
        thumbnailUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop",
        views: 89300
    },
    {
        title: "Next-Gen Open World RPG Gameplay Review",
        description: "Checking out the graphics optimization, dynamic lighting mechanics, and ray tracing capabilities of the latest game engine update.",
        category: "Gaming",
        videoUrl: "https://www.youtube.com/watch?v=yzwIMG330vY", 
        thumbnailUrl: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=600&auto=format&fit=crop",
        views: 4500
    },
    {
        title: "The Ultimate Guide to Tech Setups in 2026",
        description: "A comprehensive walk-through of modern workspace equipment including minimalist layouts, linear mechanical switches, and professional audio chains.",
        category: "Tech",
        videoUrl: "https://www.youtube.com/watch?v=Pydut1BMlBw", 
        thumbnailUrl: "https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=600&auto=format&fit=crop",
        views: 15600
    },
    {
        title: "Perfect Creamy Mushroom Risotto Tutorial",
        description: "Learn the foundational culinary techniques required to emulsify starch streams into the perfect classic Italian restaurant dish.",
        category: "Cooking",
        videoUrl: "https://www.youtube.com/watch?v=NKtR3KpS83w", 
        thumbnailUrl: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?q=80&w=600&auto=format&fit=crop",
        views: 3100
    },
    {
        title: "AI and the Future of Engineering Pipelines",
        description: "A deep dive podcast discussing how context-aware coding tools alter developer throughput speeds.",
        category: "Podcasts",
        videoUrl: "https://www.youtube.com/watch?v=QQ4UyZNXof8", 
        thumbnailUrl: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=600&auto=format&fit=crop",
        views: 2240
    }
];

export const seedDatabase = async () => {
    try {
        // NOTE: Removed redundant connection command since your main server file handles connection
        console.log("Checking and seeding database entries...");

        // Clear out old data blocks 
        await Video.deleteMany({});

        // Sync Anchor User
        let seedUser = await User.findOne({ email: "creator.seed@streamo.com" });
        if (!seedUser) {
            console.log("Creating default seed user...");
            seedUser = await User.create({
                fullName: "Streamo Creator Core",
                email: "creator.seed@streamo.com",
                password: "Password@123", 
                profilePicture: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            });
        }

        // Sync Anchor Channel
        let seedChannel = await Channel.findOne({ owner: seedUser._id });
        if (!seedChannel) {
            console.log("Creating default seed channel...");
            seedChannel = await Channel.create({
                name: "Streamo HQ",
                handle: "streamohq",
                avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                description: "The official placeholder media account for automated database streaming pools.",
                owner: seedUser._id
            });
            
            seedUser.hasChannel = true;
            await seedUser.save();
        }

        // Write new documents down to MongoDB
        const fullyFormedVideos = sampleVideos.map(video => ({
            ...video,
            channel: seedChannel._id,
            owner: seedUser._id
        }));

        await Video.insertMany(fullyFormedVideos);
        console.log(`Successfully seeded ${fullyFormedVideos.length} videos! 🎉`);

    } catch (error) {
        console.error("Database seeding running cycle failed:", error);
    }
};