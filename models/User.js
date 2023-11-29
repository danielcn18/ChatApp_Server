const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unqiue: true,
        },
        password: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);