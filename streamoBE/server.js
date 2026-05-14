import dotenv from 'dotenv'
dotenv.config();
import server from "./src/app.js"
import { connectDB } from './src/config/db.js';

connectDB().then(()=>{
    const SERVER_PORT = process.env.PORT || "";
    server.listen(SERVER_PORT,()=>{
        console.log("Streamo Server running on Port", SERVER_PORT)
    })
}).catch(err=>{
    console.error("Database connection Failed")
})
