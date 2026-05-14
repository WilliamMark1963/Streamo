import express from 'express';

const app = new express()

app.use(express.json())

//A simple Grt
app.get("/streamo",(req,res)=>{
res.send({message:"Welcome To Streamo Platform"})
})

export default app;