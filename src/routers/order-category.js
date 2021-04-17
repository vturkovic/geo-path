const express = require('express')
const OrderCategory = require('../models/order-category')
const auth = require('../middleware/auth')
const log = require("../middleware/log");
const Order = require("../models/order");
const router = new express.Router()

//Create order category and save it on orders
router.post('/orderCategory', auth, log, async (req, res) => {

    const orderCategory = new OrderCategory({
        ...req.body,
        owner: req.user._id
    })

    try {

    let order = await Order.findOne({ _id: orderCategory.orderId });

    if(order){
      order.category = order.category.concat(orderCategory._id)
      await order.save()
    }
    
    await orderCategory.save()

    res.status(201).send(orderCategory)

    } catch (e) {
        res.status(400).send(e)
    }
})

//Find all order categories
router.get("/orderCategory", auth, async (req, res) => {

    OrderCategory.find()
      .then((orderCategories) => {
        res.send(orderCategories);
      })
      .catch((e) => {
        res.status(500).send();
      });
  });

//Find all orders category by company id
router.get("/orderCategory/all/:id", auth, async (req, res) => {
  const id = req.params.id

  OrderCategory.find({companyId: id})
    .then((categories) => {
      res.send(categories);
    })
    .catch((e) => {
      res.status(500).send();
    });
});

//Find all orders category by company id that are CONFIRMED
router.get("/orderCategory/allConfirmed/:id", auth, async (req, res) => {
  const id = req.params.id

  OrderCategory.find({companyId: id, confirmed: true})
    .then((categories) => {
      res.send(categories);
    })
    .catch((e) => {
      res.status(500).send();
    });
});

//Find all orders category by company id that are UN CONFIRMED
router.get("/orderCategory/allUnConfirmed/:id", auth, async (req, res) => {
  const id = req.params.id

  OrderCategory.find({companyId: id, confirmed: false})
    .then((categories) => {
      res.send(categories);
    })
    .catch((e) => {
      res.status(500).send();
    });
});


//Get category order by id
router.get('/orderCategory/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const orderCategory = await OrderCategory.findOne({_id})

        if (!orderCategory) {
            return res.status(404).send()
        }

        res.send(orderCategory)
    } catch (e) {
        res.status(500).send()
    }
})

//Update category by id
router.patch('/orderCategoryUpdate/:id', auth, log, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['confirmed']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' })
  }

  try {
      // const order = await Order.findOne({ _id: req.params.id, owner: req.user._id})

      const orderCategory = await OrderCategory.findOne({ _id: req.params.id})

      if (!orderCategory) {
          return res.status(404).send()
      }

      updates.forEach((update) => orderCategory[update] = req.body[update])
      await orderCategory.save()
      res.send(orderCategory)
  } catch (e) {
      res.status(400).send(e)
  }
})

module.exports = router;