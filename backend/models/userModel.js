import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} }
}, {minimize: false}) // Ensures empty objects like cartData are stored in the DB instead of being removed.

const userModel = mongoose.models.user || mongoose.model('user', userSchema); //Prevents redefining the model if it’s already created (important in hot-reload).

export default userModel;