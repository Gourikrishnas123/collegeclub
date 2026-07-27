const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    club: { type: mongoose.Schema.Types.ObjectId, ref: "Club" },
    date: { type: Date, required: true },
    description: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);