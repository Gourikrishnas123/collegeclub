const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    logo: { type: String, default: "🏛️" },
    color: { type: String, default: "from-sky-500 to-indigo-500" },
    points: { type: Number, default: 0 },
    events: { type: Number, default: 0 },
    attendance: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Club", clubSchema);