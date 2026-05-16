import express from 'express';
import userRoutes from './Routes/user.routes.js'
import cors from 'cors';
import channelRouter from './Routes/channel.routes.js'
import videoRouter from "./Routes/video.route.js"

const app = new express()


app.use(cors({
    origin: 'http://localhost:5173', // Allow your React app
    credentials: true,               // Allow cookies/headers
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json())
app.use('/public', express.static('public'))



// Authentication Routes
app.use("/", userRoutes)
//Channel Routes
app.use("/", channelRouter)

// Expose internal asset stores globally via relative web path strings
app.use('/uploads/videos', express.static('uploads/videos'));
app.use('/uploads/thumbnails', express.static('uploads/thumbnails'));
// Video upload Routes
app.use("/", videoRouter)

export default app;