
import mongoose from "mongoose"

export const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.DB_URL as string)
        console.log("Connect the database successfully")
    }catch (e){
        console.log("database connecting err >> ",e)
    }
}
