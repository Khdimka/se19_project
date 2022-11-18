import mongoose from "mongoose";

const targetSchema = new mongoose.Schema({
    name: {type: String, require: true, minlenght: 2, maxlenght: 70},
    author: {type: String, minlenght: 2, maxlenght: 24},
    uid: String,
    isComplete: Boolean,
    data: {type: Date, default: new Date()}
})

const Target = mongoose.model('Target', targetSchema);

export default Target;


