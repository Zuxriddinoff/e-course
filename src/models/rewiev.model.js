import { Schema, model } from "mongoose";

const rewievSchema = new Schema({
    user_id:{type:Schema.Types.ObjectId, ref:'User'},
    course_id:{type:Schema.Types.ObjectId, ref:'Course'},
    rating:{type:String, enum:['1', '2', '3', '4', '5']},
    comment:{type:String}
})

export const Rewiev = model('Rewiev', rewievSchema)