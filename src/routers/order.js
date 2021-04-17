const express = require('express')
const Order = require('../models/order')
const auth = require('../middleware/auth')
const log = require("../middleware/log");
const Company = require("../models/company");
const router = new express.Router()

//Create order and save it on comapnies
router.post('/orders', auth, log, async (req, res) => {

    const order = new Order({
        ...req.body,
        owner: req.user._id
    })

    try {

    let company = await Company.findOne({ name: order.company });
    company.orders = company.orders.concat({order})
    await company.save()

    await order.save()

    res.status(201).send(order)

    } catch (e) {
        res.status(400).send(e)
    }
})

//Find all orders by company name
router.post("/orders/findAll", auth, async (req, res) => {
    try {
        const order = await Order.find(
          {company : req.body.company}
      );
    
      if(!order){
        throw new Error();
      }
      
        res.send(order);
      } catch (e) {
        res.status(400).send();
      }
  });

//Find all orders unprocessed by company name
router.post("/orders/findAllUnprocessed", auth, async (req, res) => {
  try {
      const order = await Order.find(
        {company : req.body.company, processed: false}
    );
  
    if(!order){
      throw new Error();
    }
    
      res.send(order);
    } catch (e) {
      res.status(400).send();
    }
});

//Find all orders by user id
router.get("/orders/:id", auth, async (req, res) => {
    const id = req.params.id

    Order.find({owner: id})
      .then((orders) => {
        res.send(orders);
      })
      .catch((e) => {
        res.status(500).send();
      });
  });

//Find all uncompleted orders 
router.post("/ordersAll", auth, async (req, res) => {

    Order.find({company: req.body.company, completed: false})
      .then((orders) => {
        res.send(orders);
      })
      .catch((e) => {
        res.status(500).send();
      });
  });

//Find all completed orders 
router.post("/ordersAllCompleted", auth, async (req, res) => {

  Order.find({company: req.body.company, completed: true})
    .then((orders) => {
      res.send(orders);
    })
    .catch((e) => {
      res.status(500).send();
    });
});

//Get order by id
router.get('/orders/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const order = await Order.findOne({ _id, owner: req.user._id })

        if (!order) {
            return res.status(404).send()
        }

        res.send(order)
    } catch (e) {
        res.status(500).send()
    }
})

//Get order by id of order
router.get('/ordersOne/:id', auth, async (req, res) => {
  const _id = req.params.id

  try {
      const order = await Order.findOne({_id})

      if (!order) {
          return res.status(404).send()
      }

      res.send(order)
  } catch (e) {
      res.status(500).send()
  }
})

//Update order by id
router.patch('/orders/:id', auth, log, async (req, res) => {
    const updates = Object.keys(req.body)
    // const allowedUpdates = ['description', 'completed']
    const allowedUpdates = ['completed','processed','unsuccessful']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        // const order = await Order.findOne({ _id: req.params.id, owner: req.user._id})

        const order = await Order.findOne({ _id: req.params.id})

        if (!order) {
            return res.status(404).send()
        }

        updates.forEach((update) => order[update] = req.body[update])
        await order.save()
        res.send(order)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Delete order by id
router.delete('/orders/:id', auth, log, async (req, res) => {
    try {
        const order = await Order.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!order) {
            res.status(404).send()
        }

        res.send(order)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router;