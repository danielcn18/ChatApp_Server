const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatSchema = new Schema(
    {
        name: {
            type: String,
            default: "",
        },
        members: {
            type: Array,
            required: true,
        },
        type: {
            type: String,
            enum: ["private", "room"],
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Chat", chatSchema);