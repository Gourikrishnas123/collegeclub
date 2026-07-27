const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    club: { type: mongoose.Schema.Types.ObjectId, ref: "Club" },
    role: { type: String, default: "Member" },
}, { timestamps: true });

module.exports = mongoose.model("Member", memberSchema);