import { Schema, model } from "mongoose";

const categorySchema = new Schema({
    name:{type:String, required:true},
    description:{type:String, required:true}
},
{
    timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
categorySchema.virtual('Course', {
    ref: 'Course',
    localField: '_id',
    foreignField: "category",
});

export const Category = model('Category', categorySchema)