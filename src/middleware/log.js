const Log = require("../models/log");

const log = async (req, res, next) => {
    try {

    let user_id = req.user.id
    let firstName = req.user.firstName
    let method = req.method
    let path = req.path    

    const log = new Log({ user_id, firstName, method, path });

    try {
        await log.save()
    } catch (e) {
        res.status(400).send(e)
    }

      next();
    } catch (e) {
      res.status(401).send(e);
    }
  };

module.exports = log;