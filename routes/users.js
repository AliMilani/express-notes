const express = require("express");
const { Users, validate } = require("../modules/users");
const router = express.Router();

router.get("/", async (req, res) => {
    const users = await Users.find().select("-password");
    res.send(users);
});

router.get("/:id", async (req, res) => {
    const user = await Users.findById(req.params.id, {
        password: 0,
    });
    if (!user)
        return res.status(404).send("The user with the given ID was not found.");
    res.send(user);
});

router.post("/", async (req, res) => {
    const { error } = validate.post(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try {
        const user = await Users.create(req.body);
        res.send(await user.save());
    } catch (err) {
        res.status(401).send(err.message);
    }
});

router.put("/:id", async (req, res) => {
    const { error } = validate.put(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try {
        const user = await Users.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!user)
            return res.status(404).send("The user with the given ID was not found.");
        res.send(user);
    } catch (e) {
        res.send(e);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const user = await Users.findByIdAndDelete(req.params.id);
        if (!user)
            return res.status(404).send("The user with the given ID was not found.");
        res.send(user);
    } catch (e) {
        res.send(e);
    }
});

module.exports = router;
