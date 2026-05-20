import dotenv from 'dotenv';
dotenv.config();
import express from 'express';

import server from "./src/app.js";
import { connectDB } from './src/config/db.js';
// Import the seeding function
import { seedDatabase } from './src/seed.js'; 

connectDB()
    .then(async () => {
        const SERVER_PORT = process.env.PORT || "8000"; // Fallback to 8000 if PORT isn't set
        
        server.listen(SERVER_PORT, async () => {
            console.log("Streamo Server running on Port", SERVER_PORT);
            
            // Trigger the seeding sequence right after the server starts listening
            await seedDatabase();
        });
    })
    .catch(err => {
        console.error("Database connection Failed:", err);
    });