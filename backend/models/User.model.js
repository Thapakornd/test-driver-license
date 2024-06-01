import mongoose,{ Schema} from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    body_test: { type: String },
    theory_test: { type: String },
    practice_test: { type: String },
    status: { type: String, required: true},
}, {
    timestamps: true
}).index({
    "first_name": 'text',
    "last_name": 'text'
})

const User = mongoose.model('User', userSchema);

export default User;