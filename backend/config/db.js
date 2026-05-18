import mongoose from "mongoose";
 export const connectDB = async() =>{

    await mongoose.connect('mongodb+srv://shadhin:shadhin1122@cluster0.a47amar.mongodb.net/Food-ecommerce').then(()=>console.log("Db connected"))

}