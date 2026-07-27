const express = require("express");
const router = express.Router();
const Club = require("../models/Club");

router.get("/", async (req, res) => {
    try {
        const clubs = await Club.find();
        res.json(clubs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const club = new Club(req.body);
        await club.save();
        res.status(201).json(club);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;