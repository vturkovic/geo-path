const express = require('express')
const Log = require('../models/log')
const auth = require('../middleware/auth')
const router = new express.Router()

//Create log
router.post('/logs', async (req, res) => {
    const log = new Log({
        ...req.body
    })

    try {
        await log.save()
        res.status(201).send(log)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Read all logs
router.get("/logs/all", auth, async (req, res) => {
    Log.find({})
      .then((logs) => {
        res.send(logs);
      })
      .catch((e) => {
        res.status(500).send();
      });
  });

//Read all logs by user id
router.get("/logs/all/:id", auth, async (req, res) => {

    const id = req.params.id
    Log.find({user_id : id})
      .then((logs) => {
        res.send(logs);
      })
      .catch((e) => {
        res.status(500).send();
      });
  });

///Find /roles for user
router.get("/logs/findPostRoles/:id", auth, async (req, res) => {
  const id = req.params.id

  Log.find({user_id : id, method: "GET", path: `/roles/${id}`})
    .then((logs) => {
      res.send(logs);
    })
    .catch((e) => {
      res.status(500).send();
    });
});

///Find created orders for user
router.get("/logs/findPostOrders/:id", auth, async (req, res) => {
  const id = req.params.id

  Log.find({user_id : id, method: "POST", path: `/orders`})
    .then((logs) => {
      res.send(logs);
    })
    .catch((e) => {
      res.status(500).send();
    });
});

///Find updates by user id
router.get("/logs/findUpdates/:id", auth, async (req, res) => {
  const id = req.params.id

  Log.find({user_id : id, method: "PATCH"})
    .then((logs) => {
      res.send(logs);
    })
    .catch((e) => {
      res.status(500).send();
    });
});

module.exports = router;