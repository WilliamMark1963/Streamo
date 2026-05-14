import express from 'express';
import userRoutes from './Routes/user.routes.js'
import cors from 'cors';

const app = new express()


app.use(cors({
    origin: 'http://localhost:5173', // Allow your React app
    credentials: true,               // Allow cookies/headers
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json())

// Authentication Routes
app.use("/", userRoutes)

export default app;