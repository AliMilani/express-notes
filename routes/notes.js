const express = require("express");
const { Notes, validate } = require("../modules/notes");
const router = express.Router();

router.get("/", async (req, res) => {
    const notes = await Notes.find().sort("-updateDate");
    res.send(notes);
});

router.get("/:id", async (req, res) => {
    const note = await Notes.findById(req.params.id);
    if (!note) return res.status(404).send("The note with the given ID was not found.");
    res.send(note);
});

router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try {
        const note = await Notes.create(req.body);
        res.send(await note.save());
    } catch (e) {
        if (getSafe(() => e.keyPattern.primaryLink == 1, false)) {
            console.log(e);
            return res.status(400).send("primaryLink already exists");
        } else {
            console.log(e);
            return res.status(500).send("Internal Server Error");
        }
    }
});

router.put("/:id", async (req, res) => {
    const { error } = validate(req.body, { method: "put" });
    if (error) return res.status(400).send(error);
    try {
        let note = await Notes.findById(req.params.id);
        if (!note)
            return res.status(404).send("The note with the given ID was not found.");
        note.set({ ...req.body, updateDate: Date.now() });
        res.send(await note.save());
    } catch (e) {
        if (getSafe(() => e.keyPattern.primaryLink == 1, false)) {
            console.log(e);
            return res.status(400).send("primaryLink already exists");
        } else {
            console.log(e);
            return res.status(500).send("Internal Server Error: " + e);
        }
    }
});

router.delete("/:id", async (req, res) => {
    const note = await Notes.deleteOne({ _id: req.params.id });
    // console.log(note);
    if (!note.deletedCount)
        return res.status(404).send("The note with the given ID was not found.");
    res.send(note);
});

function getSafe(fn, defaultVal) {
    try {
        return fn();
    } catch (e) {
        return defaultVal;
    }
}

module.exports = router;
