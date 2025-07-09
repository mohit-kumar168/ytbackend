import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try{
        const connectionInstence = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`Database connected !! DB Host: ${connectionInstence.connection.host}`)

    }catch(error){
        console.error("Error connecting to database: ", error);
        process.exit(1);
    }
}

export default connectDB;