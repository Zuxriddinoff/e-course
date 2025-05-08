import { Schema, model } from "mongoose";

const enrollmentSchema = new Schema({
    user_id:{type:Schema.Types.ObjectId, ref:'User'},
    course_id:{type:Schema.Types.ObjectId, ref:'Course'}
},
{
    timestamps:true
})

export const Enrollment = model("Enrollment", enrollmentSchema)