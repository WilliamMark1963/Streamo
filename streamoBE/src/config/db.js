import mongoose from "mongoose";

export const connectDB = async ( ) =>{
    try{
        const DB_URL = process.env.MONGODB_URL || " "
            mongoose.connect(DB_URL)
        console.log("Mongo DB Connected ✅")
    }
    catch(error){
          console.error("Database connection Error: ", error.message);
        process.exit(1)
    }
}