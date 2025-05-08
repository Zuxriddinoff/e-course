import { Schema, model } from "mongoose";

const userSchema = new Schema({
    fullName:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    hashedPassword: { type: String, required: true },
    role:{type:String, enum:['user', 'admin', 'superadmin', 'author'], default:'user', required:true}
    },
    {
        timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
    );
    userSchema.virtual('Enrollment', {
        ref: 'Enrollment',
        localField: '_id',
        foreignField: "user_id",
    });

    userSchema.virtual('Course', {
        ref: 'Course',
        localField: '_id',
        foreignField: "author",
    });
export const User = model('User', userSchema)