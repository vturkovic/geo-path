const express = require('express')
const Route = require('../models/route')
const auth = require('../middleware/auth')
const log = require("../middleware/log");
const Company = require("../models/company");
const router = new express.Router()

//Create route and save it on comapnies
router.post('/route', auth, log, async (req, res) => {

    const route = new Route({
        ...req.body,
        owner: req.user._id
    })

    try {

    let company = await Company.findOne({ name: route.company });
    company.routes = company.routes.concat({route})
    await company.save()

    await route.save()

    res.status(201).send(route)

    } catch (e) {
        res.status(400).send(e)
    }
})

//Find all routes by company name
router.post("/route/findAll", auth, async (req, res) => {
    try {
        const route = await Route.find(
          {company : req.body.company}
      );
    
      if(!route){
        throw new Error();
      }
      
        res.send(route);
      } catch (e) {
        res.status(400).send();
      }
  });


//Find all routes by user id of driver
router.get("/route/:id", auth, async (req, res) => {
    const id = req.params.id

    Route.find({driver: id})
      .then((routes) => {
        res.send(routes);
      })
      .catch((e) => {
        res.status(500).send();
      });
  });

//Find all routes by user id of driver that are UNCOMPLETED
router.get("/route/uncompleted/:id", auth, async (req, res) => {
    const id = req.params.id

    Route.find({driver: id, completed: false})
      .then((routes) => {
        res.send(routes);
      })
      .catch((e) => {
        res.status(500).send();
      });
  });

//Find all routes by user id of driver that are completed
router.get("/route/allCompleted/:id", auth, async (req, res) => {
    const id = req.params.id

    Route.find({driver: id, completed: true})
      .then((routes) => {
        res.send(routes);
      })
      .catch((e) => {
        res.status(500).send();
      });
  });

//Get route by id and owner
router.get('/route/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const route = await Route.findOne({ _id, owner: req.user._id })

        if (!route) {
            return res.status(404).send()
        }

        res.send(route)
    } catch (e) {
        res.status(500).send()
    }
})

//Get route by id
router.get('/route/byid/:id', auth, async (req, res) => {
  const _id = req.params.id

  try {
      const route = await Route.findOne({_id})

      if (!route) {
          return res.status(404).send()
      }

      res.send(route)
  } catch (e) {
      res.status(500).send()
  }
})

//Update route by id
router.patch('/route/:id', auth, log, async (req, res) => {
    const updates = Object.keys(req.body)
    // const allowedUpdates = ['description', 'completed']
    const allowedUpdates = ['completed','waypoints','driver','date','startTime','orders']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        // const order = await Order.findOne({ _id: req.params.id, owner: req.user._id})

        const route = await Route.findOne({ _id: req.params.id})

        if (!route) {
            return res.status(404).send()
        }

        updates.forEach((update) => route[update] = req.body[update])
        await route.save()
        res.send(route)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Delete route by id
router.delete('/route/:id', auth, log, async (req, res) => {
    try {
        const route = await Route.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!route) {
            res.status(404).send()
        }

        res.send(route)
    } catch (e) {
        res.status(500).send()
    }
})

//Delete route by only id
router.delete('/routeId/:id', auth, log, async (req, res) => {
  try {
      const route = await Route.findOneAndDelete({ _id: req.params.id})

      if (!route) {
          res.status(404).send()
      }

      res.send(route)
  } catch (e) {
      res.status(500).send()
  }
})

module.exports = router;