import { Schema, model } from "mongoose";

const courseSchema = new Schema({
    title:{type:String},
    description:{type:String},
    price:{type:Number},
    category:{type:Schema.Types.ObjectId, ref:'Category'},
    author:{type:Schema.Types.ObjectId, ref:'User'}
}, 
{
    timestamps: true,
});

export const Course = model("Course", courseSchema)