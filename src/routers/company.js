const express = require('express')
const Company = require('../models/company')
const auth = require('../middleware/auth')
const log = require("../middleware/log");
const router = new express.Router()

//Create company
router.post('/companys', auth, log, async (req, res) => {
    const company = new Company({
        ...req.body,
        owner: req.user._id
    })

    try {
        await company.save()
        res.status(201).send(company)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Find All Companies
router.get("/companys", auth, async (req, res) => {
    Company.find({})
      .then((companys) => {
        res.send(companys);
      })
      .catch((e) => {
        res.status(500).send;
      });
  });

//Find Company by id of company
router.get("/companys/findOne/:id", auth, async (req, res) => {
    const id = req.params.id;

    try{
        const company = await Company.findOne({_id:id})

        if(!company){
            return res.status(400).send({ error: 'Nothing found!' })
        }
        res.send(company);

    }catch(e){
        res.status(500).sendM;
    }

  });

//Find Company by User id
router.get("/companys/:id", auth, async (req, res) => {
    const id = req.params.id;

    try{
    const company = await Company.findOne({owner: id})
      
        res.send(company);
      
    }catch(e) {
        res.status(500).send;
      };
  });

//Read All Drivers , Find Company by User id
router.get("/companys/drivers/:id", auth, async (req, res) => {
    const id = req.params.id;

    try{
    const company = await Company.findOne({owner: id})
      
        res.send(company.users);
      
    }catch(e) {
        res.status(500).send;
      };
  });

//Update company by id
router.patch('/companys/:id', auth, log, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['oib','name','address','drivers.driver']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const company = await Company.findOne({ _id: req.params.id, owner: req.user._id})

        if (!company) {
            return res.status(404).send()
        }

        updates.forEach((update) => company[update] = req.body[update])
        await company.save()
        res.send(company)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Delete company by id
router.delete('/companys/:id', auth, log, async (req, res) => {
    try {
        const company = await Company.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!company) {
            res.status(404).send()
        }

        res.send(company)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router;

