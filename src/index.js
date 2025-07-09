import connectDB from "./db/index.js";
import { app } from "./app.js";

const port = process.env.PORT || 3000;

connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.error("Error connecting to the database: ", error);
            throw error;
        });
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => console.error("MongoDB connection failed !!! ", error));

/*
import express from "express";
const app = express();

( async () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error) => {
            console.error("Error connecting to the database: ", error);
            throw error;
        })

        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        })
    }catch(error){
        console.error("Error connecting to database: ", error);
        throw error;
    }
})()
*/
