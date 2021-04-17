const express = require('express')
const Role = require('../models/role')
const auth = require('../middleware/auth')
const log = require("../middleware/log");
const router = new express.Router()

//Create role
router.post('/roles', auth, log, async (req, res) => {
    const role = new Role({
        ...req.body,
        owner: req.user._id
    })

    try {
        await role.save()
        res.status(201).send(role)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Create role for driver
router.post('/roles/driver/:id', auth, log, async (req, res) => {
    const id = req.params._id;

    const role = new Role({
        ...req.body,
        owner: req.params.id
    })

    try {
        await role.save()
        res.status(201).send(role)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Find role by user
router.get('/roles/:id', auth, log, async (req, res) => {
    const owner = req.params.id

    try {
        const role = await Role.findOne({ owner})

        if (!role) {
            return res.status(404).send()
        }

        res.send(role)
    } catch (e) {
        res.status(500).send()
    }
})

//Find role by user and update
router.patch('/roles/:id', auth, log, async (req, res) => {
    const owner = req.params.id;

    const updates = Object.keys(req.body)
    const allowedUpdates = ['role']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const role = await Role.findOne({owner})

        if (!role) {
            return res.status(404).send()
        }

        updates.forEach((update) => role[update] = req.body[update])
        await role.save()
        res.send(role)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router;