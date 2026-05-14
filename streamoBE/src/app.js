import express from 'express';
import userRoutes from './Routes/user.routes.js'

const app = new express()

app.use(express.json())

//A simple Get
app.get("/streamo",(req,res)=>{
res.send({message:"Welcome To Streamo Platform"})
})

// Authentication Routes
app.use("/", userRoutes)

export default app;