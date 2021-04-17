const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/user");
const Company = require("../models/company");
const auth = require("../middleware/auth");
const log = require("../middleware/log");

const { models } = require("mongoose");
const { JsonWebTokenError } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const router = new express.Router();

const {
  sendConfirmationEmail,
  sendCancelationEmail,
  sendNewPassword,
} = require("../emails/account");

///

//Creating account
router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthTokenRegistration();
    sendConfirmationEmail (user.email, user.firstName, token);

    res.status(201).send({ user, token});
  } catch (e) {
    res.status(400).send(e);
  }
});

//Moderator creating driver
router.post("/drivers", async (req, res) => {
  const user = new User(req.body);

  try {
    let company = await Company.findOne({ name: user.worksFor });

    company.users = company.users.concat({user});
    await company.save();


    await user.save();
    const token = await user.generateAuthTokenRegistration();
    sendConfirmationEmail (user.email, user.firstName, token);

    res.status(201).send({ user, token});
  } catch (e) {
    res.status(400).send(e);
  }
});

//Confirmation link with token
router.get("/confirmation/:token", async (req, res) =>{
  try {
    const token = req.params.token;

    const user = await User.findOne({
      "tokens.token": token,
    });

    jwt.verify(token, "jwtsecret");
    await user.updateOne({ confirmed: true});

    res.redirect("/index.html");

  } catch(e){
    res.status(400).send(e);
  }
})

//Login
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    if(!user.confirmed){
      throw new Error("Please confirm your email to login!")
    }

    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

//Logout
router.post("/users/logout", auth, log, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

//Logout all users
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

//Read your account info
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

//Read all users info
router.get("/users", auth, async (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((e) => {
      res.status(500).send();
    });
});

//Read user by id
router.get("/users/:id", (req, res) => {
  const _id = req.params.id;

  User.findById(_id)
    .then((user) => {
      if (!user) {
        return res.status(404).send();
      }
      res.send(user);
    })
    .catch((e) => {
      res.status(500).send();
    });
});

//Update user by id
router.patch("/updateUser/:id", auth, log, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ["firstName", "lastName", "role", "email", "password", "confirmed", "worksFor", "address"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).send();
    }

    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();

    res.send(user);

  } catch (e) {
    res.status(400).send(e);
  }
});

//Update your account
router.patch("/users/me", auth, log, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["firstName", "lastName", "role", "email", "password", "oib", "address", "firstLogin", "worksFor", "address"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

//Delete your account
router.delete("/users/me", auth, log, async (req, res) => {
  try {
    await req.user.remove();
    // sendCancelationEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

//Update password
router.patch("/password/:id", log, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ["firstName", "lastName", "role", "email", "password"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const user = await User.findOne({ email: _id });

    if (!user) {
      return res.status(404).send();
    }
    sendNewPassword(user.email, req.body.password);
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

//Delete user by id
router.delete("/users/:id", auth, log, async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    await user.remove();
    // sendCancelationEmail(req.user.email, req.user.name);
    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
});

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image"));
    }

    cb(undefined, true);
  },
});

//Upload avatar
router.post(
  "/users/me/avatar",
  auth, log,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

//Delete avatar
router.delete("/users/me/avatar", auth, log, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

//Read your avatar
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});

//Read all drivers
router.post("/drivers/list", async (req, res) => {
  try {
    const user = await User.find(
      {worksFor : req.body.worksFor}
  );

  if(!user){
    throw new Error();
  }
  
    res.send(user);
  } catch (e) {
    res.status(400).send();
  }
});

module.exports = router;
