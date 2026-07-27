const express = require("express");
const router = express.Router();
const Member = require("../models/Member");

router.get("/", async (req, res) => {
    try {
        const filter = req.query.club ? { club: req.query.club } : {};
        const members = await Member.find(filter).populate("club");
        res.json(members);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const member = new Member(req.body);
        await member.save();
        res.status(201).json(member);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;